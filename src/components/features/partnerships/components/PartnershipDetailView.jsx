import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdRestore, MdHandshake,
  MdLink, MdSort, MdCalendarToday, MdCheckCircle,
} from "react-icons/md";
import Button         from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import FormHeader     from "components/ui/form/FormHeader";
import InfoRow        from "components/ui/InfoRow";
import AlertBanner    from "components/ui/AlertBanner";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading        from "components/loading/Loading";
import PartnershipDeleteModal from "./PartnershipDeleteModal";
import { useGetPartnership, useDeletePartnership, useRestorePartnership } from "components/features/partnerships/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import { isSafeUrl } from "utils/url";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" });
};

export default function PartnershipDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { partnership, execute: fetchPartnership, loading, error } = useGetPartnership();
  const { execute: deletePartnership, loading: deleteLoading, error: deleteError } = useDeletePartnership();
  const { execute: restorePartnership, loading: restoreLoading } = useRestorePartnership();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchPartnership(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deletePartnership(id);
      success(t("partnerships.toast_deleted"), `${partnership?.name} ${t("partnerships.toast_deleted_sub")}`);
      navigate(`${base}/partnerships`);
    } catch (err) {
      toastError(t("partnerships.toast_delete_failed"), err?.message);
    }
  };

  const handleRestore = async () => {
    try {
      await restorePartnership(id);
      success(t("partnerships.toast_restored"), `${partnership?.name} ${t("partnerships.toast_restored_sub")}`);
      fetchPartnership(id);
    } catch (err) {
      toastError(t("partnerships.toast_restore_failed"), err?.message);
    }
  };

  if (loading)       return <Loading text={t("partnerships.loading")} />;
  if (error)         return <AlertBanner message={error} />;
  if (!partnership)  return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdHandshake className="h-5 w-5" />}
        title={partnership.name}
        subtitle={t("partnerships.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("partnerships.back")} onClick={() => navigate(`${base}/partnerships`)} />
            <DropdownButton
              label={t("partnerships.actions")}
              items={[
                { label: t("partnerships.edit"), icon: <MdEdit className="h-4 w-4" />, onClick: () => navigate(`${base}/partnerships/${id}/edit`) },
                { divider: true },
                partnership.is_active
                  ? { label: t("partnerships.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" }
                  : { label: t("partnerships.restore"), icon: <MdRestore className="h-4 w-4" />, onClick: handleRestore, disabled: restoreLoading },
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
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white ring-4 ring-white shadow-md">
              {partnership.logo?.public_url
                ? <img src={partnership.logo.public_url} alt={partnership.name} className="h-full w-full object-cover" />
                : <MdHandshake className="h-8 w-8 text-slate-300" />
              }
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              partnership.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${partnership.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {partnership.is_active ? t("partnerships.status_active") : t("partnerships.status_inactive")}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{partnership.name}</h2>
          <p className="mt-0.5 text-sm font-medium text-green">{t(`partnerships.type_${partnership.partnership_type}`, { defaultValue: partnership.partnership_type })}</p>
        </div>
      </div>

      {/* ── Details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdHandshake className="h-5 w-5" />} title={t("partnerships.section_info_title")} subtitle={t("partnerships.section_info_subtitle")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdLink className="h-4 w-4" />}          label={t("partnerships.info_website")} value={
            isSafeUrl(partnership.website_url)
              ? <a href={partnership.website_url} target="_blank" rel="noreferrer" className="text-green hover:underline">{t("partnerships.visit_link")}</a>
              : "—"
          } />
          <InfoRow icon={<MdSort className="h-4 w-4" />}          label={t("partnerships.info_order")}   value={partnership.order ?? "—"} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />}   label={t("partnerships.info_status")}  value={partnership.is_active ? t("partnerships.status_active") : t("partnerships.status_inactive")} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("partnerships.info_created")} value={formatDate(partnership.created_at)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("partnerships.info_updated")} value={formatDate(partnership.updated_at)} />
        </div>
      </div>

      <PartnershipDeleteModal
        open={deleteOpen}
        partnership={partnership}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
