import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDescription, MdAdd, MdDeleteOutline, MdEdit } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";
import RowIconButton from "components/ui/buttons/RowIconButton";
import {
  useGetDocumentRequirements, useCreateDocumentRequirement,
  useUpdateDocumentRequirement, useDeleteDocumentRequirement,
} from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const EMPTY_FORM = { document_name: "", document_type: "", description: "", is_required: true };

const inputCls = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green";

/* Add / edit form shared by the "add" panel and the inline row editor. */
const RequirementForm = ({ form, setForm, onCancel, onSubmit, saving, submitText }) => {
  const { t } = useTranslation();
  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <input value={form.document_name} onChange={(e) => set("document_name", e.target.value)} maxLength={100} required
        placeholder={t("projects.req_name_placeholder")} className={inputCls} />
      <input value={form.document_type} onChange={(e) => set("document_type", e.target.value)} maxLength={100}
        placeholder={t("projects.req_type_placeholder")} className={inputCls} />
      <input value={form.description} onChange={(e) => set("description", e.target.value)}
        placeholder={t("projects.req_desc_placeholder")} className={inputCls} />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={form.is_required} onChange={(e) => set("is_required", e.target.checked)} className="h-4 w-4 rounded accent-green" />
        {t("projects.req_required")}
      </label>
      <div className="flex gap-2">
        <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={onCancel} className="flex-1" />
        <Button variant="primary" text={submitText} type="submit" loading={saving} disabled={!form.document_name.trim()} className="flex-1" />
      </div>
    </form>
  );
};

export default function DocumentRequirementsSection({ projectId }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { requirements, execute: fetchRequirements, loading } = useGetDocumentRequirements();
  const { execute: createRequirement, loading: creating } = useCreateDocumentRequirement();
  const { execute: updateRequirement, loading: updating } = useUpdateDocumentRequirement();
  const { execute: deleteRequirement, loading: deleting } = useDeleteDocumentRequirement();
  const { success, error: toastError } = useToast();

  const [addOpen,  setAddOpen]  = useState(false);
  const [addForm,  setAddForm]  = useState(EMPTY_FORM);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchRequirements(projectId); }, [projectId, fetchRequirements]);

  const toPayload = (f) => ({
    document_name: f.document_name.trim(),
    document_type: f.document_type.trim() || null,
    description:   f.description.trim()   || null,
    is_required:   f.is_required,
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createRequirement(projectId, toPayload(addForm));
      success(t("projects.toast_req_added"), addForm.document_name);
      setAddForm(EMPTY_FORM);
      setAddOpen(false);
      fetchRequirements(projectId);
    } catch (err) {
      toastError(t("projects.toast_req_save_failed"), err?.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateRequirement(projectId, editId, toPayload(editForm));
      success(t("projects.toast_req_updated"));
      setEditId(null);
      fetchRequirements(projectId);
    } catch (err) {
      toastError(t("projects.toast_req_save_failed"), err?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequirement(projectId, id);
      success(t("projects.toast_req_removed"));
      fetchRequirements(projectId);
    } catch (err) {
      toastError(t("projects.toast_req_delete_failed"), err?.message);
    }
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setEditForm({
      document_name: r.document_name ?? "",
      document_type: r.document_type ?? "",
      description:   r.description   ?? "",
      is_required:   r.is_required   ?? true,
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <FormHeader icon={<MdDescription className="h-5 w-5" />} title={t("projects.req_title")} subtitle={t("projects.req_subtitle")} />
        <Button variant="ghost" icon={<MdAdd className="h-4 w-4" />} text={t("projects.req_add_btn")} onClick={() => setAddOpen((o) => !o)} />
      </div>

      {addOpen && (
        <div className="mb-4">
          <RequirementForm form={addForm} setForm={setAddForm} onSubmit={handleAdd} saving={creating}
            submitText={t("projects.req_add_submit")}
            onCancel={() => { setAddOpen(false); setAddForm(EMPTY_FORM); }} />
        </div>
      )}

      {loading && requirements.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t("projects.loading")}</p>
      ) : requirements.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t("projects.no_requirements")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {requirements.map((r) =>
            editId === r.id ? (
              <div key={r.id} className="py-3">
                <RequirementForm form={editForm} setForm={setEditForm} onSubmit={handleEdit} saving={updating}
                  submitText={t("projects.req_save_btn")} onCancel={() => setEditId(null)} />
              </div>
            ) : (
              <div key={r.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900" dir={isAr && r.document_name_ar ? "rtl" : undefined}>
                    {(isAr && r.document_name_ar) || r.document_name}
                    <span className={`ms-2 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.is_required ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"}`}>
                      {r.is_required ? t("projects.req_required_badge") : t("projects.req_optional_badge")}
                    </span>
                  </p>
                  {r.document_type && <p className="mt-0.5 text-xs text-slate-400">{r.document_type}</p>}
                  {((isAr && r.description_ar) || r.description) && (
                    <p className="mt-0.5 text-xs text-slate-500" dir={isAr && r.description_ar ? "rtl" : undefined}>
                      {(isAr && r.description_ar) || r.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <RowIconButton icon={<MdEdit className="h-3.5 w-3.5" />} title={t("projects.edit_project")} onClick={() => startEdit(r)} />
                  <RowIconButton icon={<MdDeleteOutline className="h-3.5 w-3.5" />} title={t("projects.delete_project")} onClick={() => handleDelete(r.id)} variant="danger" disabled={deleting} />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
