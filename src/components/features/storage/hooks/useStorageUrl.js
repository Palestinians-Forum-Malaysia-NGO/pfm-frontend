import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

const cache = new Map(); // fileKey → { url, expiresAt }
const TTL   = 45 * 60 * 1000; // 45 min (presigned URLs typically expire in 1 hour)

export const resolveStorageUrl = async (fileKey) => {
  if (!fileKey) return null;
  const hit = cache.get(fileKey);
  if (hit && hit.expiresAt > Date.now()) return hit.url;
  const data = await storageService.getPresignedDownloadUrl(fileKey);
  const url  = data?.url ?? data?.download_url ?? (typeof data === "string" ? data : null);
  if (url) cache.set(fileKey, { url, expiresAt: Date.now() + TTL });
  return url;
};

const useStorageUrl = (fileKey) => {
  const [url,     setUrl]     = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileKey) { setUrl(null); return; }
    setLoading(true);
    resolveStorageUrl(fileKey)
      .then(setUrl)
      .catch(() => setUrl(null))
      .finally(() => setLoading(false));
  }, [fileKey]);

  return { url, loading };
};

export default useStorageUrl;
