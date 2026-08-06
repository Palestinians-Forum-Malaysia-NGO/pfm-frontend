import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdBadge,
  MdEmail, MdPhone, MdShield, MdVerified, MdCalendarToday,
  MdWork, MdDomain, MdAccountBox, MdLocationCity, MdUpdate,
  MdAccountBalance, MdAttachMoney, MdPerson, MdFingerprint, MdWarning,
  MdCardTravel, MdInsertDriveFile, MdFlight, MdNumbers,
} from "react-icons/md";
import Button        from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FormHeader    from "components/ui/form/FormHeader";
import InfoRow       from "components/ui/InfoRow";
import AlertBanner   from "components/ui/AlertBanner";
import StaffDeleteModal from "./StaffDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading       from "components/loading/Loading";
import StorageImage  from "components/ui/StorageImage";
import StorageFileLink from "components/ui/StorageFileLink";
import { useGetStaff, useDeleteStaff } from "components/features/staff/hooks";
import { ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function StaffDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const base = useLayoutBase();

  const { staff, execute: fetchStaff, loading, error } = useGetStaff();
  const { execute: deleteStaff, loading: deleteLoading, error: deleteError } = useDeleteStaff();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchStaff(id).catch(() => {}); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteStaff(id);
      success(t("staff.toast_deleted"), `${staff?.user?.full_name} ${t("staff.toast_deleted_sub")}`);
      navigate(`${base}/staff`);
    } catch (err) {
      toastError(t("staff.toast_delete_failed"), err?.message);
    }
  };

  if (loading) return <Loading text={t("staff.loading", { defaultValue: "Loading…" })} />;
  if (error)   return <AlertBanner message={error} />;
  if (!staff)  return null;

  const u  = staff.user ?? {};
  const bi = u.banking_information  ?? {};
  const fi = u.financial_information ?? {};
  const hasBanking  = bi.bank_name || bi.account_number || bi.account_holder_name;
  const hasFinancial = fi.job_title || fi.salary || fi.payment_frequency;

  const deptDisplay   = (staff.department_ar && i18n.language === "ar") ? staff.department_ar : staff.department;
  const posDisplay    = (staff.position_ar    && i18n.language === "ar") ? staff.position_ar   : staff.position;
  const branchDisplay = (staff.branch_ar      && i18n.language === "ar") ? staff.branch_ar     : staff.branch;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdBadge className="h-5 w-5" />}
        title={u.full_name}
        subtitle={t("staff.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("staff.back")} onClick={() => navigate(`${base}/staff`)} />
            <DropdownButton
              label={t("staff.actions")}
              items={[
                { label: t("staff.edit_staff"),   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/staff/${id}/edit`) },
                { divider: true },
                { label: t("staff.delete_staff"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[u.role] ?? "from-blue-100 to-blue-50 text-blue-600"}`}>
              {u.profile_photo
                ? <StorageImage fileKey={u.profile_photo} alt={u.full_name} className="h-full w-full rounded-2xl object-cover" fallback={getInitials(u.full_name)} />
                : getInitials(u.full_name)
              }
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[u.role] ?? "bg-blue-50 text-blue-600 border-blue-100"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {t(`users.role_${u.role}`, { defaultValue: u.role ?? "Staff" })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{u.full_name}</h2>
          {u.full_name_ar && (
            <p className="mt-0.5 text-sm text-slate-400" dir="rtl">{u.full_name_ar}</p>
          )}
          <p className="mt-0.5 text-sm text-slate-400">{u.email}</p>
          {(posDisplay || deptDisplay) && (
            <p className="mt-0.5 text-sm font-medium text-slate-600">
              {posDisplay}{deptDisplay ? ` · ${deptDisplay}` : ""}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              u.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {u.is_active ? t("staff.is_active") : t("staff.is_inactive")}
            </span>
            {u.password_reset_required && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                <MdWarning className="h-3.5 w-3.5" />
                {t("staff.password_reset")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Account information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdAccountBox className="h-5 w-5" />} title={t("staff.section_account_info")} subtitle={t("staff.section_account_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label={t("staff.info_email")}           value={u.email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label={t("staff.info_phone")}           value={u.phone_number || "—"} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label={t("staff.info_role")}            value={t(`users.role_${u.role}`, { defaultValue: u.role ?? "—" })} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("staff.info_created")}        value={fmtDate(u.created_at)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("staff.info_updated")}        value={fmtDate(u.updated_at)} />
        </div>
      </div>

      {/* ── Staff profile ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("staff.section_profile")} subtitle={t("staff.section_profile_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdBadge className="h-4 w-4" />}         label={t("staff.info_employee_id")}  value={staff.employee_id || "—"} />
          <InfoRow icon={<MdDomain className="h-4 w-4" />}        label={t("staff.info_department")}   value={deptDisplay || "—"} />
          <InfoRow icon={<MdWork className="h-4 w-4" />}          label={t("staff.info_position")}     value={posDisplay || "—"} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />}  label={t("staff.info_branch")}       value={branchDisplay || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("staff.info_joining")} value={fmtDate(staff.joining_date)} />
        </div>
      </div>

      {/* ── Banking Information ── */}
      {hasBanking && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("staff.section_banking_info")} subtitle={t("staff.section_banking_info_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bi.bank_name           && <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("staff.info_bank_name")}      value={bi.bank_name} />}
            {bi.account_holder_name && <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("staff.info_account_holder")} value={bi.account_holder_name} />}
            {bi.account_number      && <InfoRow icon={<MdFingerprint className="h-4 w-4" />}    label={t("staff.info_account_no")} value={bi.account_number} />}
          </div>
        </div>
      )}

      {/* ── Financial Information ── */}
      {hasFinancial && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("staff.section_financial_info")} subtitle={t("staff.section_financial_info_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fi.job_title         && <InfoRow icon={<MdWork className="h-4 w-4" />}          label={t("staff.info_job_title")}      value={fi.job_title} />}
            {fi.job_title_ar      && <InfoRow icon={<MdWork className="h-4 w-4" />}          label={t("staff.job_title_ar_label")}  value={fi.job_title_ar} />}
            {fi.salary            && <InfoRow icon={<MdAttachMoney className="h-4 w-4" />}   label={t("staff.info_salary")}         value={`MYR ${fi.salary}`} />}
            {fi.payment_frequency && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("staff.info_pay_freq")}  value={t(`staff.freq_${fi.payment_frequency}`, { defaultValue: fi.payment_frequency })} />}
          </div>
        </div>
      )}

      {/* ── Documents & Visa ── */}
      {(staff.id_document || staff.has_visa) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("staff.section_visa")} subtitle={t("staff.section_visa_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {staff.id_document && (
              <InfoRow
                icon={<MdInsertDriveFile className="h-4 w-4" />}
                label={t("staff.id_document")}
                value={<StorageFileLink fileKey={staff.id_document} className="text-green hover:underline">{t("common.open")}</StorageFileLink>}
              />
            )}
            {staff.has_visa && staff.visa_type && (
              <InfoRow icon={<MdFlight className="h-4 w-4" />} label={t("staff.visa_type")} value={staff.visa_type} />
            )}
            {staff.has_visa && staff.visa_number && (
              <InfoRow icon={<MdNumbers className="h-4 w-4" />} label={t("staff.visa_number")} value={staff.visa_number} />
            )}
            {staff.has_visa && staff.visa_expiry_date && (
              <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("staff.visa_expiry_date")} value={fmtDate(staff.visa_expiry_date)} />
            )}
          </div>
        </div>
      )}

      <StaffDeleteModal
        open={deleteOpen}
        staff={staff}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
