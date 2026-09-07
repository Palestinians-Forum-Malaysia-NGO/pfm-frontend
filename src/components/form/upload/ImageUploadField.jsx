import { MdErrorOutline, MdPhotoCamera, MdClose, MdInsertDriveFile } from "react-icons/md";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
const IMAGE_ONLY_TYPES = {
  mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  extensions: ".png,.jpg,.jpeg",
};

const ImageUploadField = ({
  label, field,
  simpleFile = null, onSimpleFileChange = null, onSimpleRemove = null,
  simpleUploading = false, simpleProgress = 0,
  existingUrl = null, onExistingRemove = null,
  errors, required = false, multiple = false,
  maxSizeMB = null, recommendedDimensions = null,
}) => {
  const { t } = useTranslation();
  const resolvedAccept = IMAGE_ONLY_TYPES.extensions;
  const resolvedMimeTypes = IMAGE_ONLY_TYPES.mimeTypes;
  const resolvedLabel = t("common.image_types_label");
  const resolvedMaxSizeMB = maxSizeMB ?? 2;
  const maxSizeBytes = resolvedMaxSizeMB * 1024 * 1024;

  const [fileError, setFileError] = useState("");
  const [imgError, setImgError] = useState(false);

  const previewUrl = useMemo(() => {
    if (!simpleFile) return null;
    return URL.createObjectURL(simpleFile);
  }, [simpleFile]);

  useEffect(() => { return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; }, [previewUrl]);
  useEffect(() => { setImgError(false); }, [existingUrl]);

  const handleSimpleUpload = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!resolvedMimeTypes.includes(selected.type)) {
      setFileError(t("common.invalid_file_type", { types: resolvedLabel }));
      e.target.value = "";
      return;
    }
    if (selected.size > maxSizeBytes) {
      setFileError(t("common.file_too_large", { size: resolvedMaxSizeMB }));
      e.target.value = "";
      return;
    }
    setFileError("");
    onSimpleFileChange?.(selected);
    e.target.value = "";
  };

  const showSimpleFile = !!simpleFile;
  const showExisting   = !simpleFile && !!existingUrl;

  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Avatar with upload/remove badges */}
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <label className={`block h-full w-full overflow-hidden rounded-full bg-slate-50 ring-1 ring-slate-200 ${simpleUploading ? "pointer-events-none" : "cursor-pointer"}`}>
            {showSimpleFile && simpleFile.type?.startsWith("image/") ? (
              <img src={previewUrl} alt={t("common.preview")} className="h-full w-full object-cover" />
            ) : showExisting && !imgError ? (
              <img src={existingUrl} alt={t("common.current_image")} className="h-full w-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {showSimpleFile ? (
                  <MdInsertDriveFile className="h-6 w-6 text-green" />
                ) : (
                  <MdPhotoCamera className="h-6 w-6 text-slate-300" />
                )}
              </div>
            )}
            {simpleUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-xs font-bold text-white">{simpleProgress}%</span>
              </div>
            )}
            <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} disabled={simpleUploading} />
          </label>

          {/* Upload badge */}
          <label className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-green text-white ring-2 ring-white transition-all duration-150 hover:bg-green-600 ${simpleUploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}>
            <MdPhotoCamera className="h-3.5 w-3.5" />
            <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} disabled={simpleUploading} />
          </label>

          {/* Remove badge */}
          {(showSimpleFile || showExisting) && !simpleUploading && (
            <button
              type="button"
              onClick={() => { setFileError(""); showSimpleFile ? onSimpleRemove?.() : onExistingRemove?.(); }}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white ring-2 ring-white transition-all duration-150 hover:bg-red-600"
            >
              <MdClose className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-sm font-semibold text-slate-900">
            {(showSimpleFile || showExisting) ? t("common.change_photo") : t("common.upload_photo")}
          </p>
          <p className="text-xs text-slate-400">
            {recommendedDimensions
              ? t("common.image_size_hint", { dimensions: recommendedDimensions, size: resolvedMaxSizeMB })
              : `${resolvedLabel} ${t("common.types_accepted_suffix")}`}
          </p>
          {showSimpleFile && (
            <p className="truncate text-xs text-slate-500">{simpleFile.name}</p>
          )}
        </div>
      </div>

      {fileError && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5">
          <MdErrorOutline className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600">{fileError}</p>
        </div>
      )}

      {errors?.[field] && <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>}
    </div>
  );
};

export default ImageUploadField;
