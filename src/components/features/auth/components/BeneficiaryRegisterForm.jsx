import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdPersonAdd, MdArrowForward, MdArrowBack, MdEmail, MdCheck,
  MdDescription, MdCardTravel, MdPeople, MdCheckCircle, MdFamilyRestroom,
} from "react-icons/md";
import InputField           from "components/form/InputField";
import SelectField          from "components/form/SelectField";
import TextareaField        from "components/form/TextareaField";
import ToggleInput          from "components/form/ToggleInput";
import StorageDocumentField from "components/form/upload/StorageDocumentField";
import { StorageImageField } from "components/form";
import AlertBanner          from "components/ui/AlertBanner";
import Button                from "components/ui/buttons/Button";
import { validate }         from "components/form/utils/validation";
import { useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { setTokens }        from "components/features/auth/utils";
import { OTP_PURPOSE }      from "components/features/auth/types";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useCreateBeneficiary } from "components/features/beneficiaries/hooks";

/* ─────────────────────────────────────────────────
   Step config
───────────────────────────────────────────────── */
const useSteps = () => {
  const { t } = useTranslation();
  return [
    { n: 1, label: t("apply.step_account"),   icon: <MdPersonAdd className="h-4 w-4" /> },
    { n: 2, label: t("apply.step_family"),    icon: <MdFamilyRestroom className="h-4 w-4" /> },
    { n: 3, label: t("apply.step_documents"), icon: <MdDescription className="h-4 w-4" /> },
    { n: 4, label: t("apply.step_status"),    icon: <MdCardTravel className="h-4 w-4" /> },
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
        <StorageImageField
          label={t("common.profile_photo")}
          publicEndpoint="register"
          onUpload={(key) => set("profile_photo", key)}
          onRemove={() => set("profile_photo", null)}
          errors={errors}
          field="profile_photo"
        />
        <InputField label={t("apply.full_name")} field="full_name" placeholder="Ahmad Faris bin Abdullah"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.full_name} />
        <InputField label={t("apply.email")} field="email" type="email" placeholder="you@example.com"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.email} />
        <InputField label={t("apply.phone")} field="phone_number" placeholder="+60 12-345 6789"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.phone_number} />
      </div>

      <Button
        type="button" onClick={handleNext} disabled={!canProceed}
        text={t("apply.continue")} icon={<MdArrowForward className="h-4 w-4" />} iconPosition="right"
        className="mt-6 h-11 w-full"
      />

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
   Step 2 — Documents & Background
───────────────────────────────────────────────── */
const DOCUMENTS_RULES = {
  background: [{ required: true }],
};

