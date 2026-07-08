import { MdCloudUpload, MdDeleteOutline, MdInsertDriveFile, MdErrorOutline, MdPhotoCamera, MdClose } from "react-icons/md";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
const ALLOWED_FILE_TYPES = {
  mimeTypes: ["application/pdf", "image/png", "image/jpeg", "image/jpg"],
  extensions: [".pdf", ".png", ".jpg", ".jpeg"],
};

const IMAGE_ONLY_TYPES = {
  mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  extensions: ".png,.jpg,.jpeg",
};

const ImageUploadField = ({
  label, field,
  documentTypeId = null, formData = null, uploadHandler = null, removeHandler = null,
  simpleFile = null, onSimpleFileChange = null, onSimpleRemove = null,
  simpleUploading = false, simpleProgress = 0,
  existingUrl = null, onExistingRemove = null,
  errors, required = false, multiple = false, imageOnly = false, accept = null,
  maxSizeMB = null, recommendedDimensions = null,
}) => {
  const { t } = useTranslation();
  const resolvedAccept = accept ?? (imageOnly ? IMAGE_ONLY_TYPES.extensions : ALLOWED_FILE_TYPES.extensions.join(","));
  const resolvedMimeTypes = imageOnly ? IMAGE_ONLY_TYPES.mimeTypes : ALLOWED_FILE_TYPES.mimeTypes;
  const resolvedLabel = imageOnly ? t("common.image_types_label") : t("common.file_types_label");
  const resolvedMaxSizeMB = maxSizeMB ?? (imageOnly ? 2 : 10);
  const maxSizeBytes = resolvedMaxSizeMB * 1024 * 1024;

  const [fileError, setFileError] = useState("");
  const [imgError, setImgError] = useState(false);

  const previewUrl = useMemo(() => {
    if (!simpleFile) return null;
    return URL.createObjectURL(simpleFile);
  }, [simpleFile]);

  useEffect(() => { return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; }, [previewUrl]);
  useEffect(() => { setImgError(false); }, [existingUrl]);

  const isSimpleMode = !documentTypeId;
  const documents = !isSimpleMode ? (formData?.[field] || []) : [];
  const docFile = !isSimpleMode ? documents.find((d) => d.document_type_id === documentTypeId) : null;

  const handleDocUpload = async (e) => {
    if (!uploadHandler) return;
    const selected = e.target.files?.[0];
    if (selected && !resolvedMimeTypes.includes(selected.type)) {
      setFileError(t("common.invalid_file_type", { types: resolvedLabel }));
      e.target.value = "";
      return;
    }
    if (selected && selected.size > maxSizeBytes) {
      setFileError(t("common.file_too_large", { size: resolvedMaxSizeMB }));
      e.target.value = "";
      return;
    }
    setFileError("");
    await uploadHandler(e, documentTypeId);
  };

  const handleDocRemove = async () => { if (removeHandler) await removeHandler(documentTypeId); };

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

  const showDocFile    = !isSimpleMode && docFile;
  const showSimpleFile = isSimpleMode && simpleFile;
  const showExisting   = isSimpleMode && !simpleFile && existingUrl;
  const showDropzone   = !(showDocFile || showSimpleFile || showExisting);

  return (
    <div className="mb-4">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Simple mode — avatar with upload/remove badges */}
      {isSimpleMode && (
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
      )}

      {/* Document mode dropzone */}
      {showDropzone && !isSimpleMode && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-all hover:border-green/75 hover:bg-green/10">
          <MdCloudUpload className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">{t("common.drag_drop_prefix")} <span className="font-semibold text-green">{t("common.browse")}</span></p>
          <p className="mt-1 text-xs text-slate-400">{resolvedLabel} {t("common.types_accepted_suffix")}</p>
          <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleDocUpload} />
        </label>
      )}

      {/* Document file preview */}
      {showDocFile && (
        <div className={`rounded-xl border p-4 ${docFile.file_key ? "border-slate-200 bg-white" : "border-red-300 bg-red-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${docFile.file_key ? "bg-green/15 text-green" : "bg-red-100 text-red-500"}`}>
                <MdInsertDriveFile className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${docFile.file_key ? "text-slate-900" : "text-red-600"}`}>{docFile.name}</p>
                <p className={`text-xs ${docFile.file_key ? "text-slate-400" : "text-red-400"}`}>{docFile.size}</p>
              </div>
            </div>
            {docFile.file_key && (
              <button type="button" onClick={handleDocRemove} className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100">
                <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          {docFile.uploading && (
            <div className={`mt-3 h-1 w-full rounded-full ${docFile.file_key ? "bg-green/15" : "bg-red-100"}`}>
              <div className={`h-full rounded-full ${docFile.file_key ? "bg-green" : "bg-red-500"} transition-all`} style={{ width: `${docFile.progress || 0}%` }} />
            </div>
          )}
        </div>
      )}

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
