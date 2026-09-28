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
import { StorageImageField } from "components/form";
import AlertBanner          from "components/ui/AlertBanner";
import Button                from "components/ui/buttons/Button";
import { validate }         from "components/form/utils/validation";
import { useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { setTokens }        from "components/features/auth/utils";
import { OTP_PURPOSE }      from "components/features/auth/types";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useCreateBeneficiary, useGetStates } from "components/features/beneficiaries/hooks";
import SupportingDocumentsEditor from "components/features/beneficiaries/components/SupportingDocumentsEditor";
import FamilyMembersEditor from "components/features/beneficiaries/components/FamilyMembersEditor";
import {
  documentProblems, memberProblems, starterDocuments, documentsUntouched, allowedDocTypes, toDocumentPayload, toMemberPayload,
} from "components/features/beneficiaries/constants/family";

/* ─────────────────────────────────────────────────
   Step config
───────────────────────────────────────────────── */
const useSteps = () => {
  const { t } = useTranslation();
  return [
    { n: 1, label: t("apply.step_account"),   icon: <MdPersonAdd className="h-4 w-4" /> },
    { n: 2, label: t("apply.step_status"),    icon: <MdCardTravel className="h-4 w-4" /> },
    { n: 3, label: t("apply.step_documents"), icon: <MdDescription className="h-4 w-4" /> },
    { n: 4, label: t("apply.step_family"),    icon: <MdFamilyRestroom className="h-4 w-4" /> },
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
  profile_photo: [{ required: true }],
  full_name:     [{ required: true }, { maxLength: 255 }],
  email:         [{ required: true }, { email: true }],
  phone_number:  [{ required: true }, { maxLength: 30 }],
};

const AccountStep = ({ data, onChange, onNext, serverErrors, onClearServerError }) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState({});
  const set = (f, v) => { onChange((p) => ({ ...p, [f]: v })); onClearServerError?.(f); };

  const allErrors = { ...errors, ...serverErrors };
  const canProceed =
    !Object.entries(ACCOUNT_RULES).some(([field, rules]) => !!validate(data[field], rules)) &&
    !Object.keys(ACCOUNT_RULES).some((field) => serverErrors?.[field]);

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

      {serverErrors && Object.keys(serverErrors).length > 0 && (
        <AlertBanner message={t("apply.server_error_banner")} />
      )}

      <div className="flex flex-col gap-3">
        <StorageImageField
          label={t("common.profile_photo")}
          publicEndpoint="register"
          required
          onUpload={(key) => set("profile_photo", key)}
          onRemove={() => set("profile_photo", null)}
          errors={allErrors}
          field="profile_photo"
        />
        <InputField label={t("apply.full_name")} field="full_name" placeholder="Ahmad Faris bin Abdullah"
          formData={data} errors={allErrors} updateFormData={set} rules={ACCOUNT_RULES.full_name} />
        <InputField label={t("apply.email")} field="email" type="email" placeholder="you@example.com"
          formData={data} errors={allErrors} updateFormData={set} rules={ACCOUNT_RULES.email} />
        <InputField label={t("apply.phone")} field="phone_number" placeholder="+60 12-345 6789"
          formData={data} errors={allErrors} updateFormData={set} rules={ACCOUNT_RULES.phone_number} />
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
   Shared step chrome
───────────────────────────────────────────────── */
const StepHeader = ({ icon, title, subtitle }) => (
  <div className="mb-6 flex items-start gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10 text-green">{icon}</div>
    <div>
      <h2 className="text-xl font-bold text-navy-700">{title}</h2>
      <p className="mt-0.5 text-sm text-slate-400">{subtitle}</p>
    </div>
  </div>
);

const StepNav = ({ onBack, onNext, nextDisabled, nextText, nextIcon, loading }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-6 flex gap-3">
      <Button type="button" variant="ghost" onClick={onBack} text={t("apply.back")} icon={<MdArrowBack className="h-4 w-4" />} className="h-11 flex-1" />
      <Button type="button" onClick={onNext} disabled={nextDisabled} loading={loading}
        text={nextText ?? t("apply.continue")} icon={nextIcon ?? <MdArrowForward className="h-4 w-4" />}
        iconPosition={nextIcon ? undefined : "right"} className="h-11 flex-1" />
    </div>
  );
};

/* ─────────────────────────────────────────────────
   Step 2 — Status & location
   (asked before documents: what's required depends on visa status)
───────────────────────────────────────────────── */
const REQUIRED = [{ required: true }];

const statusErrors = (v) => {
  const errors = {};
  if (v.has_visa === "") errors.has_visa = true;
  if (v.has_visa === "true"  && !v.visa_type) errors.visa_type = true;
  if (v.has_visa === "false" && !v.situation) errors.situation = true;
  if (!v.country) errors.country = true;
  if (v.country === "PS" && !v.palestine_region) errors.palestine_region = true;
  if (!v.state) errors.state = true;
  if (!v.address?.trim()) errors.address = true;
  return errors;
};

