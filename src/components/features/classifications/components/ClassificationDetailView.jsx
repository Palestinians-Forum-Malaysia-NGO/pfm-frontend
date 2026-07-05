import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdGroups,
  MdTextFields, MdPerson, MdCalendarToday,
} from "react-icons/md";
import Button         from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import FormHeader     from "components/ui/form/FormHeader";
import InfoRow        from "components/ui/InfoRow";
import AlertBanner    from "components/ui/AlertBanner";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading        from "components/loading/Loading";
import ClassificationDeleteModal from "./ClassificationDeleteModal";
import { useGetClassification, useDeleteClassification } from "components/features/classifications/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" });
};

export default function ClassificationDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { classification, execute: fetchClassification, loading, error } = useGetClassification();
  const { execute: deleteClassification, loading: deleteLoading, error: deleteError } = useDeleteClassification();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchClassification(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteClassification(id);
      success("Classification deleted", `"${classification?.name}" has been removed.`);
      navigate("/admin/classifications");
    } catch (err) {
      toastError("Failed to delete classification", err?.message);
    }
  };

  if (loading)          return <Loading text="Loading classification…" />;
  if (error)            return <AlertBanner message={error} />;
  if (!classification)  return null;

  const assignedBy = classification.assigned_by;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdGroups className="h-5 w-5" />}
        title={classification.name}
        subtitle="Classification Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Classifications" onClick={() => navigate("/admin/classifications")} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Classification",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/classifications/${id}/edit`) },
                { divider: true },
                { label: "Delete Classification", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 text-green ring-4 ring-white shadow-md">
              <MdGroups className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{classification.name}</h2>
          {classification.name_ar && (
            <p className="mt-0.5 text-base font-medium text-slate-500" dir="rtl">{classification.name_ar}</p>
          )}
          {classification.description && (
            <p className="mt-1 text-sm text-slate-500">{classification.description}</p>
          )}
        </div>
      </div>

      {/* ── Details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdGroups className="h-5 w-5" />} title="Classification Information" subtitle="Full details for this classification" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdTextFields className="h-4 w-4" />}     label="Name (English)"  value={classification.name} />
          <InfoRow icon={<MdTextFields className="h-4 w-4" />}     label="Name (Arabic)"   value={classification.name_ar || <span className="text-slate-300">—</span>} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />}  label="Created At"      value={formatDate(classification.assigned_at)} />
          {assignedBy && (
            <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Created By" value={
              <span>
                {assignedBy.full_name}
                {assignedBy.email && <span className="ml-1.5 text-xs text-slate-400">({assignedBy.email})</span>}
              </span>
            } />
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {classification.description && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="mb-1 text-xs font-medium text-slate-400">Description (English)</p>
              <p className="text-sm text-slate-700">{classification.description}</p>
            </div>
          )}
          {classification.description_ar && (
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3" dir="rtl">
              <p className="mb-1 text-xs font-medium text-slate-400">Description (Arabic)</p>
              <p className="text-sm text-slate-700">{classification.description_ar}</p>
            </div>
          )}
        </div>
      </div>

      <ClassificationDeleteModal
        open={deleteOpen}
        classification={classification}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
