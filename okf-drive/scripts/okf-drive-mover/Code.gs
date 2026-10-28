/**
 * OKF-Drive mover, v1
 * https://github.com/hounw/okf-drive (MIT)
 *
 * Moves files inside OKF-Drive bundles for agents whose Drive tools can't
 * change a file's folder. Example: Claude's Google Drive connector fails
 * with "The caller does not have permission" when moving files inside a
 * Shared Drive, even for managers.
 *
 * How it works:
 *   1. The agent files the file as usual (name, header, Index line, Log line),
 *      and adds this line to the file's Drive description:
 *        okf-move-to: <destination folder ID>
 *   2. Every 5 minutes this script finds tagged files, checks the rules
 *      below, moves each one, and removes the tag line.
 *   3. If it can't move a file, it replaces the tag with
 *        okf-move-error: <reason> (<date>)
 *      so the next agent or person sees why.
 *
 * Rules (anything else is refused):
 *   - Only files, not folders.
 *   - The file must be inside a bundle: walking up from it, the first folder
 *     that holds a file named README and a subfolder whose name starts with
 *     "00 Inbox".
 *   - The destination must be inside that same bundle (not inside a child
 *     bundle), and not the Inbox or a folder inside it.
 *
 * It runs as the person who installs it, who must be able to move files in
 * those folders (for a Shared Drive: Content manager or Manager).
 *
 * Install: paste this file and appsscript.json into a new Apps Script project,
 * then run install() once. Details: references/mover.md in the skill.
 */

const VERSION = '1';
const TAG_RE = /^okf-move-to:[ \t]*([A-Za-z0-9_-]+)[ \t]*$/m;
const INBOX_PREFIX = '00 Inbox';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const MAX_DEPTH = 30;
const MAX_FILES_PER_RUN = 200;

// ---------- Install ----------

/** Run once from the editor: asks for permission, adds the 5-minute trigger, runs a first sweep. */
function install() {
  uninstall();
  ScriptApp.newTrigger('sweep').timeBased().everyMinutes(5).create();
  console.log('OKF-Drive mover v' + VERSION + ' installed: runs every 5 minutes as you.');
  sweep();
}

/** Removes the trigger. Tagged files then stay where they are. */
function uninstall() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'sweep'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
}

// ---------- Sweep ----------

/** Finds tagged files and moves them. Run by the trigger. */
function sweep() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return; // a previous run is still going
  try {
    const ids = findTagged_();
    let moved = 0, refused = 0;
    ids.slice(0, MAX_FILES_PER_RUN).forEach(function (id) {
      const r = moveOne_(id);
      if (r.status === 'moved') moved++;
      else if (r.status !== 'skipped') refused++;
    });
    if (moved || refused) console.log('Sweep: ' + moved + ' moved, ' + refused + ' refused.');
  } finally {
    lock.releaseLock();
  }
}

/**
 * IDs of files whose description carries the tag. Two routes, because
 * full-text search may index descriptions with a delay: (a) full-text
 * search for the tag anywhere, (b) every file directly inside an Inbox.
 */
function findTagged_() {
  const found = {};
  const take = function (f) { if (f.description && TAG_RE.test(f.description)) found[f.id] = true; };

  listAll_("fullText contains 'okf-move-to' and trashed = false and mimeType != '" + FOLDER_MIME + "'",
    'id, description').forEach(take);

  listAll_("name contains '" + INBOX_PREFIX + "' and mimeType = '" + FOLDER_MIME + "' and trashed = false",
    'id, name').forEach(function (inbox) {
      if (inbox.name.indexOf(INBOX_PREFIX) !== 0) return;
      listAll_("'" + inbox.id + "' in parents and trashed = false and mimeType != '" + FOLDER_MIME + "'",
        'id, description').forEach(take);
    });

  return Object.keys(found);
}

function listAll_(q, fields) {
  const out = [];
  let pageToken;
  do {
    const res = Drive.Files.list({
      q: q,
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      pageSize: 100,
      pageToken: pageToken,
      fields: 'nextPageToken, files(' + fields + ')'
    });
    (res.files || []).forEach(function (f) { out.push(f); });
    pageToken = res.nextPageToken;
  } while (pageToken && out.length < 1000);
  return out;
}