const DocumentsStep = ({ data, onChange, idDoc, onIdDocChange, onBack, onNext }) => {
  const { t } = useTranslation();
  const [errors, setErrors]         = useState({});
  const [idDocError, setIdDocError] = useState(null);
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

  const canProceed =
    !Object.entries(DOCUMENTS_RULES).some(([field, rules]) => !!validate(data[field], rules)) && !!idDoc;

  const handleNext = () => {
    const newErrors = {};
    Object.entries(DOCUMENTS_RULES).forEach(([field, rules]) => {
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
          <MdDescription className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("apply.documents_title")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("apply.documents_subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <TextareaField label={t("apply.background")} field="background"
          placeholder={t("apply.background_placeholder")}
          formData={data} errors={errors} updateFormData={set} rows={3} rules={DOCUMENTS_RULES.background} />
        <StorageDocumentField
          label={t("apply.id_document")}
          publicEndpoint="register"
          accept=".pdf,.jpg,.jpeg,.png"
          required
          onUpload={(key) => { onIdDocChange(key); setIdDocError(null); }}
          onRemove={() => onIdDocChange(null)}
          currentName={idDoc ? t("common.uploaded_file") : undefined}
          field="id_document" errors={{ id_document: idDocError }}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} text={t("apply.back")} icon={<MdArrowBack className="h-4 w-4" />} className="h-11 flex-1" />
        <Button type="button" onClick={handleNext} disabled={!canProceed} text={t("apply.continue")} icon={<MdArrowForward className="h-4 w-4" />} iconPosition="right" className="h-11 flex-1" />
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 3 — Family Information
───────────────────────────────────────────────── */
const EMPTY_CHILD = {
  child_name: "", child_name_arabic: "", child_date_of_birth: "",
  passport_copy: null, entrance_stump: null,
};

const FamilyStep = ({ data, onChange, children, onChildrenChange, onBack, onNext }) => {
  const { t } = useTranslation();
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));
  const setChild = (i, f, v) =>
    onChildrenChange((prev) => prev.map((c, idx) => idx === i ? { ...c, [f]: v } : c));

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdFamilyRestroom className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">{t("beneficiaries.section_family")}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{t("beneficiaries.section_family_sub")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" formData={data} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.spouse_name")}        field="spouse_name"        placeholder="Fatimah binti Ali" required={false} formData={data} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.spouse_name_ar_label")} field="spouse_name_arabic" placeholder={t("beneficiaries.spouse_name_ar_placeholder")} required={false} formData={data} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.spouse_job")}         field="spouse_job"         placeholder="Teacher"      required={false} formData={data} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.number_of_children")} field="number_of_children" type="number" placeholder="0" required={false} formData={data} errors={{}} updateFormData={set} />

        {children.length > 0 && (
          <div className="flex flex-col gap-4">
            {children.map((child, i) => (
              <div key={i} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500">{t("beneficiaries.child_label", { num: i + 1 })}</p>
                  <button type="button" onClick={() => onChildrenChange((p) => p.filter((_, idx) => idx !== i))}
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
                  <StorageDocumentField label={t("beneficiaries.passport_copy")}  publicEndpoint="register" accept=".pdf,.jpg,.jpeg,.png"
                    onUpload={(key) => setChild(i, "passport_copy",  key)}
                    onRemove={() => setChild(i, "passport_copy",  null)} field={`passport_copy_${i}`} errors={{}} />
                  <StorageDocumentField label={t("beneficiaries.entrance_stamp")} publicEndpoint="register" accept=".pdf,.jpg,.jpeg,.png"
                    onUpload={(key) => setChild(i, "entrance_stump", key)}
                    onRemove={() => setChild(i, "entrance_stump", null)} field={`entrance_stump_${i}`} errors={{}} />
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => onChildrenChange((p) => [...p, { ...EMPTY_CHILD }])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green transition-colors hover:text-green-600"
        >
          {t("beneficiaries.add_child")}
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} text={t("apply.back")} icon={<MdArrowBack className="h-4 w-4" />} className="h-11 flex-1" />
        <Button type="button" onClick={onNext} text={t("apply.continue")} icon={<MdArrowForward className="h-4 w-4" />} iconPosition="right" className="h-11 flex-1" />
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 4 — Status, Country & Terms
───────────────────────────────────────────────── */
const REQUIRED = [{ required: true }];

const validateStatusStep = (visaData) => {
  const errors = {};

  const hasVisaErr = validate(visaData.has_visa, REQUIRED);
  if (hasVisaErr) errors.has_visa = hasVisaErr;

  if (visaData.has_visa === "true") {
    const err = validate(visaData.visa_type, REQUIRED);
    if (err) errors.visa_type = err;
  } else if (visaData.has_visa === "false") {
    const err = validate(visaData.situation, REQUIRED);
    if (err) errors.situation = err;
    if (visaData.situation === "refugee") {
      const uErr = validate(visaData.unhcr_number, REQUIRED);
      if (uErr) errors.unhcr_number = uErr;
    }
  }

  const countryErr = validate(visaData.country, REQUIRED);
  if (countryErr) errors.country = countryErr;
  if (visaData.country === "PS") {
    const regionErr = validate(visaData.palestine_region, REQUIRED);
    if (regionErr) errors.palestine_region = regionErr;
  }

  return errors;
};

const StatusStep = ({ visaData, onVisaChange, onBack, onSubmit, loading, error }) => {
  const { t } = useTranslation();
  const [visaErrors, setVisaErrors] = useState({});
  const setV = (f, v) => onVisaChange((p) => ({ ...p, [f]: v }));

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

  const liveErrors  = validateStatusStep(visaData);
  const termsMissing = !visaData.terms_accepted;
  const canSubmit   = Object.keys(liveErrors).length === 0 && !termsMissing;

  const handleSubmitClick = () => {
    const nextErrors = validateStatusStep(visaData);
    if (termsMissing) nextErrors.terms_accepted = t("validation.required");
    if (Object.keys(nextErrors).length) {
      setVisaErrors(nextErrors);
      return;
    }
    setVisaErrors({});
    onSubmit();
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

      <AlertBanner message={error} />

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

        {/* Country */}
        <SelectField label={t("apply.country_origin")} field="country" options={COUNTRY_OPTIONS}
          formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
        {visaData.country === "PS" && (
          <SelectField label={t("apply.palestine_region")} field="palestine_region" options={PALESTINE_REGION_OPTIONS_T}
            formData={visaData} errors={visaErrors} updateFormData={setV} rules={REQUIRED} />
        )}
        <InputField label={t("beneficiaries.address")} field="address" placeholder="No. 1, Jalan…"
          required={false} formData={visaData} errors={visaErrors} updateFormData={setV} />

        {/* Terms */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <ToggleInput label={t("apply.terms_label")} field="terms_accepted"
            formData={visaData} errors={visaErrors} updateFormData={setV} />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button type="button" variant="ghost" onClick={onBack} text={t("apply.back")} icon={<MdArrowBack className="h-4 w-4" />} className="h-11 flex-1" />
        <Button
          type="button" onClick={handleSubmitClick} disabled={!canSubmit} loading={loading}
          text={loading ? t("apply.submitting") : t("apply.submit")} icon={<MdCheckCircle className="h-4 w-4" />}
          className="h-11 flex-1"
        />
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

        <Button type="submit" loading={loading} disabled={!isReady} text={t("apply.verify")} className="h-11 w-full" />
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

  const [account,  setAccount]  = useState({ full_name: "", email: "", phone_number: "", profile_photo: null });
  const [documents, setDocuments] = useState({ background: "" });
  const [idDoc, setIdDoc] = useState(null);
  const [family, setFamily] = useState({
    family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "",
    spouse_job: "", number_of_children: "",
  });
  const [children, setChildren] = useState([]);
  const [visa,  setVisa]  = useState({
    has_visa: "", visa_type: "", situation: "", unhcr_number: "",
    country: "", palestine_region: "", address: "", terms_accepted: false,
  });

  const { execute: createBeneficiary, loading, error } = useCreateBeneficiary();

  const handleSubmit = async () => {
    const hasVisaBool = visa.has_visa === "true" ? true : visa.has_visa === "false" ? false : undefined;
    try {
      const payload = {
        full_name:         account.full_name     || undefined,
        email:             account.email         || undefined,
        phone_number:      account.phone_number  || undefined,
        profile_photo:     account.profile_photo || undefined,
        background:        documents.background  || undefined,
        id_document:       idDoc                  || undefined,
        terms_accepted:    visa.terms_accepted,

        has_visa:          hasVisaBool,
        visa_type:         hasVisaBool === true  ? (visa.visa_type || undefined) : undefined,
        situation:         hasVisaBool === false ? (visa.situation || undefined) : undefined,
        unhcr_number:      (hasVisaBool === false && visa.situation === "refugee") ? (visa.unhcr_number || undefined) : undefined,
        country_of_origin: visa.country || undefined,
        palestine_region:  visa.country === "PS" ? (visa.palestine_region || undefined) : undefined,
        address:           visa.address || undefined,

        family_information: {
          family_in_malaysia:  family.family_in_malaysia,
          spouse_name:         family.spouse_name        || null,
          spouse_name_arabic:  family.spouse_name_arabic || null,
          spouse_job:          family.spouse_job         || null,
          number_of_children:  family.number_of_children !== "" ? Number(family.number_of_children) : null,
          children_information: children.map((c) => ({
            child_name:          c.child_name         || undefined,
            child_name_arabic:   c.child_name_arabic  || undefined,
            child_date_of_birth: c.child_date_of_birth || undefined,
            passport_copy:       c.passport_copy      || undefined,
            entrance_stump:      c.entrance_stump     || undefined,
          })),
        },
      };
      const data = await createBeneficiary(payload);
      setOtpMeta({ email: account.email, channel: data.channel ?? "email" });
      setStep(5);
    } catch { /* error shown by useCreateBeneficiary */ }
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
              <FamilyStep
                data={family} onChange={setFamily}
                children={children} onChildrenChange={setChildren}
                onBack={() => setStep(1)} onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <DocumentsStep
                data={documents} onChange={setDocuments}
                idDoc={idDoc} onIdDocChange={setIdDoc}
                onBack={() => setStep(2)} onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <StatusStep
                visaData={visa} onVisaChange={setVisa}
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
