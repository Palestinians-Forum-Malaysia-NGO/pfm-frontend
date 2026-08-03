import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdPeople,
  MdEmail, MdPhone, MdCalendarToday, MdShield, MdVerified,
  MdPerson, MdFlag, MdLocationCity, MdHome, MdFlight,
  MdFamilyRestroom, MdBadge, MdUpdate, MdClose,
  MdCardTravel, MdAccountBalance, MdAttachMoney, MdFingerprint, MdWarning, MdChildCare,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import BeneficiaryDeleteModal from "./BeneficiaryDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import StorageImage from "components/ui/StorageImage";
import StorageFileLink from "components/ui/StorageFileLink";
import Loading from "components/loading/Loading";
import { useGetBeneficiary, useDeleteBeneficiary, useUpdateBeneficiary } from "components/features/beneficiaries/hooks";
import { ACCOUNT_STATUS_BADGE } from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_NAME_BY_CODE } from "components/features/beneficiaries/constants/countries";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function BeneficiaryDetailView() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { beneficiary, execute: fetchBeneficiary, loading, error } = useGetBeneficiary();
  const { execute: deleteBeneficiary, loading: deleteLoading, error: deleteError } = useDeleteBeneficiary();
  const { execute: updateBeneficiary, loading: statusSaving } = useUpdateBeneficiary();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [editingStatus,  setEditingStatus]  = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => { fetchBeneficiary(id).catch(() => {}); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusEdit = () => {
    setSelectedStatus(beneficiary.account_status ?? "");
    setEditingStatus(true);
  };

  const handleStatusSave = async () => {
    try {
      await updateBeneficiary(id, { account_status: selectedStatus });
      success(
        t("beneficiaries.toast_status_updated"),
        `${t("beneficiaries.toast_status_updated_sub")} ${t(`beneficiaries.account_status_${selectedStatus}`, { defaultValue: selectedStatus })}.`,
      );
      fetchBeneficiary(id).catch(() => {});
      setEditingStatus(false);
    } catch (err) {
      toastError(t("beneficiaries.toast_status_failed"), err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBeneficiary(id);
      success(t("beneficiaries.toast_deleted"), `${beneficiary?.user?.full_name} ${t("beneficiaries.toast_deleted_sub")}`);
      navigate(`${base}/beneficiaries`);
    } catch (err) {
      toastError(t("beneficiaries.toast_delete_failed"), err?.message);
    }
  };

  if (loading) return <Loading text={t("beneficiaries.loading")} />;
  if (error)   return <AlertBanner message={error} />;
  if (!beneficiary) return null;

  const u   = beneficiary.user ?? {};
  const fi  = beneficiary.family_information ?? {};
  const classifications = beneficiary.classifications ?? [];
  const bi  = u.banking_information  ?? {};
  const fin = u.financial_information ?? {};
  const hasBanking   = bi.bank_name || bi.account_number || bi.account_holder_name;
  const hasFinancial = fin.job_title || fin.salary || fin.payment_frequency;
  const children     = fi.children_information ?? [];

  const classDisplayName = (cls) => (cls.name_ar && i18n.language === "ar") ? cls.name_ar : cls.name;
  const classNamesSummary = classifications.map(classDisplayName).join(", ");

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title={u.full_name}
        subtitle={t("beneficiaries.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("beneficiaries.title")} onClick={() => navigate(`${base}/beneficiaries`)} />
            <DropdownButton
              label={t("beneficiaries.actions")}
              items={[
                { label: t("beneficiaries.edit_beneficiary"),   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/beneficiaries/${id}/edit`) },
                ...(isAdmin ? [
                  { divider: true },
                  { label: t("beneficiaries.delete_beneficiary"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
                ] : []),
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
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-green/10 text-2xl font-black ring-4 ring-white shadow-md text-green">
              {u.profile_photo
                ? <StorageImage fileKey={u.profile_photo} alt={u.full_name} className="h-full w-full object-cover" fallback={getInitials(u.full_name)} />
                : getInitials(u.full_name)
              }
            </div>
            <div className="flex items-center gap-1.5">
              {!editingStatus ? (
                <>
                  {beneficiary.account_status && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ACCOUNT_STATUS_BADGE[beneficiary.account_status] ?? "bg-slate-100 text-slate-500"}`}>
                      <MdVerified className="h-3.5 w-3.5" />
                      {t(`beneficiaries.account_status_${beneficiary.account_status}`, { defaultValue: beneficiary.account_status })}
                    </span>
                  )}
                  <button onClick={handleStatusEdit}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                    title={t("beneficiaries.change_status")}>
                    <MdEdit className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green">
                    {["active", "pending", "suspended", "rejected"].map((v) => (
                      <option key={v} value={v}>{t(`beneficiaries.account_status_${v}`)}</option>
                    ))}
                  </select>
                  <button onClick={handleStatusSave} disabled={statusSaving}
                    className="flex h-6 items-center rounded-full bg-green/10 px-2.5 text-xs font-semibold text-green transition-colors duration-150 hover:bg-green/20 disabled:opacity-50">
                    {statusSaving ? t("beneficiaries.saving") : t("beneficiaries.save")}
                  </button>
                  <button onClick={() => setEditingStatus(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600">
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{u.full_name}</h2>
          {u.full_name_ar && (
            <p className="mt-0.5 text-sm font-medium text-slate-500" dir="rtl">{u.full_name_ar}</p>
          )}
          <p className="mt-0.5 text-sm text-slate-400">{u.email}</p>
          {classNamesSummary && <p className="mt-1 text-xs font-medium text-green">{classNamesSummary}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              u.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {u.is_active ? t("beneficiaries.is_active") : t("beneficiaries.is_inactive")}
            </span>
            {u.password_reset_required && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                <MdWarning className="h-3.5 w-3.5" />
                {t("beneficiaries.password_reset")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Account Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("beneficiaries.section_account_info")} subtitle={t("beneficiaries.section_account_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label={t("beneficiaries.info_email")}      value={u.email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label={t("beneficiaries.info_phone")}      value={u.phone_number || "—"} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label={t("beneficiaries.info_role")}       value={t("beneficiaries.info_role_beneficiary")} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.info_registered")} value={fmtDate(u.created_at)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("beneficiaries.info_updated")}    value={fmtDate(u.updated_at)} />
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("beneficiaries.section_personal")} subtitle={t("beneficiaries.section_personal_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdBadge className="h-4 w-4" />}         label={t("beneficiaries.info_passport")} value={beneficiary.passport_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.info_dob")}      value={fmtDate(beneficiary.date_of_birth)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.info_gender")}
            value={t(`beneficiaries.gender_${beneficiary.gender}`, { defaultValue: beneficiary.gender ?? "—" })} />
          <InfoRow icon={<MdPeople className="h-4 w-4" />}        label={t("beneficiaries.info_marital")}
            value={t(`beneficiaries.marital_${beneficiary.marital_status}`, { defaultValue: beneficiary.marital_status ?? "—" })} />
        </div>
        {beneficiary.background && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-medium text-slate-400">{t("beneficiaries.info_background")}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{beneficiary.background}</p>
          </div>
        )}
        {beneficiary.id_document && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <MdBadge className="h-5 w-5 shrink-0 text-green" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">{t("beneficiaries.info_id_doc")}</p>
              <StorageFileLink fileKey={beneficiary.id_document} className="text-sm font-medium text-green hover:underline">
                {t("beneficiaries.view_doc")}
              </StorageFileLink>
            </div>
          </div>
        )}
      </div>

      {/* ── Location & Travel ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdFlight className="h-5 w-5" />} title={t("beneficiaries.section_location")} subtitle={t("beneficiaries.section_location_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdFlag className="h-4 w-4" />}         label={t("beneficiaries.info_country")}  value={COUNTRY_NAME_BY_CODE[beneficiary.country_of_origin] || beneficiary.country_of_origin || "—"} />
          <InfoRow icon={<MdFlight className="h-4 w-4" />}       label={t("beneficiaries.info_arrived")}  value={fmtDate(beneficiary.date_arrived_in_malaysia)} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />} label={t("beneficiaries.info_city")}     value={beneficiary.current_city || "—"} />
          <InfoRow icon={<MdHome className="h-4 w-4" />}         label={t("beneficiaries.info_address")}  value={beneficiary.address || "—"} />
        </div>
      </div>

      {/* ── Visa & Status ── */}
      {(beneficiary.has_visa != null || beneficiary.situation || beneficiary.palestine_region) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("beneficiaries.section_visa")} subtitle={t("beneficiaries.section_visa_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {beneficiary.has_visa != null && (
              <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("beneficiaries.info_visa_status")}
                value={beneficiary.has_visa ? t("beneficiaries.visa_has") : t("beneficiaries.visa_no")} />
            )}
            {beneficiary.has_visa && beneficiary.visa_type && (
              <InfoRow icon={<MdBadge className="h-4 w-4" />} label={t("beneficiaries.info_visa_type")}
                value={t(`beneficiaries.visa_type_${beneficiary.visa_type}`, { defaultValue: beneficiary.visa_type })} />
            )}
            {!beneficiary.has_visa && beneficiary.situation && (
              <InfoRow icon={<MdShield className="h-4 w-4" />} label={t("beneficiaries.info_situation")}
                value={t(`beneficiaries.situation_${beneficiary.situation}`, { defaultValue: beneficiary.situation })} />
            )}
            {beneficiary.unhcr_number && (
              <InfoRow icon={<MdFingerprint className="h-4 w-4" />} label={t("beneficiaries.info_unhcr")} value={beneficiary.unhcr_number} />
            )}
            {beneficiary.palestine_region && (
              <InfoRow icon={<MdFlag className="h-4 w-4" />} label={t("beneficiaries.info_palestine_region")}
                value={t(`beneficiaries.region_${beneficiary.palestine_region}`, { defaultValue: beneficiary.palestine_region })} />
            )}
          </div>
        </div>
      )}

      {/* ── Classification(s) ── */}
      {classifications.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdShield className="h-5 w-5" />} title={t("beneficiaries.section_classification_info")} subtitle={t("beneficiaries.section_classification_info_sub")} />
          <div className="flex flex-col gap-4">
            {classifications.map((cls) => (
              <div key={cls.id} className={classifications.length > 1 ? "rounded-xl border border-slate-200 bg-slate-50 p-3" : undefined}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow icon={<MdShield className="h-4 w-4" />}        label={t("beneficiaries.info_category")}    value={classDisplayName(cls)} />
                  <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.info_assigned")}    value={fmtDate(cls.assigned_at)} />
                  {cls.description && <InfoRow icon={<MdBadge className="h-4 w-4" />}  label={t("beneficiaries.info_description")} value={cls.description} />}
                  {cls.assigned_by && <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_assigned_by")} value={cls.assigned_by?.full_name || cls.assigned_by?.email} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Family Information ── */}
      {beneficiary.family_information && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title={t("beneficiaries.section_family_info")} subtitle={t("beneficiaries.section_family_info_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label={t("beneficiaries.info_family_malaysia")}
              value={fi.family_in_malaysia ? t("beneficiaries.info_yes") : t("beneficiaries.info_no")} />
            <InfoRow icon={<MdPeople className="h-4 w-4" />} label={t("beneficiaries.info_children_count")} value={fi.number_of_children ?? "—"} />
            {fi.spouse_name    && <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name")}    value={fi.spouse_name} />}
            {fi.spouse_name_ar && <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name_ar")} value={fi.spouse_name_ar} />}
            {fi.spouse_job     && <InfoRow icon={<MdBadge className="h-4 w-4" />}  label={t("beneficiaries.info_spouse_job")}     value={fi.spouse_job} />}
          </div>
        </div>
      )}

      {/* ── Children ── */}
      {children.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdChildCare className="h-5 w-5" />} title={t("beneficiaries.section_children")} subtitle={t("beneficiaries.section_family_info_sub")} />
          <div className="flex flex-col gap-3">
            {children.map((child, i) => (
              <div key={child.id ?? i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="mb-2 text-xs font-semibold text-slate-400">{t("beneficiaries.child_n", { n: i + 1 })}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {child.child_name    && <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.info_child_name")}    value={child.child_name} />}
                  {child.child_name_ar && <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.info_child_name_ar")} value={child.child_name_ar} />}
                  {child.child_date_of_birth && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.info_child_dob")} value={fmtDate(child.child_date_of_birth)} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Banking Information ── */}
      {hasBanking && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("beneficiaries.section_banking_info")} subtitle={t("beneficiaries.section_banking_info_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bi.bank_name           && <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("beneficiaries.info_bank_name")}      value={bi.bank_name} />}
            {bi.account_holder_name && <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("beneficiaries.info_account_holder")} value={bi.account_holder_name} />}
            {bi.account_number      && <InfoRow icon={<MdFingerprint className="h-4 w-4" />}    label={t("beneficiaries.info_account_no")}     value={bi.account_number} />}
          </div>
        </div>
      )}

      {/* ── Financial Information ── */}
      {hasFinancial && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("beneficiaries.section_financial_info")} subtitle={t("beneficiaries.section_financial_info_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fin.job_title         && <InfoRow icon={<MdBadge className="h-4 w-4" />}         label={t("beneficiaries.info_job_title")} value={fin.job_title} />}
            {fin.salary            && <InfoRow icon={<MdAttachMoney className="h-4 w-4" />}   label={t("beneficiaries.info_salary")}    value={`MYR ${fin.salary}`} />}
            {fin.payment_frequency && (
              <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.info_pay_freq")}
                value={t(`beneficiaries.freq_${fin.payment_frequency}`, { defaultValue: fin.payment_frequency })} />
            )}
          </div>
        </div>
      )}

      {/* ── Supporting Documents ── */}
      {beneficiary.supporting_documents?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("beneficiaries.section_documents")} subtitle={t("beneficiaries.section_documents_sub")} />
          <div className="flex flex-col gap-2">
            {beneficiary.supporting_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                  <p className="text-xs text-slate-400">{doc.document_type}</p>
                </div>
                {doc.document_file && (
                  <StorageFileLink fileKey={doc.document_file} className="text-xs font-medium text-green hover:underline">
                    {t("beneficiaries.doc_view")}
                  </StorageFileLink>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <BeneficiaryDeleteModal
        open={deleteOpen}
        beneficiary={beneficiary}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