// ---------- One move ----------

function moveOne_(fileId) {
  const r = { fileId: fileId };
  let file, desc;
  try {
    file = DriveApp.getFileById(fileId);
    r.title = file.getName();
    desc = file.getDescription() || '';
    const m = desc.match(TAG_RE);
    if (!m) { r.status = 'skipped'; return r; } // tag removed since the search
    if (file.isTrashed()) return refuse_(r, file, desc, 'file is in the trash');
    if (file.getMimeType() === FOLDER_MIME) return refuse_(r, file, desc, 'folders are not moved; move it by hand');

    const parents = list_(file.getParents());
    if (parents.length !== 1) return refuse_(r, file, desc, 'file must have exactly one parent folder');
    const bundle = bundleOf_(parents[0]);
    if (!bundle) return refuse_(r, file, desc, 'file is not inside an OKF-Drive bundle');

    let dest;
    try {
      dest = DriveApp.getFolderById(m[1]);
    } catch (e) {
      return refuse_(r, file, desc, 'destination folder not found or not accessible');
    }
    if (dest.isTrashed()) return refuse_(r, file, desc, 'destination folder is in the trash');
    if (dest.getId() === parents[0].getId()) {
      clearTag_(file, desc);
      r.status = 'moved';
      return r; // already there
    }
    const destPath = ancestors_(dest);
    const inboxes = inboxesOf_(bundle);
    if (destPath.some(function (f) { return inboxes.indexOf(f.getId()) !== -1; })) {
      return refuse_(r, file, desc, 'destination is the Inbox or inside it');
    }
    const destBundle = bundleOf_(dest);
    if (!destBundle || destBundle.getId() !== bundle.getId()) {
      return refuse_(r, file, desc, 'destination is outside this bundle');
    }

    file.moveTo(dest);
    clearTag_(file, desc);
    r.status = 'moved';
    r.to = dest.getId();
    console.log('Moved "' + r.title + '" (' + fileId + ') to "' + dest.getName() + '" (' + r.to + ')');
    return r;
  } catch (err) {
    return refuse_(r, file, desc, 'error: ' + String((err && err.message) || err));
  }
}

/** Nearest folder, starting at `folder` and walking up, that holds a README and an Inbox. */
function bundleOf_(folder) {
  const path = ancestors_(folder);
  for (let i = 0; i < path.length; i++) {
    const f = path[i];
    if (f.getFilesByName('README').hasNext() && inboxesOf_(f).length) return f;
  }
  return null;
}

/** IDs of a folder's direct subfolders whose names start with "00 Inbox". */
function inboxesOf_(folder) {
  const ids = [];
  const it = folder.getFolders();
  while (it.hasNext()) {
    const sub = it.next();
    if (sub.getName().indexOf(INBOX_PREFIX) === 0) ids.push(sub.getId());
  }
  return ids;
}

/** The folder and its ancestors, nearest first. */
function ancestors_(folder) {
  const out = [];
  let current = folder;
  for (let i = 0; current && i < MAX_DEPTH; i++) {
    out.push(current);
    const up = current.getParents();
    current = up.hasNext() ? up.next() : null;
  }
  return out;
}

function clearTag_(file, desc) {
  file.setDescription(tidy_(desc.replace(TAG_RE, '')));
}

function refuse_(r, file, desc, reason) {
  r.status = 'refused';
  r.reason = reason;
  console.warn('Refused "' + (r.title || r.fileId) + '" (' + r.fileId + '): ' + reason);
  if (file && desc !== undefined) {
    try {
      const today = Utilities.formatDate(new Date(), 'Etc/UTC', 'yyyy-MM-dd');
      file.setDescription(tidy_(desc.replace(TAG_RE, 'okf-move-error: ' + reason + ' (' + today + ')')));
    } catch (e) {
      console.error('Could not write the error tag on ' + r.fileId + ': ' + e);
    }
  }
  return r;
}

function tidy_(text) {
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

function list_(iterator) {
  const out = [];
  while (iterator.hasNext()) out.push(iterator.next());
  return out;
}
