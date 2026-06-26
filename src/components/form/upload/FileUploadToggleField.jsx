import { MdCloudUpload, MdDeleteOutline, MdInsertDriveFile } from "react-icons/md";
import React from "react";

const FileUploadToggleField = ({
  toggleLabel, uploadLabel, field, documentTypeId, formData, errors,
  required = false, multiple = false, accept = "*",
  enabled = false, onToggle, uploadHandler, removeHandler,
}) => {
  const documents = formData?.[field] || [];
  const file = documents.find((d) => d.document_type_id === documentTypeId);

  const handleUpload = async (e) => {
    if (!uploadHandler) return;
    await uploadHandler(e, documentTypeId);
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!removeHandler) return;
    await removeHandler(documentTypeId);
  };

  return (
    <div className="mb-5">
      <div className={`rounded-xl border transition-all ${enabled ? "border-green bg-green/10" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900">
              {toggleLabel}{required && <span className="ml-1 text-red-500">*</span>}
            </p>
            <p className="text-xs text-slate-400">Enable to allow file upload</p>
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={enabled} onChange={onToggle} className="peer sr-only" />
            <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-green" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </label>
        </div>

        {enabled && (
          <div className="space-y-3 border-t border-slate-200 px-4 py-4">
            <p className="text-sm font-medium text-slate-900">{uploadLabel}</p>

            {!file && (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-6 text-center transition-all hover:border-green/75 hover:bg-green/10">
                <MdCloudUpload className="mb-2 h-7 w-7 text-slate-400" />
                <p className="text-sm text-slate-500">Drag & drop or <span className="font-semibold text-green">browse</span></p>
                <p className="mt-1 text-xs text-slate-400">{accept === "*" ? "All files supported" : accept}</p>
                <input type="file" multiple={multiple} accept={accept} className="hidden" onChange={handleUpload} />
              </label>
            )}

            {file && (
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green/15 text-green">
                      <MdInsertDriveFile className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
                  >
                    <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
                {file.uploading && (
                  <div className="mt-3 h-1 w-full rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-green transition-all" style={{ width: `${file.progress || 0}%` }} />
                  </div>
                )}
              </div>
            )}

            {errors?.[field] && <p className="text-xs text-red-500">{errors[field]}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadToggleField;
