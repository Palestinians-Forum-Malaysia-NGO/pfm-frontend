import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdBusiness,
  MdTag, MdCheckCircle, MdCalendarToday,
} from "react-icons/md";
import Button         from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import FormHeader     from "components/ui/form/FormHeader";
import InfoRow        from "components/ui/InfoRow";
import AlertBanner    from "components/ui/AlertBanner";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading        from "components/loading/Loading";
import BranchDeleteModal from "./BranchDeleteModal";
import { useGetBranch, useDeleteBranch } from "components/features/branches/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" });
};

export default function BranchDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { branch, execute: fetchBranch, loading, error } = useGetBranch();
  const { execute: deleteBranch, loading: deleteLoading, error: deleteError } = useDeleteBranch();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchBranch(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteBranch(id);
      success(t("branches.toast_deleted"), `"${branch?.name}" ${t("branches.toast_deleted_sub")}`);
      navigate(`${base}/branches`);
    } catch (err) {
      toastError(t("branches.toast_delete_failed"), err?.message);
    }
  };

  if (loading) return <Loading text={t("branches.loading")} />;
  if (error)   return <AlertBanner message={error} />;
  if (!branch) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdBusiness className="h-5 w-5" />}
        title={branch.name}
        subtitle={t("branches.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("branches.back")} onClick={() => navigate(`${base}/branches`)} />
            <DropdownButton
              label={t("branches.actions")}
              items={[
                { label: t("branches.edit"),   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/branches/${id}/edit`) },
                { divider: true },
                { label: t("branches.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
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
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 text-green ring-4 ring-white shadow-md">
              <MdBusiness className="h-8 w-8" />
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              branch.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${branch.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {branch.is_active ? t("branches.status_active") : t("branches.status_inactive")}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{branch.name}</h2>
          {branch.name_ar && (
            <p className="mt-0.5 text-base font-medium text-slate-500" dir="rtl">{branch.name_ar}</p>
          )}
        </div>
      </div>

      {/* ── Details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("branches.section_info_title")} subtitle={t("branches.section_info_subtitle")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdTag className="h-4 w-4" />}           label={t("branches.info_uid")}     value={branch.branch_uid} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />}   label={t("branches.info_status")}  value={branch.is_active ? t("branches.status_active") : t("branches.status_inactive")} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("branches.info_created")} value={formatDate(branch.created_at)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("branches.info_updated")} value={formatDate(branch.updated_at)} />
        </div>
      </div>

      <BranchDeleteModal
        open={deleteOpen}
        branch={branch}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
