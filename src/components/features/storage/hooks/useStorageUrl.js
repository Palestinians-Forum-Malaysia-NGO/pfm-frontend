import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

const cache = new Map(); // key → { url, expiresAt }
const TTL   = 45 * 60 * 1000; // 45 min (presigned URLs typically expire in 1 hour)

// Every "file" field from the API is shaped { file_key, public_url } — a plain
// string key is only ever seen from legacy/manual callers.
const directUrlOf = (fileKey) => (fileKey && typeof fileKey === "object" ? fileKey.public_url ?? null : null);
const keyOf       = (fileKey) => (typeof fileKey === "string" ? fileKey : fileKey?.file_key ?? null);

// forcePresigned skips the embedded public_url shortcut and always fetches a
// fresh presigned URL — used for document links (StorageFileLink), where we
// don't want to render/expose the raw permanent public_url in the DOM.
export const resolveStorageUrl = async (fileKey, { forcePresigned = false } = {}) => {
  if (!fileKey) return null;
  if (!forcePresigned) {
    const direct = directUrlOf(fileKey);
    if (direct) return direct;
  }
  const key = keyOf(fileKey);
  if (!key) return null;
  const cacheKey = forcePresigned ? `presigned:${key}` : key;
  const hit = cache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.url;
  const data = await storageService.getPresignedDownloadUrl(key);
  const url  = data?.url ?? data?.download_url ?? (typeof data === "string" ? data : null);
  if (url) cache.set(cacheKey, { url, expiresAt: Date.now() + TTL });
  return url;
};

const useStorageUrl = (fileKey, { forcePresigned = false } = {}) => {
  const [url,     setUrl]     = useState(() => (forcePresigned ? null : directUrlOf(fileKey)));
  const [loading, setLoading] = useState(false);
  const depKey = keyOf(fileKey) ?? (typeof fileKey === "object" ? fileKey?.public_url : null);

  useEffect(() => {
    if (!fileKey) { setUrl(null); return; }
    if (!forcePresigned) {
      const direct = directUrlOf(fileKey);
      if (direct) { setUrl(direct); return; }
    }
    setLoading(true);
    resolveStorageUrl(fileKey, { forcePresigned })
      .then(setUrl)
      .catch(() => setUrl(null))
      .finally(() => setLoading(false));
  }, [depKey, forcePresigned]); // eslint-disable-line react-hooks/exhaustive-deps

  return { url, loading };
};

export default useStorageUrl;
