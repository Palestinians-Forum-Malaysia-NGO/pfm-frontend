import React from "react";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";

/**
 * Renders an <img> whose src is resolved from a DigitalOcean Spaces file key.
 * Shows a skeleton while loading; renders fallback (or nothing) if no key / resolution fails.
 */
const StorageImage = ({ fileKey, alt, className, fallback = null }) => {
  const { url, loading } = useStorageUrl(fileKey);

  if (!fileKey) return fallback;
  if (loading && !url) return <div className={`animate-pulse bg-slate-200 ${className ?? ""}`} />;
  if (!url) return fallback;
  return <img src={url} alt={alt ?? ""} className={className} />;
};

export default StorageImage;
