import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdFlag, MdAdd, MdDeleteOutline, MdEdit, MdCheck, MdClose, MdRadioButtonUnchecked,
  MdPeople, MdExpandMore, MdExpandLess,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";
import RowIconButton from "components/ui/buttons/RowIconButton";
import MilestoneBeneficiariesPanel from "./MilestoneBeneficiariesPanel";
import { useCreateMilestone, useUpdateMilestone, useDeleteMilestone } from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const EMPTY_FORM = { title: "", description: "", target_date: "", is_completed: false };

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function MilestoneSection({ projectId, initialMilestones = [] }) {
  const { t } = useTranslation();
  const [milestones, setMilestones] = useState(initialMilestones);
  const [addOpen,  setAddOpen]  = useState(false);
  const [addForm,  setAddForm]  = useState(EMPTY_FORM);
  const [editId,   setEditId]   = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState(null);

  const { execute: createMilestone, loading: creating } = useCreateMilestone();
  const { execute: updateMilestone, loading: updating } = useUpdateMilestone();
  const { execute: deleteMilestone, loading: deleting } = useDeleteMilestone();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const setA = (f, v) => setAddForm((p)  => ({ ...p, [f]: v }));
  const setE = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.title.trim()) return;
    try {
      const created = await createMilestone(projectId, {
        title:        addForm.title,
        description:  addForm.description || undefined,
        target_date:  addForm.target_date  || undefined,
        is_completed: addForm.is_completed,
      });
      setMilestones((prev) => [...prev, created]);
      setAddForm(EMPTY_FORM);
      setAddOpen(false);
      success(t("projects.toast_milestone_added"), addForm.title);
    } catch (err) {
      toastError(t("projects.toast_milestone_add_failed"), err?.message);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    try {
      const updated = await updateMilestone(projectId, editId, {
        title:        editForm.title,
        description:  editForm.description || undefined,
        target_date:  editForm.target_date  || undefined,
        is_completed: editForm.is_completed,
      });
      setMilestones((prev) => prev.map((m) => m.id === editId ? updated : m));
      setEditId(null);
      success(t("projects.toast_milestone_updated"));
    } catch (err) {
      toastError(t("projects.toast_milestone_update_failed"), err?.message);
    }
  };

  const handleToggle = async (milestone) => {
    try {
      const updated = await updateMilestone(projectId, milestone.id, { is_completed: !milestone.is_completed });
      setMilestones((prev) => prev.map((m) => m.id === milestone.id ? updated : m));
    } catch (err) {
      toastError(t("projects.toast_milestone_update_failed"), err?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMilestone(projectId, id);
      setMilestones((prev) => prev.filter((m) => m.id !== id));
      success(t("projects.toast_milestone_removed"));
    } catch (err) {
      toastError(t("projects.toast_milestone_delete_failed"), err?.message);
    }
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setEditForm({ title: m.title ?? "", description: m.description ?? "", target_date: m.target_date ? m.target_date.slice(0, 10) : "", is_completed: m.is_completed ?? false });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        <FormHeader icon={<MdFlag className="h-5 w-5" />} title={t("projects.milestones_title")} subtitle={t("projects.milestones_subtitle")} />
        <Button variant="ghost" icon={<MdAdd className="h-4 w-4" />} text={t("projects.milestone_add_btn")} onClick={() => setAddOpen((o) => !o)} />
      </div>

      {/* Add form */}
      {addOpen && (
        <form onSubmit={handleAdd} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
          <input
            value={addForm.title} onChange={(e) => setA("title", e.target.value)}
            placeholder={t("projects.milestone_title_placeholder")} required
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green"
          />
          <input
            value={addForm.description} onChange={(e) => setA("description", e.target.value)}
            placeholder={t("projects.milestone_desc_placeholder")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green"
          />
          <div className="flex items-center gap-3">
            <input type="date" value={addForm.target_date} onChange={(e) => setA("target_date", e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green focus:ring-1 focus:ring-green" />
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={addForm.is_completed} onChange={(e) => setA("is_completed", e.target.checked)} className="accent-green h-4 w-4 rounded" />
              {t("projects.milestone_completed")}
            </label>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={() => { setAddOpen(false); setAddForm(EMPTY_FORM); }} className="flex-1" />
            <Button variant="primary" text={t("projects.milestone_add_submit")} type="submit" loading={creating} disabled={!addForm.title.trim()} className="flex-1" />
          </div>
        </form>
      )}

      {/* Milestone list */}
      {milestones.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t("projects.no_milestones")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {milestones.map((m) =>
            editId === m.id ? (
              <form key={m.id} onSubmit={handleEdit} className="py-3 flex flex-col gap-3">
                <input value={editForm.title} onChange={(e) => setE("title", e.target.value)} placeholder={t("projects.milestone_edit_title_placeholder")} required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green focus:ring-1 focus:ring-green" />
                <input value={editForm.description} onChange={(e) => setE("description", e.target.value)} placeholder={t("projects.milestone_edit_desc_placeholder")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green focus:ring-1 focus:ring-green" />
                <div className="flex items-center gap-3">
                  <input type="date" value={editForm.target_date} onChange={(e) => setE("target_date", e.target.value)}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green focus:ring-1 focus:ring-green" />
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={editForm.is_completed} onChange={(e) => setE("is_completed", e.target.checked)} className="accent-green h-4 w-4" />
                    {t("projects.milestone_completed")}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={() => setEditId(null)} className="flex-1" />
                  <Button variant="primary" text={t("projects.milestone_save_btn")} type="submit" loading={updating} disabled={!editForm.title.trim()} className="flex-1" />
                </div>
              </form>
            ) : (
              <div key={m.id} className="py-3">
                <div className="flex items-start gap-3">
                  <button onClick={() => handleToggle(m)} className="mt-0.5 shrink-0 text-slate-400 hover:text-green transition-colors duration-150">
                    {m.is_completed
                      ? <MdCheck className="h-5 w-5 text-green" />
                      : <MdRadioButtonUnchecked className="h-5 w-5" />
                    }
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${m.is_completed ? "line-through text-slate-400" : "text-slate-900"}`}>{m.title}</p>
                    {m.description && <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>}
                    {m.target_date && <p className="mt-0.5 text-xs text-slate-400">{t("projects.target_prefix")} {fmtDate(m.target_date)}</p>}
                    <button
                      onClick={() => setExpandedId((cur) => (cur === m.id ? null : m.id))}
                      className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200"
                    >
                      <MdPeople className="h-3.5 w-3.5" />
                      {t("projects.milestone_beneficiaries_count", { count: m.beneficiaries_helped ?? 0 })}
                      {expandedId === m.id ? <MdExpandLess className="h-3.5 w-3.5" /> : <MdExpandMore className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <RowIconButton icon={<MdEdit className="h-3.5 w-3.5" />}          title={t("projects.edit_project")}   onClick={() => startEdit(m)} />
                    {isAdmin && (
                      <RowIconButton icon={<MdDeleteOutline className="h-3.5 w-3.5" />} title={t("projects.delete_project")} onClick={() => handleDelete(m.id)} variant="danger" disabled={deleting} />
                    )}
                  </div>
                </div>
                {expandedId === m.id && (
                  <MilestoneBeneficiariesPanel
                    projectId={projectId}
                    milestoneId={m.id}
                    onCountChange={(count) =>
                      setMilestones((prev) => prev.map((x) => (x.id === m.id ? { ...x, beneficiaries_helped: count } : x)))
                    }
                  />
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
