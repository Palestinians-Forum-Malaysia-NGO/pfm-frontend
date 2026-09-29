import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdVisibility, MdFileDownload } from "react-icons/md";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { isSafeUrl } from "utils/url";
import RowIconButton from "components/ui/buttons/RowIconButton";

const keyOf = (fileKey) => (typeof fileKey === "object" && fileKey !== null ? fileKey.file_key : fileKey) ?? "";

// Saved file name: "<document name> - <owner name>.<ext>", e.g.
// "UNHCR Card - Ahmad Khalil.pdf". Falls back to the stored file's own name
// ("documents/abc/unhcr-card.pdf" → "unhcr-card.pdf") when neither is known.
const clean = (s) => String(s ?? "").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
const downloadName = (fileKey, name, ownerName) => {
  const base = keyOf(fileKey).split("/").pop() || "document";
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")) : "";
  const label = [clean(name), clean(ownerName)].filter(Boolean).join(" - ");
  return label ? `${label}${ext}` : base;
};

/**
 * View + download icon buttons for a file stored in DigitalOcean Spaces.
 * Resolves a presigned URL (via useStorageUrl) like StorageFileLink does.
 *
 * Download fetches the file and saves it under its own name — a plain
 * <a download> is ignored for cross-origin URLs. If the fetch is blocked
 * (e.g. bucket CORS), it falls back to opening the file in a new tab.
 *
 *   fileKey   – storage key (or { file_key } object) of the file
 *   name      – document name (or type label) for the saved file
 *   ownerName – whose document it is (beneficiary / staff / applicant name)
 *   variant   – "row" (default): the app's standard RowIconButton pair;
 *               "prominent": larger icons, used on the beneficiary's own profile
 */
const PROMINENT_BTN = "flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-green/10 hover:text-green disabled:cursor-wait disabled:opacity-50";

const StorageFileActions = ({ fileKey, name, ownerName, variant = "row", className = "" }) => {
  const { t } = useTranslation();
  const { url } = useStorageUrl(fileKey, { forcePresigned: true });
  const [downloading, setDownloading] = useState(false);

  if (!keyOf(fileKey) || !isSafeUrl(url)) return null;

  const openFile = () => window.open(url, "_blank", "noopener,noreferrer");

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const objectUrl = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadName(fileKey, name, ownerName);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      openFile();
    } finally {
      setDownloading(false);
    }
  };

  if (variant === "prominent") {
    return (
      <div className={`flex shrink-0 items-center gap-0.5 ${className}`}>
        <a href={url} target="_blank" rel="noreferrer" className={PROMINENT_BTN}
          title={t("common.view_file")} aria-label={t("common.view_file")}>
          <MdVisibility className="h-4 w-4" />
        </a>
        <button type="button" onClick={handleDownload} disabled={downloading} className={PROMINENT_BTN}
          title={t("common.download_file")} aria-label={t("common.download_file")}>
          <MdFileDownload className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Same row-action buttons as the rest of the app (RowIconButton).
  return (
    <div className={`flex shrink-0 items-center gap-0.5 ${className}`}>
      <RowIconButton icon={<MdVisibility className="h-3.5 w-3.5" />} title={t("common.view_file")}
        variant="primary" onClick={openFile} />
      <RowIconButton icon={<MdFileDownload className="h-3.5 w-3.5" />} title={t("common.download_file")}
        variant="primary" onClick={handleDownload} disabled={downloading} />
    </div>
  );
};

export default StorageFileActions;
