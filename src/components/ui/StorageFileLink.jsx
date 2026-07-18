import React from "react";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { isSafeUrl } from "utils/url";

/**
 * Renders an <a> whose href is resolved from a DigitalOcean Spaces file key.
 * Renders nothing while the URL is resolving or if resolution fails.
 */
const StorageFileLink = ({ fileKey, children, className }) => {
  const { url } = useStorageUrl(fileKey);
  if (!isSafeUrl(url)) return null;
  return (
    <a href={url} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
};

export default StorageFileLink;
