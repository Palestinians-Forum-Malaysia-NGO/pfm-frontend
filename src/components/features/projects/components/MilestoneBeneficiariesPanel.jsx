import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdPeople, MdAdd, MdDeleteOutline, MdEdit, MdCheck, MdClose, MdPerson } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import { SearchableSelect, StorageCoverField } from "components/form";
import {
  useGetMilestoneBeneficiaries, useCreateMilestoneBeneficiary,
  useUpdateMilestoneBeneficiary, useDeleteMilestoneBeneficiary,
} from "components/features/projects/hooks";
import { useGetBeneficiaries } from "components/features/beneficiaries/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import { isSafeUrl } from "utils/url";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function MilestoneBeneficiariesPanel({ projectId, milestoneId, onCountChange }) {
  const { t } = useTranslation();
  const { beneficiaries: records, execute: fetchRecords, loading } = useGetMilestoneBeneficiaries();

  useEffect(() => { onCountChange?.(records.length); }, [records]); // eslint-disable-line react-hooks/exhaustive-deps
  const { beneficiaries: allBeneficiaries } = useGetBeneficiaries();
  const { execute: createRecord, loading: creating } = useCreateMilestoneBeneficiary();
  const { execute: updateRecord, loading: saving }   = useUpdateMilestoneBeneficiary();
  const { execute: deleteRecord, loading: deleting } = useDeleteMilestoneBeneficiary();
  const { success, error: toastError } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [newBeneficiaryId, setNewBeneficiaryId] = useState("");
  const [newProofKey, setNewProofKey] = useState(null);
  const [newNote, setNewNote] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editProofKey, setEditProofKey] = useState(null);
  const [editCurrentUrl, setEditCurrentUrl] = useState(null);
  const [editNote, setEditNote] = useState("");

  useEffect(() => { fetchRecords(projectId, milestoneId); }, [projectId, milestoneId]); // eslint-disable-line react-hooks/exhaustive-deps

  const beneficiaryOptions = allBeneficiaries.map((b) => ({ value: b.id, label: `${b.user?.full_name} (${b.user?.email})` }));

  const resetAddForm = () => { setAddOpen(false); setNewBeneficiaryId(""); setNewProofKey(null); setNewNote(""); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBeneficiaryId) return;
    try {
      const created = await createRecord(projectId, milestoneId, {
        beneficiary_id: newBeneficiaryId,
        proof: newProofKey || undefined,
        note:  newNote     || undefined,
      });
      fetchRecords(projectId, milestoneId);
      resetAddForm();
      success(t("projects.toast_milestone_beneficiary_added"), created.beneficiary?.full_name);
    } catch (err) {
      toastError(t("projects.toast_milestone_beneficiary_add_failed"), err?.message);
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditProofKey(null);
    setEditCurrentUrl(r.proof?.public_url || null);
    setEditNote(r.note || "");
  };
  const cancelEdit = () => { setEditingId(null); setEditProofKey(null); setEditCurrentUrl(null); setEditNote(""); };

  const handleSave = async (id) => {
    try {
      const payload = { note: editNote };
      if (editProofKey) payload.proof = editProofKey;
      await updateRecord(projectId, milestoneId, id, payload);
      fetchRecords(projectId, milestoneId);
      cancelEdit();
      success(t("projects.toast_milestone_beneficiary_saved"));
    } catch (err) {
      toastError(t("projects.toast_milestone_beneficiary_save_failed"), err?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRecord(projectId, milestoneId, id);
      fetchRecords(projectId, milestoneId);
      success(t("projects.toast_milestone_beneficiary_removed"));
    } catch (err) {
      toastError(t("projects.toast_milestone_beneficiary_remove_failed"), err?.message);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <MdPeople className="h-3.5 w-3.5" /> {t("projects.milestone_beneficiaries_title")}
        </p>
        <button type="button" onClick={() => (addOpen ? resetAddForm() : setAddOpen(true))}
          className="inline-flex items-center gap-1 rounded-lg bg-green/10 px-2.5 py-1 text-xs font-semibold text-green transition-colors hover:bg-green/20">
          <MdAdd className="h-3.5 w-3.5" /> {t("projects.milestone_beneficiary_add_btn")}
        </button>
      </div>

      {addOpen && (
        <form onSubmit={handleAdd} className="mb-3 rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-3">
          <SearchableSelect
            label={t("projects.milestone_beneficiary_select")} field="beneficiary_id"
            options={beneficiaryOptions} required
            formData={{ beneficiary_id: newBeneficiaryId }} errors={{}}
            updateFormData={(_, v) => setNewBeneficiaryId(v)}
          />
          <StorageCoverField
            label={t("projects.milestone_proof_label")}
            folder="projects/milestones"
            onUpload={(key) => setNewProofKey(key)}
            onRemove={() => setNewProofKey(null)}
          />
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={t("projects.milestone_note_placeholder")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green placeholder:text-slate-400"
          />
          <div className="flex gap-2">
            <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={resetAddForm} className="flex-1" />
            <Button variant="primary" text={t("projects.milestone_beneficiary_add_submit")} type="submit" loading={creating} disabled={!newBeneficiaryId} className="flex-1" />
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-4 text-center text-xs text-slate-400">{t("projects.loading")}</p>
      ) : records.length === 0 ? (
        <p className="py-4 text-center text-xs text-slate-400">{t("projects.no_milestone_beneficiaries")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-200">
          {records.map((r) => (
            <div key={r.id} className="py-3">
              {editingId === r.id ? (
                <div className="flex flex-col gap-3 rounded-xl border border-green/20 bg-green/5 p-3">
                  <StorageCoverField
                    label={t("projects.milestone_proof_label")}
                    folder="projects/milestones"
                    currentUrl={editCurrentUrl}
                    onUpload={(key) => { setEditProofKey(key); setEditCurrentUrl(null); }}
                    onRemove={() => setEditCurrentUrl(null)}
                  />
                  <input
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder={t("projects.milestone_note_placeholder")}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green"
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={cancelEdit} icon={<MdClose className="h-3.5 w-3.5" />} className="flex-1" />
                    <Button variant="primary" text={t("projects.milestone_save_btn")} type="button" loading={saving} onClick={() => handleSave(r.id)} icon={<MdCheck className="h-3.5 w-3.5" />} className="flex-1" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                    <MdPerson className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{r.beneficiary?.full_name}</span>
                      {r.beneficiary?.classifications?.map((c) => (
                        <span key={c} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{c}</span>
                      ))}
                    </div>
                    {r.note && <p className="mt-0.5 text-sm text-slate-600">{r.note}</p>}
                    {isSafeUrl(r.proof?.public_url) && (
                      <a href={r.proof.public_url} target="_blank" rel="noreferrer" className="mt-1.5 inline-block">
                        <img src={r.proof.public_url} alt={t("projects.milestone_proof_label")} className="h-16 w-16 rounded-lg border border-slate-200 object-cover" />
                      </a>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      {r.recorded_by ? `${r.recorded_by} · ` : ""}{fmtDate(r.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button onClick={() => startEdit(r)} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700">
                      <MdEdit className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} disabled={deleting} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50">
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
}
