const STORAGE_KEY = "pfm_applied_events";

function readMap() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function hasApplied(userId, eventId) {
  if (!userId || !eventId) return false;
  const ids = readMap()[userId];
  return Array.isArray(ids) && ids.includes(eventId);
}

export function markApplied(userId, eventId) {
  if (!userId || !eventId) return;
  const map = readMap();
  const ids = map[userId] || [];
  if (!ids.includes(eventId)) ids.push(eventId);
  map[userId] = ids;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}
