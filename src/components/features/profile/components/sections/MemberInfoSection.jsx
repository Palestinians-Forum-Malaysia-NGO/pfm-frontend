import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdPerson, MdLocationOn, MdCalendarToday, MdTranslate,
  MdFamilyRestroom, MdAccountBalance,
  MdCategory, MdEdit, MdCardTravel,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import { InputField, SelectField, ToggleInput, TextareaField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import {
  useGetStates, useGetBeneficiaryDocuments, useCreateBeneficiaryDocument,
  useUpdateBeneficiaryDocument, useDeleteBeneficiaryDocument,
} from "components/features/beneficiaries/hooks";
import DocumentManagerSection from "components/ui/DocumentManagerSection";
import { useToast } from "components/ui/toast/ToastContext";
import { COUNTRY_NAME_BY_CODE, COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import FamilyMembersEditor from "components/features/beneficiaries/components/FamilyMembersEditor";
import FamilyMembersView from "components/features/beneficiaries/components/FamilyMembersView";
import {
  memberFromApi, memberProblems, toMemberPayload, allowedDocTypes,
} from "components/features/beneficiaries/constants/family";

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
    palestine_region:         p.palestine_region          ?? "",
    family_in_malaysia:       fi.family_in_malaysia        ?? false,
    members:                  (fi.members ?? []).map(memberFromApi),
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

  // The beneficiary's own supporting documents — managed on
  // /beneficiaries/<own id>/documents/, which a beneficiary may use for
  // their own profile only.
  const { documents, execute: fetchDocuments, loading: docsLoading } = useGetBeneficiaryDocuments();
  const { execute: createDocument } = useCreateBeneficiaryDocument();
  const { execute: updateDocument } = useUpdateBeneficiaryDocument();
  const { execute: deleteDocument } = useDeleteBeneficiaryDocument();
  useEffect(() => { if (p?.id) fetchDocuments(p.id); }, [p?.id, fetchDocuments]);

  const docAction = (fn, okKey, failKey) => async (...args) => {
    try {
      await fn(p.id, ...args);
      success(t(okKey));
      fetchDocuments(p.id);
    } catch (err) {
      toastError(t(failKey), err?.message);
    }
  };

  useEffect(() => {
    if (!profile) return;
    const initial = emptyForm(profile);
    setFormData(initial);
    setSnapshot(initial);
  }, [profile]);

  const updateFormData = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const isDirty = snapshot && JSON.stringify(formData) !== JSON.stringify(snapshot);
  const membersChanged = snapshot && JSON.stringify(formData.members) !== JSON.stringify(snapshot.members);
  const membersValid = (formData.members ?? []).every((m) => memberProblems(m).length === 0);

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
          palestine_region:         formData.country_of_origin === "PS" ? (formData.palestine_region || undefined) : undefined,
          family_information: {
            family_in_malaysia: formData.family_in_malaysia,
            // Sending `members` replaces the whole list (and their documents),
            // so only send it when the user actually changed it.
            ...(membersChanged ? { members: formData.members.map(toMemberPayload) } : {}),
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
    <>
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
              <>
                <SelectField label={t("apply.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
              </>
            )}
            {formData.has_visa === "false" && (
              <>
                <SelectField label={t("apply.situation")} field="situation" options={SITUATION_OPTIONS_T} required={false} formData={formData} updateFormData={updateFormData} />
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
              <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("apply.situation")} value={SITUATION_LABELS[p.situation] ?? p.situation ?? "—"} />
            )}
            {p.country_of_origin === "PS" && (
              <InfoRow icon={<MdLocationOn className="h-4 w-4" />} label={t("apply.palestine_region")} value={PALESTINE_REGION_LABELS[p.palestine_region] ?? p.palestine_region ?? "—"} />
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
              <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" formData={formData} updateFormData={updateFormData}
                onText={t("beneficiaries.info_yes")} offText={t("beneficiaries.info_no")} hint={null} />
              <FamilyMembersEditor
                members={formData.members ?? []}
                onChange={(members) => updateFormData("members", members)}
                folder="beneficiaries/documents"
              />
            </>
          ) : (
            <FamilyMembersView family={p.family_information} beneficiaryName={profile.full_name} />
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

      {editMode && (
        <div className="mt-4 flex gap-3">
          <Button variant="ghost" text={t("common.cancel")} onClick={handleCancel} className="flex-1" />
          <Button type="submit" variant="primary" text={t("profile.save_changes")} loading={saving} disabled={!isDirty || !membersValid} className="flex-1" />
        </div>
      )}
    </form>

    {/* ── Supporting Documents — outside the profile <form>: the manager has
        its own add form, and forms can't be nested ── */}
    <DocumentManagerSection
      typeOptions={allowedDocTypes(p.has_visa == null ? "" : String(p.has_visa), p.situation)
        .map((v) => ({ value: v, label: t(`beneficiaries.doc_type_${v}`) }))}
      typeRequired
      withNumber
      ownerName={profile.full_name}
      documents={documents}
      loading={docsLoading}
      folder="beneficiaries/documents"
      onAdd={docAction(createDocument, "documents.toast_added", "documents.toast_add_failed")}
      onUpdate={docAction(updateDocument, "documents.toast_saved", "documents.toast_save_failed")}
      onDelete={docAction(deleteDocument, "documents.toast_deleted", "documents.toast_delete_failed")}
    />
    </>
  );
};

export default MemberInfoSection;
