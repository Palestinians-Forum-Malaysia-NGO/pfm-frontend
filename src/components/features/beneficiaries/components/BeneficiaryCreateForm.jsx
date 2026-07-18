import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdPersonAdd, MdPerson, MdFlight,
  MdFamilyRestroom, MdInfoOutline, MdCardTravel,
} from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import {
  InputField, SelectField,
  ToggleInput, StorageDocumentField, StorageImageField, validate,
} from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateBeneficiary } from "components/features/beneficiaries/hooks";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
};

const EMPTY_CHILD = {
  child_name: "", child_name_arabic: "", child_date_of_birth: "",
  passport_copy: null, entrance_stump: null,
};

export default function BeneficiaryCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createBeneficiary, loading, error } = useCreateBeneficiary();
  const { success, error: toastError } = useToast();

  /* ── Form state ── */
  const [accountForm,  setAccountForm]  = useState({ full_name: "", email: "", phone_number: "", profile_photo: null });
  const [locationForm, setLocationForm] = useState({ country_of_origin: "", address: "" });
  const [familyForm, setFamilyForm] = useState({
    family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "",
    spouse_job: "", number_of_children: "",
  });
  const [children, setChildren] = useState([]);
  const [visaForm, setVisaForm] = useState({
    has_visa: "", visa_type: "", situation: "", unhcr_number: "", palestine_region: "",
  });
  const [errors,  setErrors]  = useState({});

  const setA  = (f, v) => setAccountForm((p)  => ({ ...p, [f]: v }));
  const setL  = (f, v) => setLocationForm((p) => ({ ...p, [f]: v }));
  const setFa = (f, v) => setFamilyForm((p)   => ({ ...p, [f]: v }));
  const setV  = (f, v) => setVisaForm((p)     => ({ ...p, [f]: v }));

  const setChild = (i, f, v) =>
    setChildren((prev) => prev.map((c, idx) => idx === i ? { ...c, [f]: v } : c));

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

  const canSubmit = accountForm.full_name.trim() && accountForm.email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(accountForm[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        full_name:    accountForm.full_name,
        email:        accountForm.email,
        phone_number: accountForm.phone_number || undefined,
        profile_photo: accountForm.profile_photo || undefined,

        has_visa:                 visaForm.has_visa === "true" ? true : visaForm.has_visa === "false" ? false : undefined,
        visa_type:                visaForm.has_visa === "true"  ? (visaForm.visa_type    || undefined) : undefined,
        situation:                visaForm.has_visa === "false" ? (visaForm.situation    || undefined) : undefined,
        unhcr_number:             (visaForm.has_visa === "false" && visaForm.situation === "refugee") ? (visaForm.unhcr_number || undefined) : undefined,
        palestine_region:         locationForm.country_of_origin === "PS" ? (visaForm.palestine_region || undefined) : undefined,
        country_of_origin:        locationForm.country_of_origin        || undefined,
        address:                  locationForm.address                  || undefined,

        family_information: {
          family_in_malaysia:  familyForm.family_in_malaysia,
          spouse_name:         familyForm.spouse_name        || null,
          spouse_name_arabic:  familyForm.spouse_name_arabic || null,
          spouse_job:          familyForm.spouse_job         || null,
          number_of_children:  familyForm.number_of_children !== "" ? Number(familyForm.number_of_children) : null,
          children_information: children.map((c) => ({
            child_name:          c.child_name         || undefined,
            child_name_arabic:   c.child_name_arabic  || undefined,
            child_date_of_birth: c.child_date_of_birth || undefined,
            passport_copy:       c.passport_copy      || undefined,
            entrance_stump:      c.entrance_stump     || undefined,
          })),
        },
      };

      const created = await createBeneficiary(payload);
      success(t("beneficiaries.toast_created"), `${accountForm.full_name} ${t("beneficiaries.toast_created_sub")}`);
      navigate(`${base}/beneficiaries/${created.id}`);
    } catch (err) {
      toastError(t("beneficiaries.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title={t("beneficiaries.add_title")}
        subtitle={t("beneficiaries.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("beneficiaries.back")} onClick={() => navigate(`${base}/beneficiaries`)} />
        }
      />

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <MdInfoOutline className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700">{t("beneficiaries.manual_info")}</p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("beneficiaries.section_account")} subtitle={t("beneficiaries.section_account_sub")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="beneficiaries/photos"
            onUpload={(key) => setA("profile_photo", key)}
            onRemove={() => setA("profile_photo", null)}
            errors={errors}
            field="profile_photo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.full_name")} field="full_name" placeholder="Ahmad Faris" formData={accountForm} errors={errors} updateFormData={setA} rules={RULES.full_name} />
            <InputField label={t("beneficiaries.email")}     field="email"     type="email" placeholder="ahmad@email.com" formData={accountForm} errors={errors} updateFormData={setA} rules={RULES.email} />
          </div>
          <InputField label={t("beneficiaries.phone")} field="phone_number" placeholder="+60 12-345 6789" required={false} formData={accountForm} errors={errors} updateFormData={setA} />
        </div>

        {/* ── Location ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFlight className="h-5 w-5" />} title={t("beneficiaries.section_location")} subtitle={t("beneficiaries.section_location_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label={t("beneficiaries.country_of_origin")} field="country_of_origin" options={COUNTRY_OPTIONS} required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField  label={t("beneficiaries.address")}            field="address"           placeholder="No. 1, Jalan…" required={false} formData={locationForm} errors={errors} updateFormData={setL} />
          </div>
        </div>

        {/* ── Visa & Status ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("beneficiaries.section_visa")} subtitle={t("beneficiaries.section_visa_sub")} />
          <SelectField label={t("beneficiaries.visa_status")} field="has_visa" options={HAS_VISA_OPTIONS_T} required={false} formData={visaForm} errors={errors} updateFormData={setV} />
          {visaForm.has_visa === "true" && (
            <SelectField label={t("beneficiaries.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS_T} required={false} formData={visaForm} errors={errors} updateFormData={setV} />
          )}
          {visaForm.has_visa === "false" && (
            <>
              <SelectField label={t("beneficiaries.situation")} field="situation" options={SITUATION_OPTIONS_T} required={false} formData={visaForm} errors={errors} updateFormData={setV} />
              {visaForm.situation === "refugee" && (
                <InputField label={t("beneficiaries.unhcr_number")} field="unhcr_number" placeholder="e.g. MYS/2023/12345" required={false} formData={visaForm} errors={errors} updateFormData={setV} />
              )}
            </>
          )}
          {locationForm.country_of_origin === "PS" && (
            <SelectField label={t("beneficiaries.palestine_region")} field="palestine_region" options={PALESTINE_REGION_OPTIONS_T} required={false} formData={visaForm} errors={errors} updateFormData={setV} />
          )}
        </div>

        {/* ── Family Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title={t("beneficiaries.section_family")} subtitle={t("beneficiaries.section_family_sub")} />
          <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" formData={familyForm} errors={errors} updateFormData={setFa} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.spouse_name")}        field="spouse_name"        placeholder="Fatimah binti Ali" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label={t("beneficiaries.spouse_name_ar_label")} field="spouse_name_arabic" placeholder={t("beneficiaries.spouse_name_ar_placeholder")} required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.spouse_job")}         field="spouse_job"         placeholder="Teacher"      required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label={t("beneficiaries.number_of_children")} field="number_of_children" type="number" placeholder="0" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>

          {/* ── Children ── */}
          {children.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              {children.map((child, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">{t("beneficiaries.child_label", { num: i + 1 })}</p>
                    <button type="button" onClick={() => setChildren((p) => p.filter((_, idx) => idx !== i))}
                      className="text-xs font-medium text-red-400 transition-colors hover:text-red-600">
                      {t("beneficiaries.child_remove")}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <InputField label={t("beneficiaries.child_name")}        field="child_name"        placeholder="Ahmad Jr." formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                    <InputField label={t("beneficiaries.child_name_ar_label")} field="child_name_arabic" placeholder="أحمد"     formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                  </div>
                  <InputField label={t("beneficiaries.child_dob")} field="child_date_of_birth" type="date" formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <StorageDocumentField label={t("beneficiaries.passport_copy")}  folder="beneficiaries/children" accept=".pdf,.jpg,.jpeg,.png"
                      onUpload={(key) => setChild(i, "passport_copy",  key)}
                      onRemove={() => setChild(i, "passport_copy",  null)} field={`passport_copy_${i}`} errors={{}} />
                    <StorageDocumentField label={t("beneficiaries.entrance_stamp")} folder="beneficiaries/children" accept=".pdf,.jpg,.jpeg,.png"
                      onUpload={(key) => setChild(i, "entrance_stump", key)}
                      onRemove={() => setChild(i, "entrance_stump", null)} field={`entrance_stump_${i}`} errors={{}} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setChildren((p) => [...p, { ...EMPTY_CHILD }])}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green transition-colors hover:text-green-600"
          >
            {t("beneficiaries.add_child")}
          </button>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("beneficiaries.cancel")} onClick={() => navigate(`${base}/beneficiaries`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("beneficiaries.create_btn")}
            icon={<MdPersonAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!canSubmit || loading}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
