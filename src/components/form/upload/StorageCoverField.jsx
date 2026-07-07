import React, { useState, useMemo, useEffect } from "react";
import { MdImage, MdDeleteOutline, MdErrorOutline, MdCloudUpload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import useStorageUpload from "./useStorageUpload";
import { ERROR_MSG } from "../utils/fieldStyles";

/**
 * Full-width landscape cover image upload field backed by DigitalOcean Spaces.
 * Designed for project covers, banners, and hero images — not profile avatars.
 *
 * Props:
 *   label        – field label
 *   fileType     – "image" | "thumbnail"  (default: "image")
 *   folder       – Spaces folder, e.g. "projects"
 *   currentUrl   – URL of the currently stored cover (shown when no local file staged)
 *   onUpload     – (fileKey: string | null) => void — called after upload OR removal
 *   onRemove     – () => void — called when the existing stored image is removed
 *   required     – show required asterisk
 *   errors       – validation errors object
 *   field        – key used to look up errors (default: "cover_image")
 *   aspectRatio  – Tailwind aspect class or px height for the preview (default: h-44)
 */
const ACCEPT = ".jpg,.jpeg,.png,.webp,.gif,.svg";
const MIME   = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

const StorageCoverField = ({
  label,
  fileType = "image",
  folder,
  currentUrl,
  onUpload,
  onRemove,
  required = false,
  errors,
  field = "cover_image",
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t("common.cover_image");
  const { file, isUploading, progress, error: uploadError, handleFileChange, handleRemove } =
    useStorageUpload({ fileType, folder, onUpload });

  const [fileError,  setFileError]  = useState("");
  const [imgFailed,  setImgFailed]  = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => { setImgFailed(false); }, [currentUrl]);

  const validate = (f) => {
    if (!MIME.includes(f.type)) {
      setFileError(t("common.cover_invalid_type"));
      return false;
    }
    setFileError("");
    return true;
  };

  const handleInput = (f) => { if (f && validate(f)) handleFileChange(f); };

  const onInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) handleInput(f);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleInput(f);
  };

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const handleExistingRemove = () => {
    setImgFailed(false);
    onRemove?.();
  };

  const handleNewRemove = () => {
    setFileError("");
    handleRemove();
  };

  const showDropzone   = !file && (!currentUrl || imgFailed);
  const showExisting   = !file && currentUrl && !imgFailed;
  const showNewPreview = !!file;

  return (
    <div className="mb-4">
      {resolvedLabel && (
        <label className="mb-2 block text-sm font-medium text-slate-900">
          {resolvedLabel} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* ── Dropzone (empty state) ── */}
      {showDropzone && (
        <label
          className={`group relative flex h-44 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-200
            ${isDragging
              ? "border-green bg-green/10 scale-[1.01]"
              : "border-slate-200 bg-slate-50 hover:border-green/60 hover:bg-green/5"
            }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${isDragging ? "bg-green/20 text-green" : "bg-slate-100 text-slate-400 group-hover:bg-green/10 group-hover:text-green"}`}>
            <MdImage className="h-6 w-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">
              {t("common.drop_image_prefix")} <span className="text-green">{t("common.browse")}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{t("common.cover_hint")}</p>
          </div>
          <input type="file" accept={ACCEPT} className="hidden" onChange={onInputChange} />
        </label>
      )}

      {/* ── Existing stored image ── */}
      {showExisting && (
        <div className="group relative h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img
            src={currentUrl}
            alt={t("common.cover_image")}
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white">
              <MdCloudUpload className="h-3.5 w-3.5" /> {t("common.replace")}
              <input type="file" accept={ACCEPT} className="hidden" onChange={onInputChange} />
            </label>
            <button
              type="button"
              onClick={handleExistingRemove}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"
            >
              <MdDeleteOutline className="h-3.5 w-3.5" /> {t("common.remove")}
            </button>
          </div>
        </div>
      )}

      {/* ── New file preview + upload progress ── */}
      {showNewPreview && (
        <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <img src={previewUrl} alt={t("common.preview")} className="h-full w-full object-cover" />

          {/* Upload overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-sm">
              <p className="text-sm font-bold text-white">{progress}%</p>
              <div className="h-2 w-40 overflow-hidden rounded-full bg-white/30">
                <div className="h-full rounded-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-white/80">{t("common.uploading")}</p>
            </div>
          )}

          {/* Controls when not uploading */}
          {!isUploading && (
            <div className="absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 hover:opacity-100">
              <label className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-sm transition hover:bg-white">
                <MdCloudUpload className="h-3.5 w-3.5" /> {t("common.replace")}
                <input type="file" accept={ACCEPT} className="hidden" onChange={onInputChange} />
              </label>
              <button
                type="button"
                onClick={handleNewRemove}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-red-600"
              >
                <MdDeleteOutline className="h-3.5 w-3.5" /> {t("common.remove")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Errors */}
      {(fileError || uploadError) && (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5">
          <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{fileError || uploadError}</p>
        </div>
      )}
      {errors?.[field] && <p className={`mt-1.5 ${ERROR_MSG}`}>{errors[field]}</p>}
    </div>
  );
};

export default StorageCoverField;