const StatusStep = ({ data, onChange, onBack, onNext, serverErrors, onClearServerError }) => {
  const { t, i18n } = useTranslation();
  const set = (f, v) => { onChange((p) => ({ ...p, [f]: v })); onClearServerError?.(f); };
  const { states } = useGetStates();
  const opts = (values, prefix) => values.map((v) => ({ value: v, label: t(`beneficiaries.${prefix}${v}`) }));

  const STATE_OPTIONS = states.map((s) => ({
    value: s.code,
    label: (s.label_ar && i18n.language === "ar") ? s.label_ar : s.label,
  }));
  const HAS_VISA_OPTIONS = [
    { value: "true",  label: t("beneficiaries.visa_status_yes") },
    { value: "false", label: t("beneficiaries.visa_status_no") },
  ];
  const canProceed = Object.keys(statusErrors(data)).length === 0;

  return (
    <>
      <StepHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("apply.visa_title")} subtitle={t("apply.visa_subtitle")} />
      {serverErrors && Object.keys(serverErrors).length > 0 && <AlertBanner message={t("apply.server_error_banner")} />}

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MdCardTravel className="h-3.5 w-3.5" /> {t("apply.immigration_status")}
          </p>
          <SelectField label={t("apply.visa_status")} field="has_visa" options={HAS_VISA_OPTIONS}
            formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
          {data.has_visa === "true" && (
            <SelectField label={t("apply.visa_type")} field="visa_type"
              options={opts(["student", "work", "dependent", "social_visit", "refugee_pass", "other"], "visa_type_")}
              formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
          )}
          {data.has_visa === "false" && (
            <SelectField label={t("apply.situation")} field="situation"
              options={opts(["refugee", "asylum_seeker", "undocumented", "overstayed"], "situation_")}
              formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
          )}
        </div>

        <SelectField label={t("apply.country_origin")} field="country" options={COUNTRY_OPTIONS}
          formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
        {data.country === "PS" && (
          <SelectField label={t("apply.palestine_region")} field="palestine_region"
            options={opts(["gaza", "west_bank", "refugee_outside"], "region_")}
            formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
        )}
        <SelectField label={t("apply.state")} field="state" options={STATE_OPTIONS}
          formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
        <InputField label={t("beneficiaries.address")} field="address" placeholder="No. 1, Jalan…"
          formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
      </div>

      <StepNav onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 3 — Documents & background
───────────────────────────────────────────────── */
const DocumentsStep = ({ status, data, onChange, documents, onDocumentsChange, onBack, onNext, serverErrors, onClearServerError }) => {
  const { t } = useTranslation();
  const set = (f, v) => { onChange((p) => ({ ...p, [f]: v })); onClearServerError?.(f); };
  const problems = documentProblems({ hasVisa: status.has_visa, situation: status.situation, documents });
  const canProceed = problems.length === 0 && !!data.background?.trim();

  return (
    <>
      <StepHeader icon={<MdDescription className="h-5 w-5" />} title={t("apply.documents_title")} subtitle={t("apply.documents_subtitle")} />
      {serverErrors?.supporting_documents && <AlertBanner message={serverErrors.supporting_documents} />}

      <div className="flex flex-col gap-3">
        <TextareaField label={t("apply.background")} field="background" rows={3}
          placeholder={t("apply.background_placeholder")}
          formData={data} errors={serverErrors} updateFormData={set} rules={REQUIRED} />
        <p className="text-xs text-slate-500">{t(`apply.documents_hint_${status.has_visa === "true" ? "visa" : status.situation === "refugee" ? "refugee" : "other"}`)}</p>
        <SupportingDocumentsEditor
          documents={documents}
          onChange={(next) => { onDocumentsChange(next); onClearServerError?.("supporting_documents"); }}
          publicEndpoint="register"
          problems={problems}
          allowedTypes={allowedDocTypes(status.has_visa, status.situation)}
        />
      </div>

      <StepNav onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 4 — Family members, terms & submit
───────────────────────────────────────────────── */
const FamilyStep = ({ data, onChange, members, onMembersChange, onBack, onSubmit, loading, error, serverErrors }) => {
  const { t } = useTranslation();
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));
  const membersValid = members.every((m) => memberProblems(m).length === 0);
  const canSubmit = membersValid && data.terms_accepted;

  return (
    <>
      <StepHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title={t("beneficiaries.section_family")} subtitle={t("apply.family_subtitle")} />
      <AlertBanner message={serverErrors?.family_information || error} />

      <div className="flex flex-col gap-3">
        <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" required formData={data} errors={{}} updateFormData={set}
          onText={t("beneficiaries.info_yes")} offText={t("beneficiaries.info_no")} hint={null} />
        <FamilyMembersEditor members={members} onChange={onMembersChange} publicEndpoint="register" />

        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <ToggleInput label={t("apply.terms_label")} field="terms_accepted" formData={data} errors={{}} updateFormData={set} />
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onSubmit} nextDisabled={!canSubmit} loading={loading}
        nextText={loading ? t("apply.submitting") : t("apply.submit")} nextIcon={<MdCheckCircle className="h-4 w-4" />} />
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
   Which step owns each field the API can reject —
   used to route a server-side validation error (e.g. a duplicate email)
   back to the step that actually collected it.
───────────────────────────────────────────────── */
const FIELD_TO_STEP = {
  full_name: 1, email: 1, phone_number: 1, profile_photo: 1,
  has_visa: 2, visa_type: 2, situation: 2, country_of_origin: 2, palestine_region: 2, state: 2, address: 2,
  background: 3, supporting_documents: 3,
  family_information: 4, terms_accepted: 4,
};

/* ─────────────────────────────────────────────────
   Main
───────────────────────────────────────────────── */
export default function BeneficiaryRegisterForm() {
  const { t } = useTranslation();
  const [step, setStep]       = useState(1);
  const [otpMeta, setOtpMeta] = useState({ email: "", channel: "" });
  const [serverFieldErrors, setServerFieldErrors] = useState({});

  const clearServerError = (field) => {
    setServerFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const [account, setAccount] = useState({ full_name: "", email: "", phone_number: "", profile_photo: null });
  const [status, setStatus]   = useState({
    has_visa: "", visa_type: "", situation: "", country: "", palestine_region: "", state: "", address: "",
  });
  const [about, setAbout]         = useState({ background: "" });
  const [documents, setDocuments] = useState([]);
  const [family, setFamily]       = useState({ family_in_malaysia: false, terms_accepted: false });
  const [members, setMembers]     = useState([]);

  const { execute: createBeneficiary, loading, error } = useCreateBeneficiary();

  // Entering the documents step with nothing filled in yet: start with the
  // rows this status requires (passport + visa, UNHCR card, or passport) —
  // also when the user came back and changed their status.
  const goToDocuments = () => {
    if (documentsUntouched(documents)) setDocuments(starterDocuments(status.has_visa, status.situation));
    setStep(3);
  };

  const handleSubmit = async () => {
    const hasVisa = status.has_visa === "true";
    try {
      const payload = {
        full_name:         account.full_name,
        email:             account.email,
        phone_number:      account.phone_number  || undefined,
        profile_photo:     account.profile_photo || undefined,
        has_visa:          hasVisa,
        visa_type:         hasVisa  ? status.visa_type : undefined,
        situation:         !hasVisa ? status.situation : undefined,
        country_of_origin: status.country || undefined,
        palestine_region:  status.country === "PS" ? status.palestine_region : undefined,
        state:             status.state   || undefined,
        address:           status.address || undefined,
        background:        about.background || undefined,
        terms_accepted:    family.terms_accepted,
        supporting_documents: documents.map(toDocumentPayload),
        ...((family.family_in_malaysia || members.length) ? {
          family_information: {
            family_in_malaysia: family.family_in_malaysia,
            members: members.map(toMemberPayload),
          },
        } : {}),
      };
      const data = await createBeneficiary(payload);
      setOtpMeta({ email: account.email, channel: data.channel ?? "email" });
      setStep(5);
    } catch (err) {
      const fe = err?.fieldError;
      const targetStep = fe && FIELD_TO_STEP[fe.field];
      if (fe && targetStep) {
        // Route back to whichever step owns the invalid field instead of
        // leaving the user reading a message about another screen.
        setServerFieldErrors((prev) => ({ ...prev, [fe.field]: fe.message }));
        setStep(targetStep);
      }
    }
  };

  return (
    <div>
      <Hero step={step <= 4 ? step : 5} />

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            {step === 1 && (
              <AccountStep
                data={account} onChange={setAccount} onNext={() => setStep(2)}
                serverErrors={serverFieldErrors} onClearServerError={clearServerError}
              />
            )}
            {step === 2 && (
              <StatusStep
                data={status} onChange={setStatus}
                onBack={() => setStep(1)} onNext={goToDocuments}
                serverErrors={serverFieldErrors} onClearServerError={clearServerError}
              />
            )}
            {step === 3 && (
              <DocumentsStep
                status={status} data={about} onChange={setAbout}
                documents={documents} onDocumentsChange={setDocuments}
                onBack={() => setStep(2)} onNext={() => setStep(4)}
                serverErrors={serverFieldErrors} onClearServerError={clearServerError}
              />
            )}
            {step === 4 && (
              <FamilyStep
                data={family} onChange={setFamily}
                members={members} onMembersChange={setMembers}
                onBack={() => setStep(3)} onSubmit={handleSubmit}
                loading={loading} error={error} serverErrors={serverFieldErrors}
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
