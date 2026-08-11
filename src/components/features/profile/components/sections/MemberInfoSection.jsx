import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdPerson, MdLocationOn, MdCalendarToday, MdTranslate,
  MdFamilyRestroom, MdAccountBalance, MdFolder, MdOpenInNew,
  MdCategory, MdEdit, MdCardTravel, MdBadge,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import StorageFileLink from "components/ui/StorageFileLink";
import { InputField, SelectField, ToggleInput, TextareaField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import { useGetStates } from "components/features/beneficiaries/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import { COUNTRY_NAME_BY_CODE, COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";

const STATUS_BADGE   = {
  pending:   "bg-amber-50 text-amber-600 border border-amber-200",
  active:    "bg-green/10 text-green border border-green/20",
  suspended: "bg-red-50 text-red-500 border border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const SectionCard = ({ icon, title, subtitle, actions, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <FormHeader icon={icon} title={title} subtitle={subtitle} actions={actions} />
    {children}
  </div>
);

const emptyForm = (profile) => {
  const p  = profile?.profile ?? {};
  const fi = p.family_information ?? {};
  const bi = profile?.banking_information ?? {};
  return {
    gender:                   p.gender                   ?? "",
    date_of_birth:            p.date_of_birth             ? p.date_of_birth.slice(0, 10) : "",
    marital_status:           p.marital_status            ?? "",
    country_of_origin:        p.country_of_origin         ?? "",
    date_arrived_in_malaysia: p.date_arrived_in_malaysia  ? p.date_arrived_in_malaysia.slice(0, 10) : "",
    current_city:             p.current_city              ?? "",
    state:                    p.state                     ?? "",
    address:                  p.address                   ?? "",
    background:               p.background                ?? "",
    has_visa:                 p.has_visa === true ? "true" : p.has_visa === false ? "false" : "",
    visa_type:                p.visa_type                 ?? "",
    situation:                p.situation                 ?? "",
    unhcr_number:             p.unhcr_number              ?? "",
    palestine_region:         p.palestine_region          ?? "",
    family_in_malaysia:       fi.family_in_malaysia        ?? false,
    spouse_name:              fi.spouse_name               ?? "",
    spouse_name_arabic:       fi.spouse_name_ar            ?? "",
    spouse_job:               fi.spouse_job                ?? "",
    number_of_children:       fi.number_of_children        ?? "",
    bank_name:                bi.bank_name                 ?? "",
    account_number:           bi.account_number            ?? "",
    account_holder_name:      bi.account_holder_name       ?? "",
  };
};

const MemberInfoSection = ({ profile, onSaved }) => {
  const { t, i18n } = useTranslation();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { success, error: toastError } = useToast();
  const { states } = useGetStates();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [snapshot, setSnapshot] = useState(null);

  const p = profile?.profile;

  useEffect(() => {
    if (!profile) return;
    const initial = emptyForm(profile);
    setFormData(initial);
    setSnapshot(initial);
  }, [profile]);

  const updateFormData = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const isDirty = snapshot && JSON.stringify(formData) !== JSON.stringify(snapshot);

  const GENDER_OPTIONS_T = [
    { value: "male",   label: t("beneficiaries.gender_male") },
    { value: "female", label: t("beneficiaries.gender_female") },
  ];
  const MARITAL_OPTIONS_T = [
    { value: "single",   label: t("beneficiaries.marital_single") },
    { value: "married",  label: t("beneficiaries.marital_married") },
    { value: "divorced", label: t("beneficiaries.marital_divorced") },
    { value: "widowed",  label: t("beneficiaries.marital_widowed") },
  ];

  const GENDER_LABELS = { male: t("beneficiaries.gender_male"), female: t("beneficiaries.gender_female") };
  const MARITAL_LABELS = {
    single: t("beneficiaries.marital_single"), married: t("beneficiaries.marital_married"),
    divorced: t("beneficiaries.marital_divorced"), widowed: t("beneficiaries.marital_widowed"),
  };
  const ACCOUNT_STATUS_LABELS = {
    active: t("beneficiaries.account_status_active"), pending: t("beneficiaries.account_status_pending"),
    suspended: t("beneficiaries.account_status_suspended"), rejected: t("beneficiaries.account_status_rejected"),
  };

  const STATE_OPTIONS = states.map((s) => ({
    value: s.code,
    label: (s.label_ar && i18n.language === "ar") ? s.label_ar : s.label,
  }));
  const STATE_LABELS = Object.fromEntries(STATE_OPTIONS.map((s) => [s.value, s.label]));
  const HAS_VISA_OPTIONS_T = [
    { value: "",      label: t("beneficiaries.visa_status_unset") },
    { value: "true",  label: t("beneficiaries.visa_status_yes") },
    { value: "false", label: t("beneficiaries.visa_status_no") },
  ];
  const VISA_TYPE_OPTIONS_T = [
    { value: "student",      label: t("beneficiaries.visa_type_student") },
    { value: "work",         label: t("beneficiaries.visa_type_work") },
    { value: "dependent",    label: t("beneficiaries.visa_type_dependent") },
    { value: "social_visit", label: t("beneficiaries.visa_type_social_visit") },
    { value: "refugee_pass", label: t("beneficiaries.visa_type_refugee_pass") },
    { value: "other",        label: t("beneficiaries.visa_type_other") },
  ];
  const SITUATION_OPTIONS_T = [
    { value: "refugee",       label: t("beneficiaries.situation_refugee") },
    { value: "asylum_seeker", label: t("beneficiaries.situation_asylum_seeker") },
    { value: "undocumented",  label: t("beneficiaries.situation_undocumented") },
    { value: "overstayed",    label: t("beneficiaries.situation_overstayed") },
  ];
  const PALESTINE_REGION_OPTIONS_T = [
    { value: "gaza",            label: t("beneficiaries.region_gaza") },
    { value: "west_bank",       label: t("beneficiaries.region_west_bank") },
    { value: "refugee_outside", label: t("beneficiaries.region_refugee_outside") },
  ];
  const VISA_TYPE_LABELS = Object.fromEntries(VISA_TYPE_OPTIONS_T.map((o) => [o.value, o.label]));
  const SITUATION_LABELS = Object.fromEntries(SITUATION_OPTIONS_T.map((o) => [o.value, o.label]));
  const PALESTINE_REGION_LABELS = Object.fromEntries(PALESTINE_REGION_OPTIONS_T.map((o) => [o.value, o.label]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hasBanking = profile.banking_information || formData.bank_name || formData.account_number || formData.account_holder_name;
      const hasVisaBool = formData.has_visa === "true" ? true : formData.has_visa === "false" ? false : undefined;
      await updateProfile({
        profile: {
          gender:                   formData.gender                   || undefined,
          date_of_birth:            formData.date_of_birth            || undefined,
          marital_status:           formData.marital_status           || undefined,
          country_of_origin:        formData.country_of_origin        || undefined,
          date_arrived_in_malaysia: formData.date_arrived_in_malaysia || undefined,
          current_city:             formData.current_city             || undefined,
          state:                    formData.state                    || undefined,
          address:                  formData.address                  || undefined,
          background:               formData.background               || undefined,
          has_visa:                 hasVisaBool,
          visa_type:                hasVisaBool === true  ? (formData.visa_type || undefined) : undefined,
          situation:                hasVisaBool === false ? (formData.situation || undefined) : undefined,
          unhcr_number:             (hasVisaBool === false && formData.situation === "refugee") ? (formData.unhcr_number || undefined) : undefined,
          palestine_region:         formData.country_of_origin === "PS" ? (formData.palestine_region || undefined) : undefined,
          family_information: {
            family_in_malaysia: formData.family_in_malaysia,
            spouse_name:        formData.spouse_name        || null,
            spouse_name_ar:     formData.spouse_name_arabic || null,
            spouse_job:         formData.spouse_job         || null,
            number_of_children: formData.number_of_children !== "" ? Number(formData.number_of_children) : null,
          },
        },
        ...(hasBanking ? {
          banking_information: {
            bank_name:           formData.bank_name           || undefined,
            account_number:      formData.account_number      || undefined,
            account_holder_name: formData.account_holder_name || undefined,
          },
        } : {}),
      });
      success(t("profile.toast_profile_updated"), t("profile.toast_profile_updated_sub"));
      setEditMode(false);
      onSaved?.();
    } catch (err) {
      toastError(t("profile.toast_profile_update_failed"), err?.message);
    }
  };

  const handleCancel = () => {
    if (snapshot) setFormData(snapshot);
    setEditMode(false);
  };

  if (!p) return null;

  const editAction = !editMode && (
    <Button variant="ghost" icon={<MdEdit className="h-4 w-4" />} text={t("profile.edit_btn")} onClick={() => setEditMode(true)} />
  );

  return (
    <form onSubmit={handleSubmit}>
      {/* ── Personal Info ── */}
      <SectionCard
        icon={<MdPerson className="h-5 w-5" />}
        title={t("beneficiaries.section_personal")}
        subtitle={t("profile.personal_sub")}
        actions={editAction}
      >
        {editMode ? (
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InfoRow icon={<MdBadge className="h-4 w-4" />}   label={t("apply.national_id")} value={p.national_id || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_passport")} value={p.passport_number || "—"} />
            <SelectField label={t("beneficiaries.gender")} field="gender" options={GENDER_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
            <InputField  label={t("beneficiaries.date_of_birth")} field="date_of_birth" type="date" required={false} formData={formData} updateFormData={updateFormData} />
            <SelectField label={t("beneficiaries.marital_status")} field="marital_status" options={MARITAL_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
            <SelectField label={t("beneficiaries.country_of_origin")} field="country_of_origin" options={COUNTRY_OPTIONS} required={false} formData={formData} updateFormData={updateFormData} />
            <InputField  label={t("beneficiaries.date_arrived")} field="date_arrived_in_malaysia" type="date" required={false} formData={formData} updateFormData={updateFormData} />
            <InputField  label={t("beneficiaries.current_city")} field="current_city" required={false} formData={formData} updateFormData={updateFormData} />
            <SelectField label={t("apply.state")} field="state" options={STATE_OPTIONS} required={false} formData={formData} updateFormData={updateFormData} />
            <InputField  label={t("beneficiaries.address")} field="address" required={false} formData={formData} updateFormData={updateFormData} />
            <div className="sm:col-span-2">
              <TextareaField label={t("apply.background")} field="background" required={false} formData={formData} updateFormData={updateFormData} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {profile.full_name_ar && (
              <InfoRow icon={<MdTranslate className="h-4 w-4" />} label={t("beneficiaries.full_name_ar_label")} value={profile.full_name_ar} />
            )}
            <InfoRow icon={<MdBadge className="h-4 w-4" />}         label={t("apply.national_id")}                value={p.national_id || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.info_passport")}      value={p.passport_number || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.gender")}            value={GENDER_LABELS[p.gender] ?? p.gender ?? "—"} />
            <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("beneficiaries.date_of_birth")}     value={fmtDate(p.date_of_birth)} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("beneficiaries.marital_status")}    value={MARITAL_LABELS[p.marital_status] ?? p.marital_status ?? "—"} />
            <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.country_of_origin")} value={COUNTRY_NAME_BY_CODE[p.country_of_origin] || p.country_of_origin || "—"} />
            <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("profile.arrived_in_malaysia")} value={fmtDate(p.date_arrived_in_malaysia)} />
            <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.current_city")}      value={p.current_city || "—"} />
            <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("apply.state")}                      value={STATE_LABELS[p.state] || p.state || "—"} />
            <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label={t("beneficiaries.address")}           value={p.address || "—"} />
            {p.background && (
              <div className="sm:col-span-2">
                <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("apply.background")} value={p.background} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{t("beneficiaries.account_status_label")}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[p.account_status] ?? "bg-slate-100 text-slate-500"}`}>
                {ACCOUNT_STATUS_LABELS[p.account_status] ?? p.account_status ?? "—"}
              </span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Visa & Immigration Status ── */}
      <SectionCard
        icon={<MdCardTravel className="h-5 w-5" />}
        title={t("apply.immigration_status")}
        subtitle={t("profile.visa_status_sub")}
      >
        {editMode ? (
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label={t("apply.visa_status")} field="has_visa" options={HAS_VISA_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
            {formData.has_visa === "true" && (
              <SelectField label={t("apply.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
            )}
            {formData.has_visa === "false" && (
              <>
                <SelectField label={t("apply.situation")} field="situation" options={SITUATION_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
                {formData.situation === "refugee" && (
                  <InputField label={t("apply.unhcr")} field="unhcr_number" required={false} formData={formData} updateFormData={updateFormData} />
                )}
              </>
            )}
            {formData.country_of_origin === "PS" && (
              <SelectField label={t("apply.palestine_region")} field="palestine_region" options={PALESTINE_REGION_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("apply.visa_status")} value={p.has_visa == null ? "—" : p.has_visa ? t("beneficiaries.visa_status_yes") : t("beneficiaries.visa_status_no")} />
            {p.has_visa && (
              <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("apply.visa_type")} value={VISA_TYPE_LABELS[p.visa_type] ?? p.visa_type ?? "—"} />
            )}
            {p.has_visa === false && (
              <>
                <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("apply.situation")} value={SITUATION_LABELS[p.situation] ?? p.situation ?? "—"} />
                {p.situation === "refugee" && (
                  <InfoRow icon={<MdBadge className="h-4 w-4" />} label={t("apply.unhcr")} value={p.unhcr_number || "—"} />
                )}
              </>
            )}
            {p.country_of_origin === "PS" && (
              <InfoRow icon={<MdLocationOn className="h-4 w-4" />} label={t("apply.palestine_region")} value={PALESTINE_REGION_LABELS[p.palestine_region] ?? p.palestine_region ?? "—"} />
            )}
            {p.id_document && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t("apply.id_document")}</span>
                <StorageFileLink fileKey={p.id_document} className="inline-flex items-center gap-1 text-xs font-medium text-green hover:underline">
                  {t("beneficiaries.doc_view")} <MdOpenInNew className="h-3 w-3" />
                </StorageFileLink>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* ── Classification (always read-only — staff-assigned) ── */}
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
      {(p.family_information || editMode) && (
        <SectionCard
          icon={<MdFamilyRestroom className="h-5 w-5" />}
          title={t("beneficiaries.section_family_info")}
          subtitle={t("profile.family_sub")}
        >
          {editMode ? (
            <>
              <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" formData={formData} updateFormData={updateFormData} />
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <InputField label={t("beneficiaries.spouse_name")}          field="spouse_name"        required={false} formData={formData} updateFormData={updateFormData} />
                <InputField label={t("beneficiaries.spouse_name_ar_label")} field="spouse_name_arabic" required={false} placeholder={t("beneficiaries.spouse_name_ar_placeholder")} formData={formData} updateFormData={updateFormData} />
              </div>
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <InputField label={t("beneficiaries.spouse_job")}         field="spouse_job"         required={false} formData={formData} updateFormData={updateFormData} />
                <InputField label={t("beneficiaries.number_of_children")} field="number_of_children" type="number" required={false} formData={formData} updateFormData={updateFormData} />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label={t("beneficiaries.info_family_malaysia")} value={p.family_information.family_in_malaysia ? t("beneficiaries.info_yes") : t("beneficiaries.info_no")} />
              {p.family_information.spouse_name && (
                <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name")}         value={p.family_information.spouse_name} />
              )}
              {p.family_information.spouse_name_ar && (
                <InfoRow icon={<MdTranslate className="h-4 w-4" />} label={t("beneficiaries.info_spouse_name_ar")} value={p.family_information.spouse_name_ar} />
              )}
              {p.family_information.spouse_job && (
                <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("beneficiaries.info_spouse_job")}   value={p.family_information.spouse_job} />
              )}
              <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label={t("beneficiaries.info_children_count")}  value={p.family_information.number_of_children ?? "—"} />

              {p.family_information.children_information?.length > 0 && (
                <div className="col-span-full mt-2">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{t("beneficiaries.section_children")}</p>
                  <div className="flex flex-col gap-2">
                    {p.family_information.children_information.map((child, i) => (
                      <div key={child.id ?? i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <p className="text-sm font-medium text-slate-900">{child.child_name || t("beneficiaries.child_n", { n: i + 1 })}</p>
                        {child.child_name_ar && <p className="text-xs text-slate-400">{child.child_name_ar}</p>}
                        {child.child_date_of_birth && (
                          <p className="mt-1 text-xs text-slate-400">{t("profile.dob_prefix")} {fmtDate(child.child_date_of_birth)}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Banking Information ── */}
      {(profile.banking_information || editMode) && (
        <SectionCard
          icon={<MdAccountBalance className="h-5 w-5" />}
          title={t("beneficiaries.section_banking_info")}
          subtitle={t("beneficiaries.section_banking_info_sub")}
        >
          {editMode ? (
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <InputField label={t("beneficiaries.bank_name")}      field="bank_name"           required={false} formData={formData} updateFormData={updateFormData} />
              <InputField label={t("beneficiaries.account_holder")} field="account_holder_name" required={false} formData={formData} updateFormData={updateFormData} />
              <InputField label={t("beneficiaries.account_number")} field="account_number"      required={false} formData={formData} updateFormData={updateFormData} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("beneficiaries.info_bank_name")}     value={profile.banking_information.bank_name         || "—"} />
              <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("beneficiaries.info_account_no")}   value={profile.banking_information.account_number    || "—"} />
              <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("beneficiaries.info_account_holder")} value={profile.banking_information.account_holder_name || "—"} />
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Supporting Documents (always read-only) ── */}
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
                  <StorageFileLink
                    fileKey={doc.document_file}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-green/50 hover:text-green"
                  >
                    <MdOpenInNew className="h-3.5 w-3.5" /> {t("beneficiaries.doc_view")}
                  </StorageFileLink>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {editMode && (
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" text={t("common.cancel")} onClick={handleCancel} className="flex-1" />
          <Button type="submit" variant="primary" text={t("profile.save_changes")} loading={saving} disabled={!isDirty} className="flex-1" />
        </div>
      )}
    </form>
  );
};

export default MemberInfoSection;
