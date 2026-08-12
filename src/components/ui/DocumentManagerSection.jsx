import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdFolder, MdAdd, MdDeleteOutline, MdEdit, MdCheck, MdClose, MdOpenInNew } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import StorageFileLink from "components/ui/StorageFileLink";
import { InputField, StorageDocumentField } from "components/form";

const EMPTY = { document_type: "", document_name: "", remarks: "" };

/**
 * Generic add/edit/delete manager for a "supporting documents" sub-resource
 * shaped like { id, document_type, document_name, document_file, remarks }.
 * Reused by Beneficiary, Staff, and Admin document CRUD — the API shape is
 * identical across all three, only the parent id and folder differ.
 *
 * Props:
 *   documents  – current list [{ id, document_type, document_name, document_file, remarks }]
 *   folder     – Spaces folder for new uploads (e.g. "beneficiaries/documents")
 *   onAdd      – (payload) => Promise
 *   onUpdate   – (id, payload) => Promise
 *   onDelete   – (id) => Promise
 *   loading    – true while the list itself is being fetched
 */
const DocumentManagerSection = ({ documents = [], folder, onAdd, onUpdate, onDelete, loading }) => {
  const { t } = useTranslation();
  const [addOpen, setAddOpen] = useState(false);
  const [newDoc, setNewDoc] = useState(EMPTY);
  const [newFileKey, setNewFileKey] = useState(null);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editDoc, setEditDoc] = useState(EMPTY);
  const [editOriginalFile, setEditOriginalFile] = useState(null);
  const [editFileKey, setEditFileKey] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const setN  = (f, v) => setNewDoc((p) => ({ ...p, [f]: v }));
  const setE  = (f, v) => setEditDoc((p) => ({ ...p, [f]: v }));

  const resetAddForm = () => { setAddOpen(false); setNewDoc(EMPTY); setNewFileKey(null); };
  const cancelEdit    = () => { setEditingId(null); setEditDoc(EMPTY); setEditFileKey(null); setEditOriginalFile(null); };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setEditDoc({ document_type: doc.document_type || "", document_name: doc.document_name || "", remarks: doc.remarks || "" });
    setEditFileKey(null);
    setEditOriginalFile(doc.document_file?.file_key ?? doc.document_file ?? null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDoc.document_name.trim() || !newFileKey) return;
    setAdding(true);
    try {
      await onAdd({ ...newDoc, document_file: newFileKey });
      resetAddForm();
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (id) => {
    setSaving(true);
    try {
      // PUT (not PATCH) — document_name/document_file are required by the API
      // on every save, so always resend the file: the newly-picked key, or
      // the document's existing one if it wasn't changed.
      const payload = { ...editDoc, document_file: editFileKey || editOriginalFile };
      await onUpdate(id, payload);
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <FormHeader icon={<MdFolder className="h-5 w-5" />} title={t("documents.section_title")} subtitle={t("documents.section_subtitle")} />
        <Button
          variant="ghost"
          icon={<MdAdd className="h-4 w-4" />}
          text={t("documents.add_btn")}
          onClick={() => (addOpen ? resetAddForm() : setAddOpen(true))}
        />
      </div>

      {addOpen && (
        <form onSubmit={handleAdd} className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("documents.name_label")} field="document_name" placeholder={t("documents.name_placeholder")}
              formData={newDoc} errors={{}} updateFormData={setN} rules={[{ required: true }]} />
            <InputField label={t("documents.type_label")} field="document_type" placeholder={t("documents.type_placeholder")}
              required={false} formData={newDoc} errors={{}} updateFormData={setN} />
          </div>
          <InputField label={t("documents.remarks_label")} field="remarks" required={false} formData={newDoc} errors={{}} updateFormData={setN} />
          <StorageDocumentField
            label={t("documents.file_label")}
            folder={folder}
            accept=".pdf,.jpg,.jpeg,.png"
            required
            onUpload={(key) => setNewFileKey(key)}
            onRemove={() => setNewFileKey(null)}
          />
          <div className="flex gap-2">
            <Button variant="ghost" text={t("common.cancel")} type="button" onClick={resetAddForm} className="flex-1" />
            <Button variant="primary" text={t("documents.add_submit")} type="submit" loading={adding} disabled={!newDoc.document_name.trim() || !newFileKey} className="flex-1" />
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-4 text-center text-xs text-slate-400">{t("documents.loading")}</p>
      ) : documents.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-400">{t("documents.empty")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="py-3">
              {editingId === doc.id ? (
                <div className="flex flex-col gap-3 rounded-xl border border-green/20 bg-green/5 p-4">
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <InputField label={t("documents.name_label")} field="document_name" formData={editDoc} errors={{}} updateFormData={setE} rules={[{ required: true }]} />
                    <InputField label={t("documents.type_label")} field="document_type" required={false} formData={editDoc} errors={{}} updateFormData={setE} />
                  </div>
                  <InputField label={t("documents.remarks_label")} field="remarks" required={false} formData={editDoc} errors={{}} updateFormData={setE} />
                  <StorageDocumentField
                    label={t("documents.file_label")}
                    folder={folder}
                    accept=".pdf,.jpg,.jpeg,.png"
                    currentName={doc.document_name}
                    currentUrl={doc.document_file?.public_url}
                    onUpload={(key) => setEditFileKey(key)}
                    onRemove={() => setEditFileKey(null)}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" text={t("common.cancel")} type="button" onClick={cancelEdit} icon={<MdClose className="h-3.5 w-3.5" />} className="flex-1" />
                    <Button variant="primary" text={t("documents.save_btn")} type="button" loading={saving} onClick={() => handleSave(doc.id)} icon={<MdCheck className="h-3.5 w-3.5" />} className="flex-1" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">{doc.document_name || doc.document_type}</p>
                    <p className="truncate text-xs text-slate-400">
                      {doc.document_type}{doc.remarks ? ` · ${doc.remarks}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {doc.document_file && (
                      <StorageFileLink fileKey={doc.document_file} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-green hover:bg-green/10">
                        <MdOpenInNew className="h-3.5 w-3.5" /> {t("documents.view_btn")}
                      </StorageFileLink>
                    )}
                    <button type="button" onClick={() => startEdit(doc)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                      <MdEdit className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDelete(doc.id)} disabled={deletingId === doc.id} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
                      <MdDeleteOutline className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentManagerSection;
