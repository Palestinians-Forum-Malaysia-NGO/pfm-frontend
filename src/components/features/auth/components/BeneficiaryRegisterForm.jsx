import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdPersonAdd, MdArrowForward, MdArrowBack, MdEmail,
  MdBadge, MdFamilyRestroom, MdCheck, MdAdd, MdClose,
  MdCardTravel, MdFlight, MdPeople, MdCheckCircle,
} from "react-icons/md";
import InputField           from "components/form/InputField";
import SelectField          from "components/form/SelectField";
import TextareaField        from "components/form/TextareaField";
import ToggleInput          from "components/form/ToggleInput";
import StorageDocumentField from "components/form/upload/StorageDocumentField";
import AlertBanner          from "components/ui/AlertBanner";
import { validate }         from "components/form/utils/validation";
import { useRegister, useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { setTokens }        from "components/features/auth/utils";
import { OTP_PURPOSE }      from "components/features/auth/types";
import { useGetClassifications } from "components/features/beneficiaries/hooks";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";

/* ─────────────────────────────────────────────────
   Step config
───────────────────────────────────────────────── */
const useSteps = () => {
  const { t } = useTranslation();
  return [
    { n: 1, label: t("apply.step_account"),  icon: <MdPersonAdd className="h-4 w-4" /> },
    { n: 2, label: t("apply.step_personal"), icon: <MdBadge className="h-4 w-4" /> },
    { n: 3, label: t("apply.step_status"),   icon: <MdCardTravel className="h-4 w-4" /> },
    { n: 4, label: t("apply.step_family"),   icon: <MdFamilyRestroom className="h-4 w-4" /> },
  ];
};

/* ─────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────── */
const Hero = ({ step }) => {
  const { t } = useTranslation();
  const STEPS = useSteps();
  return (
  <div className="relative overflow-hidden bg-green px-6 pb-16 pt-14 text-center text-white">
    {/* Decorative dots */}
    <div className="pointer-events-none absolute inset-0 bg-dot-white bg-[size:24px_24px] opacity-[0.06]" />
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
    <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

    <div className="relative">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        <MdPeople className="h-3.5 w-3.5" />
        {t("apply.badge")}
      </span>

      <h1 className="mx-auto mt-5 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
        {t("apply.title")}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
        {t("apply.subtitle")}
      </p>

      {/* Step tracker */}
      <div className="mx-auto mt-10 flex max-w-xs items-center justify-center gap-0">
        {STEPS.map((s, i) => {
          const done   = s.n < step;
          const active = s.n === step;
          return (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ring-2 transition-all duration-300 ${
                  done   ? "bg-white text-green ring-white" :
                  active ? "bg-white/20 text-white ring-white" :
                           "bg-white/10 text-white/40 ring-white/20"
                }`}>
                  {done ? <MdCheck className="h-4 w-4" /> : s.n}
                </div>
                <span className={`text-[9px] font-semibold leading-none uppercase tracking-wider transition-colors duration-300 ${
                  active ? "text-white" : done ? "text-white/70" : "text-white/30"
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 mb-4 h-px flex-1 rounded-full transition-all duration-300 ${s.n < step ? "bg-white/60" : "bg-white/20"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  </div>
  );
};

/* ─────────────────────────────────────────────────
   Shared nav button classes
───────────────────────────────────────────────── */
const btnBack  = "flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]";
const btnNext  = "flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/30 transition-all duration-200 hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

/* ─────────────────────────────────────────────────
   Step 1 — Account
───────────────────────────────────────────────── */
const ACCOUNT_RULES = {
  full_name:    [{ required: true }, { maxLength: 255 }],
  email:        [{ required: true }, { email: true }],
  phone_number: [{ required: true }, { maxLength: 30 }],
};

const AccountStep = ({ data, onChange, onNext }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

  const canProceed = !Object.entries(ACCOUNT_RULES).some(([field, rules]) => !!validate(data[field], rules));

  const handleNext = () => {
    const newErrors = {};
    Object.entries(ACCOUNT_RULES).forEach(([field, rules]) => {
      const err = validate(data[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    onNext();
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdPersonAdd className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("apply.account_title")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("apply.account_subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <InputField label={t("apply.full_name")} field="full_name" placeholder="Ahmad Faris bin Abdullah"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.full_name} />
        <InputField label={t("apply.email")} field="email" type="email" placeholder="you@example.com"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.email} />
        <InputField label={t("apply.phone")} field="phone_number" placeholder="+60 12-345 6789"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.phone_number} />
      </div>

      <button type="button" onClick={handleNext} disabled={!canProceed}
        className={`mt-6 w-full ${btnNext}`}>
        {t("apply.continue")} <MdArrowForward className="h-4 w-4" />
      </button>

      <p className="mt-5 text-center text-sm text-slate-400">
        {t("apply.already_have")}{" "}
        <Link to="/auth/sign-in" className="font-medium text-green transition-colors hover:text-[#006833]">
          {t("apply.sign_in")}
        </Link>
      </p>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 2 — Personal Info
───────────────────────────────────────────────── */
const PERSONAL_RULES = {
  full_name_arabic: [{ required: true }, { maxLength: 255 }],
  passport_number:  [{ required: true }, { maxLength: 50 }],
  date_of_birth:    [{ required: true }],
  gender:           [{ required: true }],
  marital_status:   [{ required: true }],
  background:       [{ required: true }],
};

const PersonalStep = ({ data, onChange, idDoc, onIdDocChange, onBack, onNext }) => {
  const { t } = useTranslation();
  const [errors, setErrors]     = useState({});
  const [idDocError, setIdDocError] = useState(null);
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

  const GENDER_OPTIONS_T = [
    { value: "male",   label: t("beneficiaries.gender_male") },
    { value: "female", label: t("beneficiaries.gender_female") },
  ];
  const MARITAL_STATUS_OPTIONS_T = [
    { value: "single",   label: t("beneficiaries.marital_single") },
    { value: "married",  label: t("beneficiaries.marital_married") },
    { value: "divorced", label: t("beneficiaries.marital_divorced") },
    { value: "widowed",  label: t("beneficiaries.marital_widowed") },
  ];

  const canProceed =
    !Object.entries(PERSONAL_RULES).some(([field, rules]) => !!validate(data[field], rules)) && !!idDoc;

  const handleNext = () => {
    const newErrors = {};
    Object.entries(PERSONAL_RULES).forEach(([field, rules]) => {
      const err = validate(data[field], rules);
      if (err) newErrors[field] = err;
    });
    const idErr = idDoc ? null : t("validation.required");
    if (Object.keys(newErrors).length || idErr) {
      setErrors(newErrors);
      setIdDocError(idErr);
      return;
    }
    setErrors({});
    setIdDocError(null);
    onNext();
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdBadge className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("apply.personal_title")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("apply.personal_subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField label={t("apply.full_name_ar")} field="full_name_arabic" placeholder="أحمد فارس"
            formData={data} errors={errors} updateFormData={set} rules={PERSONAL_RULES.full_name_arabic} />
          <InputField label={t("apply.passport")} field="passport_number" placeholder="A12345678"
            formData={data} errors={errors} updateFormData={set} rules={PERSONAL_RULES.passport_number} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField label={t("apply.dob")} field="date_of_birth" type="date"
            formData={data} errors={errors} updateFormData={set} rules={PERSONAL_RULES.date_of_birth} />
          <SelectField label={t("apply.gender")} field="gender" options={GENDER_OPTIONS_T}
            formData={data} errors={errors} updateFormData={set} rules={PERSONAL_RULES.gender} />
        </div>
        <SelectField label={t("apply.marital_status")} field="marital_status" options={MARITAL_STATUS_OPTIONS_T}
          formData={data} errors={errors} updateFormData={set} rules={PERSONAL_RULES.marital_status} />
        <TextareaField label={t("apply.background")} field="background"
          placeholder={t("apply.background_placeholder")}
          formData={data} errors={errors} updateFormData={set} rows={3} rules={PERSONAL_RULES.background} />
        <StorageDocumentField
          label={t("apply.id_document")}
          folder="beneficiaries/documents"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          onUpload={(key) => { onIdDocChange(key); setIdDocError(null); }}
          onRemove={() => onIdDocChange(null)}
          currentName={idDoc ? t("common.uploaded_file") : undefined}
          field="id_document" errors={{ id_document: idDocError }}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> {t("apply.back")}
        </button>
        <button type="button" onClick={handleNext} disabled={!canProceed} className={btnNext}>
          {t("apply.continue")} <MdArrowForward className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 3 — Visa & Location
───────────────────────────────────────────────── */
const REQUIRED = [{ required: true }];

const validateVisaLocationStep = (visaData, locData) => {
  const visaErrors = {};
  const locErrors  = {};

  const hasVisaErr = validate(visaData.has_visa, REQUIRED);
  if (hasVisaErr) visaErrors.has_visa = hasVisaErr;

  if (visaData.has_visa === "true") {
    const err = validate(visaData.visa_type, REQUIRED);
    if (err) visaErrors.visa_type = err;
  } else if (visaData.has_visa === "false") {
    const err = validate(visaData.situation, REQUIRED);
    if (err) visaErrors.situation = err;
    if (visaData.situation === "refugee") {
      const uErr = validate(visaData.unhcr_number, REQUIRED);
      if (uErr) visaErrors.unhcr_number = uErr;
    }
  }

  const countryErr = validate(locData.country_of_origin, REQUIRED);
  if (countryErr) locErrors.country_of_origin = countryErr;
  if (locData.country_of_origin === "PS") {
    const regionErr = validate(visaData.palestine_region, REQUIRED);
    if (regionErr) visaErrors.palestine_region = regionErr;
  }

  const dateErr = validate(locData.date_arrived_in_malaysia, REQUIRED);
  if (dateErr) locErrors.date_arrived_in_malaysia = dateErr;
  const cityErr = validate(locData.current_city, REQUIRED);
  if (cityErr) locErrors.current_city = cityErr;
  const addrErr = validate(locData.address, REQUIRED);
  if (addrErr) locErrors.address = addrErr;

  return { visaErrors, locErrors };
};

const VisaLocationStep = ({ visaData, onVisaChange, locData, onLocChange, onBack, onNext }) => {
  const { t } = useTranslation();
  const [visaErrors, setVisaErrors] = useState({});
  const [locErrors,  setLocErrors]  = useState({});
  const setV = (f, v) => onVisaChange((p) => ({ ...p, [f]: v }));
  const setL = (f, v) => onLocChange((p)  => ({ ...p, [f]: v }));

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

  const { visaErrors: liveVisaErrors, locErrors: liveLocErrors } = validateVisaLocationStep(visaData, locData);
  const canProceed = Object.keys(liveVisaErrors).length === 0 && Object.keys(liveLocErrors).length === 0;

  const handleNext = () => {
    const { visaErrors: nextVisaErrors, locErrors: nextLocErrors } = validateVisaLocationStep(visaData, locData);
    if (Object.keys(nextVisaErrors).length || Object.keys(nextLocErrors).length) {
      setVisaErrors(nextVisaErrors);
      setLocErrors(nextLocErrors);
      return;
    }
    setVisaErrors({});
    setLocErrors({});
    onNext();
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdCardTravel className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("apply.visa_title")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("apply.visa_subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Visa status */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MdCardTravel className="h-3.5 w-3.5" /> {t("apply.immigration_status")}
          </p>
          <SelectField label={t("apply.visa_status")} field="has_visa" options={HAS_VISA_OPTIONS_T}
            formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
          {visaData.has_visa === "true" && (
            <SelectField label={t("apply.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS_T}
              formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
          )}
          {visaData.has_visa === "false" && (
            <>
              <SelectField label={t("apply.situation")} field="situation" options={SITUATION_OPTIONS_T}
                formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
              {visaData.situation === "refugee" && (
                <InputField label={t("apply.unhcr")} field="unhcr_number" placeholder="e.g. MYS/2023/12345"
                  formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
              )}
            </>
          )}
        </div>

        {/* Country & Palestine region */}
        <SelectField label={t("apply.country_origin")} field="country_of_origin" options={COUNTRY_OPTIONS}
          formData={locData} errors={locErrors} updateFormData={setL} rules={REQUIRED} />
        {locData.country_of_origin === "PS" && (
          <SelectField label={t("apply.palestine_region")} field="palestine_region" options={PALESTINE_REGION_OPTIONS_T}
            formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
        )}

        {/* Residence */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MdFlight className="h-3.5 w-3.5" /> {t("apply.residence")}
          </p>
          <InputField label={t("apply.date_arrived")} field="date_arrived_in_malaysia" type="date"
            formData={locData} errors={locErrors} updateFormData={setL} rules={REQUIRED} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField label={t("apply.city")} field="current_city" placeholder="Kuala Lumpur"
              formData={locData} errors={locErrors} updateFormData={setL} rules={REQUIRED} />
            <InputField label={t("apply.address")} field="address" placeholder="No. 1, Jalan…"
              formData={locData} errors={locErrors} updateFormData={setL} rules={REQUIRED} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> {t("apply.back")}
        </button>
        <button type="button" onClick={handleNext} disabled={!canProceed} className={btnNext}>
          {t("apply.continue")} <MdArrowForward className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 4 — Family
───────────────────────────────────────────────── */
const EMPTY_CHILD = {
  child_name: "", child_name_arabic: "", child_date_of_birth: "",
  passport_copy: null, entrance_stump: null,
};

const validateFamilyStep = (famData) => {
  const errors = {};
  const childErrors = famData.children.map(() => ({}));

  if (!famData.has_family) return { errors, childErrors };

  const nameErr = validate(famData.spouse_name, REQUIRED);
  if (nameErr) errors.spouse_name = nameErr;
  const nameArErr = validate(famData.spouse_name_arabic, REQUIRED);
  if (nameArErr) errors.spouse_name_arabic = nameArErr;
  const jobErr = validate(famData.spouse_job, REQUIRED);
  if (jobErr) errors.spouse_job = jobErr;

  famData.children.forEach((child, i) => {
    const ce = {};
    const cn  = validate(child.child_name, REQUIRED);
    if (cn) ce.child_name = cn;
    const cna = validate(child.child_name_arabic, REQUIRED);
    if (cna) ce.child_name_arabic = cna;
    const cdob = validate(child.child_date_of_birth, REQUIRED);
    if (cdob) ce.child_date_of_birth = cdob;
    const cpc = validate(child.passport_copy, REQUIRED);
    if (cpc) ce.passport_copy = cpc;
    const ces = validate(child.entrance_stump, REQUIRED);
    if (ces) ce.entrance_stump = ces;
    childErrors[i] = ce;
  });

  return { errors, childErrors };
};

const FamilyStep = ({ famData, onFamChange, onBack, onSubmit, loading, error }) => {
  const { t }       = useTranslation();
  const [errors, setErrors]         = useState({});
  const [childErrors, setChildErrors] = useState([]);
  const set         = (f, v) => onFamChange((p) => ({ ...p, [f]: v }));
  const addChild    = () => onFamChange((p) => ({ ...p, children: [...p.children, { ...EMPTY_CHILD }] }));
  const removeChild = (i) => onFamChange((p) => ({ ...p, children: p.children.filter((_, idx) => idx !== i) }));
  const updateChild = (i, f, v) =>
    onFamChange((p) => ({ ...p, children: p.children.map((c, idx) => idx === i ? { ...c, [f]: v } : c) }));

  const { errors: liveErrors, childErrors: liveChildErrors } = validateFamilyStep(famData);
  const canSubmit =
    Object.keys(liveErrors).length === 0 && liveChildErrors.every((ce) => Object.keys(ce).length === 0);

  const handleSubmitClick = () => {
    const { errors: nextErrors, childErrors: nextChildErrors } = validateFamilyStep(famData);
    const hasChildErrors = nextChildErrors.some((ce) => Object.keys(ce).length > 0);
    if (Object.keys(nextErrors).length || hasChildErrors) {
      setErrors(nextErrors);
      setChildErrors(nextChildErrors);
      return;
    }
    setErrors({});
    setChildErrors([]);
    onSubmit();
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdFamilyRestroom className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("apply.family_title")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("apply.family_subtitle")}</p>
        </div>
      </div>

      <AlertBanner message={error} />

      <div className="flex flex-col gap-3">
        <ToggleInput label={t("apply.has_family")} field="has_family"
          formData={famData} errors={{}} updateFormData={set} />

        {famData.has_family && (
          <>
            <ToggleInput label={t("apply.family_in_malaysia")} field="family_in_malaysia"
              formData={famData} errors={{}} updateFormData={set} />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{t("apply.spouse")}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InputField label={t("apply.spouse_name")}    field="spouse_name"        placeholder="Fatimah binti Ali"
                  formData={famData} errors={errors} updateFormData={set} rules={REQUIRED} />
                <InputField label={t("apply.spouse_name_ar")} field="spouse_name_arabic" placeholder="فاطمة بنت علي"
                  formData={famData} errors={errors} updateFormData={set} rules={REQUIRED} />
              </div>
              <InputField label={t("apply.spouse_job")} field="spouse_job" placeholder="Teacher"
                formData={famData} errors={errors} updateFormData={set} rules={REQUIRED} />
            </div>

            {/* Children */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("apply.children_count", { count: famData.children.length })}
                </p>
                <button type="button" onClick={addChild}
                  className="inline-flex items-center gap-1 rounded-lg bg-green/10 px-2.5 py-1 text-xs font-semibold text-green transition-colors hover:bg-green/20">
                  <MdAdd className="h-3.5 w-3.5" /> {t("apply.add_child")}
                </button>
              </div>

              {famData.children.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
                  {t("apply.no_children")}
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {famData.children.map((child, i) => {
                    const ce = childErrors[i] ?? {};
                    return (
                    <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">{t("beneficiaries.child_n", { n: i + 1 })}</span>
                        <button type="button" onClick={() => removeChild(i)}
                          className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                          <MdClose className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <InputField label={t("apply.child_name")}    field="child_name"         placeholder="Ahmad"
                            formData={child} errors={ce} updateFormData={(f, v) => updateChild(i, f, v)} rules={REQUIRED} />
                          <InputField label={t("apply.child_name_ar")} field="child_name_arabic"  placeholder="أحمد"
                            formData={child} errors={ce} updateFormData={(f, v) => updateChild(i, f, v)} rules={REQUIRED} />
                        </div>
                        <InputField label={t("apply.child_dob")} field="child_date_of_birth" type="date"
                          formData={child} errors={ce} updateFormData={(f, v) => updateChild(i, f, v)} rules={REQUIRED} />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <StorageDocumentField label={t("apply.passport_copy")}  folder="beneficiaries/documents" accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onUpload={(key) => updateChild(i, "passport_copy",  key)}
                            onRemove={() => updateChild(i, "passport_copy",  null)}
                            currentName={child.passport_copy  ? t("apply.passport_uploaded") : undefined}
                            field="passport_copy" errors={ce} />
                          <StorageDocumentField label={t("apply.entrance_stamp")} folder="beneficiaries/documents" accept=".pdf,.jpg,.jpeg,.png"
                            required
                            onUpload={(key) => updateChild(i, "entrance_stump", key)}
                            onRemove={() => updateChild(i, "entrance_stump", null)}
                            currentName={child.entrance_stump ? t("apply.stamp_uploaded")    : undefined}
                            field="entrance_stump" errors={ce} />
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> {t("apply.back")}
        </button>
        <button type="button" onClick={handleSubmitClick} disabled={loading || !canSubmit} className={btnNext}>
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <><MdCheckCircle className="h-4 w-4" /> {t("apply.submit")}</>
          }
        </button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   OTP Step
───────────────────────────────────────────────── */
const OtpStep = ({ email, channel, onBack }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { execute: verifyOtp, loading, error: otpError } = useVerifyOtp();
  const { execute: resendOtp, loading: resending }       = useResendOtp();
  const [code, setCode]     = useState("");
  const [resent, setResent] = useState(false);

  const isReady = code.trim().length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    try {
      const data = await verifyOtp({ email, code: code.trim(), purpose: OTP_PURPOSE.REGISTER });
      if (data?.access) setTokens({ access: data.access, refresh: data.refresh });
      navigate(`/auth/set-password?email=${encodeURIComponent(email)}`);
    } catch { /* handled by hook */ }
  };

  const handleResend = async () => {
    setResent(false);
    setCode("");
    try {
      await resendOtp({ email, purpose: OTP_PURPOSE.REGISTER });
      setResent(true);
    } catch { /* handled by hook */ }
  };

  return (
    <>
      <div className="mb-7">
        <button onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700">
          <MdArrowBack className="h-4 w-4" /> {t("apply.back")}
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdEmail className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-navy-700">{t("apply.otp_title")}</h2>
        <p className="mt-1 text-sm text-slate-400">
          {t("auth.otp_sent_via")}{" "}
          <span className="font-semibold text-slate-600">{channel}</span>{" "}
          {t("auth.otp_sent_to")}{" "}
          <span className="font-semibold text-slate-600">{email}</span>
        </p>
      </div>

      <AlertBanner message={otpError} />
      {resent && <AlertBanner message={t("apply.new_code_sent")} variant="success" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">{t("auth.six_digit_code")}</label>
          <input
            type="text" inputMode="numeric" maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="——————" autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.6em] text-slate-900 outline-none transition-all duration-200 focus:border-green focus:bg-white placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
          />
          <p className="mt-1.5 text-center text-xs text-slate-400">{code.length}/6 {t("auth.digits_entered")}</p>
        </div>

        <button type="submit" disabled={loading || !isReady} className={`w-full ${btnNext}`}>
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : t("apply.verify")
          }
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        {t("apply.no_code")}{" "}
        <button onClick={handleResend} disabled={resending}
          className="font-medium text-green transition-colors hover:text-[#006833] disabled:opacity-50">
          {resending ? t("apply.resending") : t("apply.resend")}
        </button>
      </p>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Main
───────────────────────────────────────────────── */
export default function BeneficiaryRegisterForm() {
  const { t } = useTranslation();
  const [step, setStep]       = useState(1);
  const [otpMeta, setOtpMeta] = useState({ email: "", channel: "" });

  const { classifications }   = useGetClassifications();
  const defaultClass          = useMemo(() => classifications[0]?.id ?? "", [classifications]);

  const [account,  setAccount]  = useState({ full_name: "", email: "", phone_number: "" });
  const [personal, setPersonal] = useState({
    full_name_arabic: "", passport_number: "", date_of_birth: "",
    gender: "", marital_status: "", background: "",
  });
  const [idDoc, setIdDoc] = useState(null);
  const [visa,  setVisa]  = useState({
    has_visa: "", visa_type: "", situation: "", unhcr_number: "", palestine_region: "",
  });
  const [location, setLocation] = useState({
    country_of_origin: "", date_arrived_in_malaysia: "", current_city: "", address: "",
  });
  const [family, setFamily] = useState({
    has_family: false, family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "", spouse_job: "",
    children: [],
  });

  const { execute: register, loading, error } = useRegister();

  const handleSubmit = async () => {
    const hasVisaBool = visa.has_visa === "true" ? true : visa.has_visa === "false" ? false : undefined;
    try {
      const payload = {
        full_name:    account.full_name    || undefined,
        email:        account.email        || undefined,
        phone_number: account.phone_number || undefined,

        classification:           defaultClass                               || undefined,
        full_name_arabic:         personal.full_name_arabic                 || undefined,
        passport_number:          personal.passport_number                  || undefined,
        date_of_birth:            personal.date_of_birth                    || undefined,
        gender:                   personal.gender                           || undefined,
        marital_status:           personal.marital_status                   || undefined,
        background:               personal.background                       || undefined,
        id_document:              idDoc                                      || undefined,

        has_visa:                 hasVisaBool,
        visa_type:                hasVisaBool === true  ? (visa.visa_type     || undefined) : undefined,
        situation:                hasVisaBool === false ? (visa.situation      || undefined) : undefined,
        unhcr_number:             (hasVisaBool === false && visa.situation === "refugee") ? (visa.unhcr_number || undefined) : undefined,
        country_of_origin:        location.country_of_origin                || undefined,
        palestine_region:         location.country_of_origin === "PS"       ? (visa.palestine_region || undefined) : undefined,
        date_arrived_in_malaysia: location.date_arrived_in_malaysia         || undefined,
        current_city:             location.current_city                     || undefined,
        address:                  location.address                          || undefined,

        family_information: {
          family_in_malaysia:   family.has_family ? family.family_in_malaysia : false,
          spouse_name:          family.spouse_name        || null,
          spouse_name_arabic:   family.spouse_name_arabic || null,
          spouse_job:           family.spouse_job         || null,
          number_of_children:   family.children.length,
          children_information: family.children.map((c) => ({
            child_name:          c.child_name          || "",
            child_name_arabic:   c.child_name_arabic   || "",
            child_date_of_birth: c.child_date_of_birth || undefined,
            passport_copy:       c.passport_copy       || undefined,
            entrance_stump:      c.entrance_stump      || undefined,
          })),
        },
      };
      const data = await register(payload);
      setOtpMeta({ email: account.email, channel: data.channel ?? "email" });
      setStep(5);
    } catch { /* error shown by useRegister */ }
  };

  return (
    <div>
      <Hero step={step <= 4 ? step : 5} />

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            {step === 1 && (
              <AccountStep data={account} onChange={setAccount} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <PersonalStep
                data={personal} onChange={setPersonal}
                idDoc={idDoc} onIdDocChange={setIdDoc}
                onBack={() => setStep(1)} onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <VisaLocationStep
                visaData={visa}     onVisaChange={setVisa}
                locData={location}  onLocChange={setLocation}
                onBack={() => setStep(2)} onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <FamilyStep
                famData={family} onFamChange={setFamily}
                onBack={() => setStep(3)} onSubmit={handleSubmit}
                loading={loading} error={error}
              />
            )}
            {step === 5 && (
              <OtpStep email={otpMeta.email} channel={otpMeta.channel} onBack={() => setStep(1)} />
            )}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            {t("apply.privacy")}{" "}
            <a href="/about" className="text-green hover:underline">{t("apply.privacy_link")}</a>.
            {" "}{t("apply.privacy_end")}
          </p>
        </div>
      </section>
    </div>
  );
}
