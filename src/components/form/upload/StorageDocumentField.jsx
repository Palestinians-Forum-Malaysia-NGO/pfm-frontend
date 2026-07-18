import React, { useMemo, useState } from "react";
import {
  MdCloudUpload, MdDeleteOutline, MdInsertDriveFile,
  MdErrorOutline, MdOpenInNew,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { WRAPPER, LABEL, ERROR_MSG } from "../utils/fieldStyles";
import useStorageUpload from "./useStorageUpload";
import { isSafeUrl } from "utils/url";

const EXT_TO_MIME = {
  ".pdf":  "application/pdf",
  ".doc":  "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
};

const MAX_SIZE_MB    = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Smart document / file upload field backed by DigitalOcean Spaces.
 * Handles the full presigned-upload flow internally.
 *
 * Props:
 *   label        – field label
 *   fileType     – "document" | "pdf" | "file"  (default: "document")
 *   folder       – Spaces folder, e.g. "cvs", "projects"
 *   accept       – input accept string (default: ".pdf,.doc,.docx")
 *   currentName  – display name for the existing file (e.g. "resume.pdf")
 *   currentUrl   – public URL of the current file (for an "Open" link)
 *   onUpload     – (fileKey: string | null) => void
 *   onRemove     – () => void — called when existing file is removed
 *   required     – show required asterisk
 *   errors       – validation errors object
 *   field        – key used to look up errors (default: "document")
 */
const StorageDocumentField = ({
  label,
  fileType = "document",
  folder,
  accept = ".pdf,.doc,.docx",
  currentName,
  currentUrl,
  onUpload,
  onRemove,
  required = false,
  errors,
  field = "document",
}) => {
  const { t } = useTranslation();
  const { file, isUploading, progress, error, handleFileChange, handleRemove } =
    useStorageUpload({ fileType, folder, onUpload });

  const [fileError, setFileError] = useState("");

  const allowedMimes = useMemo(
    () => accept.split(",").map((ext) => EXT_TO_MIME[ext.trim().toLowerCase()]).filter(Boolean),
    [accept]
  );

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (allowedMimes.length && !allowedMimes.includes(selected.type)) {
      setFileError(t("common.invalid_file_type", { types: accept }));
      e.target.value = "";
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setFileError(t("common.file_too_large", { size: MAX_SIZE_MB }));
      e.target.value = "";
      return;
    }
    setFileError("");
    handleFileChange(selected);
    e.target.value = "";
  };

  const hasExisting  = !file && (currentUrl || currentName);
  const showDropzone = !file && !hasExisting;

  return (
    <div className={WRAPPER}>
      {label && (
        <label className={LABEL}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ── Dropzone ── */}
      {showDropzone && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-all hover:border-green/75 hover:bg-green/10">
          <MdCloudUpload className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">
            {t("common.drag_drop_prefix")} <span className="font-semibold text-green">{t("common.browse")}</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">{accept}</p>
          <input type="file" accept={accept} className="hidden" onChange={handleChange} />
        </label>
      )}

      {/* ── Existing file ── */}
      {hasExisting && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green/15 text-green">
                <MdInsertDriveFile className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {currentName ?? t("common.uploaded_file")}
                </p>
                {isSafeUrl(currentUrl) && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-green hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("common.open")} <MdOpenInNew className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <label className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100">
                {t("common.replace")}
                <input type="file" accept={accept} className="hidden" onChange={handleChange} />
              </label>
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-100"
              >
                <MdDeleteOutline className="h-3.5 w-3.5" /> {t("common.remove")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── New file (uploading / done / failed) ── */}
      {file && (
        <div className={`rounded-xl border p-4 ${error ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${error ? "bg-red-100 text-red-500" : "bg-green/15 text-green"}`}>
                <MdInsertDriveFile className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${error ? "text-red-600" : "text-slate-900"}`}>
                  {file.name}
                </p>
                <p className={`text-xs ${error ? "text-red-400" : "text-slate-400"}`}>
                  {isUploading ? t("common.uploading_percent", { progress }) : error ? t("common.upload_failed") : t("common.uploaded")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-100 disabled:opacity-50"
            >
              <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
            </button>
          </div>

          {isUploading && (
            <div className="mt-3 h-1 w-full rounded-full bg-green/15">
              <div
                className="h-full rounded-full bg-green transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Validation / upload error banner ── */}
      {(fileError || error) && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5">
          <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{fileError || error}</p>
        </div>
      )}

      {errors?.[field] && <p className={ERROR_MSG}>{errors[field]}</p>}
    </div>
  );
};

export default StorageDocumentField;
