import { MdCloudUpload, MdDeleteOutline, MdInsertDriveFile, MdErrorOutline, MdPhotoCamera } from "react-icons/md";
import React, { useState, useEffect, useMemo } from "react";
import { ALLOWED_FILE_TYPES } from "services/uploadService";

const IMAGE_ONLY_TYPES = {
  mimeTypes: ["image/png", "image/jpeg", "image/jpg"],
  extensions: ".png,.jpg,.jpeg",
  label: "PNG or JPG",
};

const ImageUploadField = ({
  label, field,
  documentTypeId = null, formData = null, uploadHandler = null, removeHandler = null,
  simpleFile = null, onSimpleFileChange = null, onSimpleRemove = null,
  simpleUploading = false, simpleProgress = 0,
  existingUrl = null, onExistingRemove = null,
  errors, required = false, multiple = false, imageOnly = false, accept = null,
}) => {
  const resolvedAccept = accept ?? (imageOnly ? IMAGE_ONLY_TYPES.extensions : ALLOWED_FILE_TYPES.extensions.join(","));
  const resolvedMimeTypes = imageOnly ? IMAGE_ONLY_TYPES.mimeTypes : ALLOWED_FILE_TYPES.mimeTypes;
  const resolvedLabel = imageOnly ? IMAGE_ONLY_TYPES.label : ALLOWED_FILE_TYPES.label;

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
      setFileError(`Invalid file type. Only ${resolvedLabel} files are allowed.`);
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
      setFileError(`Invalid file type. Only ${resolvedLabel} files are allowed.`);
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

      {/* Simple mode avatar dropzone */}
      {showDropzone && isSimpleMode && (
        <div className="flex flex-col items-center gap-2">
          <label className="group relative cursor-pointer">
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all group-hover:border-green/75 group-hover:bg-green/10">
              <MdPhotoCamera className="h-6 w-6 text-slate-400 group-hover:text-green" />
              <span className="mt-1 text-[10px] font-medium text-slate-400 group-hover:text-green">Upload</span>
            </div>
            <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
          </label>
          <p className="text-xs text-slate-400">{resolvedLabel} accepted</p>
        </div>
      )}

      {/* Document mode dropzone */}
      {showDropzone && !isSimpleMode && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition-all hover:border-green/75 hover:bg-green/10">
          <MdCloudUpload className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">Drag & drop or <span className="font-semibold text-green">browse</span></p>
          <p className="mt-1 text-xs text-slate-400">{resolvedLabel} accepted</p>
          <input type="file" multiple={multiple} accept={resolvedAccept} className="hidden" onChange={handleDocUpload} />
        </label>
      )}

      {/* Existing image preview */}
      {showExisting && (
        <div className="flex flex-col items-center gap-2">
          <div className="group relative">
            {imgError ? (
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-green/75 bg-green/10">
                <MdPhotoCamera className="h-5 w-5 text-green" />
                <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
              </label>
            ) : (
              <>
                <img src={existingUrl} alt="Current" className="h-24 w-24 rounded-xl object-cover ring-2 ring-green ring-offset-2" onError={() => setImgError(true)} />
                <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <MdPhotoCamera className="h-5 w-5 text-white" />
                  <span className="mt-0.5 text-[10px] font-medium text-white">Replace</span>
                  <input type="file" accept={resolvedAccept} className="hidden" onChange={handleSimpleUpload} />
                </label>
              </>
            )}
          </div>
          <button type="button" onClick={onExistingRemove} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100">
            <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      )}

      {/* New simple file preview */}
      {showSimpleFile && (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className={`h-24 w-24 overflow-hidden rounded-xl shadow-md ring-2 ring-offset-2 ${simpleUploading ? "ring-green/75" : "ring-green/75"}`}>
              {simpleFile.type?.startsWith("image/") ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${simpleUploading ? "bg-green/10" : "bg-green/10"}`}>
                  <MdInsertDriveFile className={`h-6 w-6 ${simpleUploading ? "text-green" : "text-green"}`} />
                </div>
              )}
            </div>
            {simpleUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                <span className="text-xs font-bold text-white">{simpleProgress}%</span>
              </div>
            )}
          </div>
          <p className="max-w-[140px] truncate text-center text-xs text-slate-500">{simpleFile.name}</p>
          {simpleUploading && (
            <div className="h-1 w-24 rounded-full bg-green/15">
              <div className="h-full rounded-full bg-green transition-all" style={{ width: `${simpleProgress}%` }} />
            </div>
          )}
          <button type="button" onClick={() => { setFileError(""); onSimpleRemove?.(); }} disabled={simpleUploading} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-100 disabled:opacity-50">
            <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
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
