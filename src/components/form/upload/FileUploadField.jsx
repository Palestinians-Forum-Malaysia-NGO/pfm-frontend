import { MdCloudUpload, MdDeleteOutline, MdInsertDriveFile, MdErrorOutline } from "react-icons/md";
import React, { useState } from "react";
import { ALLOWED_FILE_TYPES } from "services/uploadService";

const FileUploadField = ({
  label, field, documentTypeId, formData, updateFormData, errors,
  required = false, multiple = false,
  accept = ALLOWED_FILE_TYPES.extensions.join(","),
  uploadHandler, removeHandler,
}) => {
  const [fileError, setFileError] = useState("");
  const documents = formData[field] || [];
  const file = documents.find((d) => d.document_type_id === documentTypeId);

  const handleUpload = async (e) => {
    if (!uploadHandler) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !ALLOWED_FILE_TYPES.mimeTypes.includes(selectedFile.type)) {
      setFileError(`Invalid file type. Only ${ALLOWED_FILE_TYPES.label} files are allowed.`);
      e.target.value = "";
      return;
    }
    setFileError("");
    await uploadHandler(e, documentTypeId);
    e.target.value = "";
  };

  const handleRemove = async () => {
    if (!removeHandler) return;
    await removeHandler(documentTypeId);
  };

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!file && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-all hover:border-green/75 hover:bg-green/10">
          <MdCloudUpload className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">
            Drag & drop or <span className="font-semibold text-green">browse</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">PDF, JPG, PNG accepted</p>
          <input type="file" multiple={multiple} accept={accept} className="hidden" onChange={handleUpload} />
        </label>
      )}

      {file && (
        <div className={`rounded-xl border p-4 ${file.file_key ? "border-slate-200 bg-white" : "border-red-300 bg-red-50"}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${file.file_key ? "bg-green/15 text-green" : "bg-red-100 text-red-500"}`}>
                <MdInsertDriveFile className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className={`truncate text-sm font-medium ${file.file_key ? "text-slate-900" : "text-red-600"}`}>{file.name}</p>
                <p className={`text-xs ${file.file_key ? "text-slate-400" : "text-red-400"}`}>{file.size}</p>
              </div>
            </div>
            {file.file_key && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100"
              >
                <MdDeleteOutline className="h-3.5 w-3.5" /> Remove
              </button>
            )}
          </div>
          {file.uploading && (
            <div className={`mt-3 h-1 w-full rounded-full ${file.file_key ? "bg-green/15" : "bg-red-100"}`}>
              <div
                className={`h-full rounded-full ${file.file_key ? "bg-green" : "bg-red-500"} transition-all`}
                style={{ width: `${file.progress || 0}%` }}
              />
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

export default FileUploadField;
