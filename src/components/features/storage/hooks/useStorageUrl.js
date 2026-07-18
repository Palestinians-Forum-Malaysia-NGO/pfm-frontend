import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

const cache = new Map(); // key → { url, expiresAt }
const TTL   = 45 * 60 * 1000; // 45 min (presigned URLs typically expire in 1 hour)

// Every "file" field from the API is shaped { file_key, public_url } — a plain
// string key is only ever seen from legacy/manual callers.
const directUrlOf = (fileKey) => (fileKey && typeof fileKey === "object" ? fileKey.public_url ?? null : null);
const keyOf       = (fileKey) => (typeof fileKey === "string" ? fileKey : fileKey?.file_key ?? null);

export const resolveStorageUrl = async (fileKey) => {
  if (!fileKey) return null;
  const direct = directUrlOf(fileKey);
  if (direct) return direct;
  const key = keyOf(fileKey);
  if (!key) return null;
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.url;
  const data = await storageService.getPresignedDownloadUrl(key);
  const url  = data?.url ?? data?.download_url ?? (typeof data === "string" ? data : null);
  if (url) cache.set(key, { url, expiresAt: Date.now() + TTL });
  return url;
};

const useStorageUrl = (fileKey) => {
  const [url,     setUrl]     = useState(() => directUrlOf(fileKey));
  const [loading, setLoading] = useState(false);
  const depKey = directUrlOf(fileKey) ?? keyOf(fileKey);

  useEffect(() => {
    if (!fileKey) { setUrl(null); return; }
    const direct = directUrlOf(fileKey);
    if (direct) { setUrl(direct); return; }
    setLoading(true);
    resolveStorageUrl(fileKey)
      .then(setUrl)
      .catch(() => setUrl(null))
      .finally(() => setLoading(false));
  }, [depKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return { url, loading };
};

export default useStorageUrl;
