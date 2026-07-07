import React from "react";
import { useTranslation } from "react-i18next";
import {
  MdPerson, MdLocationOn, MdCalendarToday, MdTranslate,
  MdFamilyRestroom, MdAccountBalance, MdFolder, MdOpenInNew,
  MdCategory,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import { COUNTRY_NAME_BY_CODE } from "components/features/beneficiaries/constants/countries";

const STATUS_BADGE   = {
  pending:   "bg-amber-50 text-amber-600 border border-amber-200",
  active:    "bg-green/10 text-green border border-green/20",
  suspended: "bg-red-50 text-red-500 border border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const SectionCard = ({ icon, title, subtitle, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <FormHeader icon={icon} title={title} subtitle={subtitle} />
    {children}
  </div>
);

const MemberInfoSection = ({ profile }) => {
  const { t } = useTranslation();
  const p = profile?.profile;

  const GENDER_LABELS = { male: t("beneficiaries.gender_male"), female: t("beneficiaries.gender_female") };
  const MARITAL_LABELS = {
    single: t("beneficiaries.marital_single"), married: t("beneficiaries.marital_married"),
    divorced: t("beneficiaries.marital_divorced"), widowed: t("beneficiaries.marital_widowed"),
  };
  const ACCOUNT_STATUS_LABELS = {
    active: t("beneficiaries.account_status_active"), pending: t("beneficiaries.account_status_pending"),
    suspended: t("beneficiaries.account_status_suspended"), rejected: t("beneficiaries.account_status_rejected"),
  };

  if (!p) return null;

  return (
    <>
      {/* ── Personal Info ── */}
      <SectionCard
        icon={<MdPerson className="h-5 w-5" />}
        title={t("beneficiaries.section_personal")}
        subtitle={t("profile.personal_sub")}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {p.full_name_arabic && (
            <InfoRow icon={<MdTranslate className="h-4 w-4" />} label={t("beneficiaries.full_name_ar_label")} value={p.full_name_arabic} />
          )}
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.info_passport")}      value={p.passport_number || "—"} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.gender")}            value={GENDER_LABELS[p.gender] ?? p.gender ?? "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.date_of_birth")}     value={fmtDate(p.date_of_birth)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.marital_status")}    value={MARITAL_LABELS[p.marital_status] ?? p.marital_status ?? "—"} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.country_of_origin")} value={COUNTRY_NAME_BY_CODE[p.country_of_origin] || p.country_of_origin || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("profile.arrived_in_malaysia")} value={fmtDate(p.date_arrived_in_malaysia)} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.current_city")}      value={p.current_city || "—"} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.address")}           value={p.address || "—"} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{t("beneficiaries.account_status_label")}</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[p.account_status] ?? "bg-slate-100 text-slate-500"}`}>
              {ACCOUNT_STATUS_LABELS[p.account_status] ?? p.account_status ?? "—"}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ── Classification ── */}
      {p.classification_details && (
        <SectionCard
          icon={<MdCategory className="h-5 w-5" />}
          title={t("beneficiaries.section_classification_info")}
          subtitle={t("profile.classification_sub")}
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{p.classification_details.name}</p>
            {p.classification_details.description && (
              <p className="mt-0.5 text-xs text-slate-400">{p.classification_details.description}</p>
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Family Information ── */}
      {p.family_information && (
        <SectionCard
          icon={<MdFamilyRestroom className="h-5 w-5" />}
          title={t("beneficiaries.section_family_info")}
          subtitle={t("profile.family_sub")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label={t("beneficiaries.info_family_malaysia")} value={p.family_information.family_in_malaysia ? t("beneficiaries.info_yes") : t("beneficiaries.info_no")} />
            {p.family_information.spouse_name && (
              <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name")}         value={p.family_information.spouse_name} />
            )}
            {p.family_information.spouse_name_arabic && (
              <InfoRow icon={<MdTranslate className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name_ar")} value={p.family_information.spouse_name_arabic} />
            )}
            {p.family_information.spouse_job && (
              <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_job")}   value={p.family_information.spouse_job} />
            )}
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label={t("beneficiaries.info_children_count")}  value={p.family_information.number_of_children ?? "—"} />
          </div>

          {p.family_information.children_information?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">{t("beneficiaries.section_children")}</p>
              <div className="flex flex-col gap-2">
                {p.family_information.children_information.map((child, i) => (
                  <div key={child.id ?? i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">{child.child_name || t("beneficiaries.child_n", { n: i + 1 })}</p>
                    {child.child_name_arabic && <p className="text-xs text-slate-400">{child.child_name_arabic}</p>}
                    {child.child_date_of_birth && (
                      <p className="mt-1 text-xs text-slate-400">{t("profile.dob_prefix")} {fmtDate(child.child_date_of_birth)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Banking Information ── */}
      {p.banking_information && (
        <SectionCard
          icon={<MdAccountBalance className="h-5 w-5" />}
          title={t("beneficiaries.section_banking_info")}
          subtitle={t("beneficiaries.section_banking_info_sub")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("beneficiaries.info_bank_name")}     value={p.banking_information.bank_name         || "—"} />
            <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("beneficiaries.info_account_no")}   value={p.banking_information.account_number    || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("beneficiaries.info_account_holder")} value={p.banking_information.account_holder_name || "—"} />
          </div>
        </SectionCard>
      )}

      {/* ── Supporting Documents ── */}
      {p.supporting_documents?.length > 0 && (
        <SectionCard
          icon={<MdFolder className="h-5 w-5" />}
          title={t("beneficiaries.section_documents")}
          subtitle={t("profile.documents_sub")}
        >
          <div className="flex flex-col gap-2">
            {p.supporting_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.document_name || doc.document_type}</p>
                  {doc.remarks && <p className="mt-0.5 text-xs text-slate-400">{doc.remarks}</p>}
                </div>
                {doc.document_file && (
                  <a
                    href={doc.document_file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-green/50 hover:text-green"
                  >
                    <MdOpenInNew className="h-3.5 w-3.5" /> {t("beneficiaries.doc_view")}
                  </a>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </>
  );
};

export default MemberInfoSection;
