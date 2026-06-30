import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  GENDER_OPTIONS, MARITAL_STATUS_OPTIONS,
  HAS_VISA_OPTIONS, VISA_TYPE_OPTIONS, SITUATION_OPTIONS, PALESTINE_REGION_OPTIONS,
} from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";

/* ─────────────────────────────────────────────────
   Step config
───────────────────────────────────────────────── */
const STEPS = [
  { n: 1, label: "Account",  icon: <MdPersonAdd className="h-4 w-4" /> },
  { n: 2, label: "Personal", icon: <MdBadge className="h-4 w-4" /> },
  { n: 3, label: "Status",   icon: <MdCardTravel className="h-4 w-4" /> },
  { n: 4, label: "Family",   icon: <MdFamilyRestroom className="h-4 w-4" /> },
];

/* ─────────────────────────────────────────────────
   Hero
───────────────────────────────────────────────── */
const Hero = ({ step }) => (
  <div className="relative overflow-hidden bg-green px-6 pb-16 pt-14 text-center text-white">
    {/* Decorative dots */}
    <div className="pointer-events-none absolute inset-0 bg-dot-white bg-[size:24px_24px] opacity-[0.06]" />
    <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
    <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

    <div className="relative">
      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
        <MdPeople className="h-3.5 w-3.5" />
        Palestinian Forum Malaysia
      </span>

      <h1 className="mx-auto mt-5 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
        Apply for Beneficiary&nbsp;Support
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
        Fill in the application below — your details are kept confidential and used only to process your request.
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

/* ─────────────────────────────────────────────────
   Shared nav button classes
───────────────────────────────────────────────── */
const btnBack  = "flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]";
const btnNext  = "flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/30 transition-all duration-200 hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

/* ─────────────────────────────────────────────────
   Step 1 — Account
───────────────────────────────────────────────── */
const ACCOUNT_RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255 }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

const AccountStep = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState({});
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

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
          <h2 className="text-xl font-bold text-navy-700">Create your account</h2>
          <p className="mt-0.5 text-sm text-slate-400">Enter your contact details to get started.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <InputField label="Full Name" field="full_name" placeholder="Ahmad Faris bin Abdullah"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.full_name} />
        <InputField label="Email Address" field="email" type="email" placeholder="you@example.com"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.email} />
        <InputField label="Phone Number" field="phone_number" placeholder="+60 12-345 6789"
          required={false} formData={data} errors={{}} updateFormData={set} />
      </div>

      <button type="button" onClick={handleNext} disabled={!data.full_name.trim() || !data.email.trim()}
        className={`mt-6 w-full ${btnNext}`}>
        Continue <MdArrowForward className="h-4 w-4" />
      </button>

      <p className="mt-5 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="font-medium text-green transition-colors hover:text-[#006833]">
          Sign in
        </Link>
      </p>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 2 — Personal Info
───────────────────────────────────────────────── */
const PersonalStep = ({ data, onChange, idDoc, onIdDocChange, onBack, onNext }) => {
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdBadge className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">Personal information</h2>
          <p className="mt-0.5 text-sm text-slate-400">Help us know you better. All fields are optional.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField label="Full Name (Arabic)" field="full_name_arabic" placeholder="أحمد فارس"
            required={false} formData={data} errors={{}} updateFormData={set} />
          <InputField label="Passport Number" field="passport_number" placeholder="A12345678"
            required={false} formData={data} errors={{}} updateFormData={set} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputField label="Date of Birth" field="date_of_birth" type="date"
            required={false} formData={data} errors={{}} updateFormData={set} />
          <SelectField label="Gender" field="gender" options={GENDER_OPTIONS}
            required={false} formData={data} errors={{}} updateFormData={set} />
        </div>
        <SelectField label="Marital Status" field="marital_status" options={MARITAL_STATUS_OPTIONS}
          required={false} formData={data} errors={{}} updateFormData={set} />
        <TextareaField label="Background" field="background"
          placeholder="Brief background about your situation (optional)…"
          required={false} formData={data} errors={{}} updateFormData={set} rows={3} />
        <StorageDocumentField
          label="ID Document"
          folder="beneficiaries/documents"
          accept=".pdf,.jpg,.jpeg,.png"
          onUpload={(key) => onIdDocChange(key)}
          onRemove={() => onIdDocChange(null)}
          currentName={idDoc ? "Uploaded document" : undefined}
          field="id_document" errors={{}}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className={btnNext}>
          Continue <MdArrowForward className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Step 3 — Visa & Location
───────────────────────────────────────────────── */
const VisaLocationStep = ({ visaData, onVisaChange, locData, onLocChange, onBack, onNext }) => {
  const setV = (f, v) => onVisaChange((p) => ({ ...p, [f]: v }));
  const setL = (f, v) => onLocChange((p)  => ({ ...p, [f]: v }));

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdCardTravel className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">Visa & location</h2>
          <p className="mt-0.5 text-sm text-slate-400">Your immigration status and residence in Malaysia.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Visa status */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MdCardTravel className="h-3.5 w-3.5" /> Immigration Status
          </p>
          <SelectField label="Visa Status" field="has_visa" options={HAS_VISA_OPTIONS}
            required={false} formData={visaData} errors={{}} updateFormData={setV} />
          {visaData.has_visa === "true" && (
            <SelectField label="Visa Type" field="visa_type" options={VISA_TYPE_OPTIONS}
              required={false} formData={visaData} errors={{}} updateFormData={setV} />
          )}
          {visaData.has_visa === "false" && (
            <>
              <SelectField label="Situation" field="situation" options={SITUATION_OPTIONS}
                required={false} formData={visaData} errors={{}} updateFormData={setV} />
              {visaData.situation === "refugee" && (
                <InputField label="UNHCR Number" field="unhcr_number" placeholder="e.g. MYS/2023/12345"
                  required={false} formData={visaData} errors={{}} updateFormData={setV} />
              )}
            </>
          )}
        </div>

        {/* Country & Palestine region */}
        <SelectField label="Country of Origin" field="country_of_origin" options={COUNTRY_OPTIONS}
          required={false} formData={locData} errors={{}} updateFormData={setL} />
        {locData.country_of_origin === "PS" && (
          <SelectField label="Palestine Region" field="palestine_region" options={PALESTINE_REGION_OPTIONS}
            required={false} formData={visaData} errors={{}} updateFormData={setV} />
        )}

        {/* Residence */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <MdFlight className="h-3.5 w-3.5" /> Residence in Malaysia
          </p>
          <InputField label="Date Arrived in Malaysia" field="date_arrived_in_malaysia" type="date"
            required={false} formData={locData} errors={{}} updateFormData={setL} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField label="Current City" field="current_city" placeholder="Kuala Lumpur"
              required={false} formData={locData} errors={{}} updateFormData={setL} />
            <InputField label="Address" field="address" placeholder="No. 1, Jalan…"
              required={false} formData={locData} errors={{}} updateFormData={setL} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext} className={btnNext}>
          Continue <MdArrowForward className="h-4 w-4" />
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

const FamilyStep = ({ famData, onFamChange, onBack, onSubmit, loading, error }) => {
  const set         = (f, v) => onFamChange((p) => ({ ...p, [f]: v }));
  const addChild    = () => onFamChange((p) => ({ ...p, children: [...p.children, { ...EMPTY_CHILD }] }));
  const removeChild = (i) => onFamChange((p) => ({ ...p, children: p.children.filter((_, idx) => idx !== i) }));
  const updateChild = (i, f, v) =>
    onFamChange((p) => ({ ...p, children: p.children.map((c, idx) => idx === i ? { ...c, [f]: v } : c) }));

  return (
    <>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green/10">
          <MdFamilyRestroom className="h-5 w-5 text-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-700">Family information</h2>
          <p className="mt-0.5 text-sm text-slate-400">Family details and dependants. All optional.</p>
        </div>
      </div>

      <AlertBanner message={error} />

      <div className="flex flex-col gap-3">
        <ToggleInput label="Family in Malaysia" field="family_in_malaysia"
          formData={famData} errors={{}} updateFormData={set} />

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Spouse</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InputField label="Spouse Name"          field="spouse_name"        placeholder="Fatimah binti Ali"
              required={false} formData={famData} errors={{}} updateFormData={set} />
            <InputField label="Spouse Name (Arabic)" field="spouse_name_arabic" placeholder="فاطمة بنت علي"
              required={false} formData={famData} errors={{}} updateFormData={set} />
          </div>
          <InputField label="Spouse Occupation" field="spouse_job" placeholder="Teacher"
            required={false} formData={famData} errors={{}} updateFormData={set} />
        </div>

        {/* Children */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Children ({famData.children.length})
            </p>
            <button type="button" onClick={addChild}
              className="inline-flex items-center gap-1 rounded-lg bg-green/10 px-2.5 py-1 text-xs font-semibold text-green transition-colors hover:bg-green/20">
              <MdAdd className="h-3.5 w-3.5" /> Add Child
            </button>
          </div>

          {famData.children.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
              No children added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {famData.children.map((child, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Child {i + 1}</span>
                    <button type="button" onClick={() => removeChild(i)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500">
                      <MdClose className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InputField label="Child Name"          field="child_name"         placeholder="Ahmad"
                        formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />
                      <InputField label="Child Name (Arabic)" field="child_name_arabic"  placeholder="أحمد"
                        formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />
                    </div>
                    <InputField label="Date of Birth" field="child_date_of_birth" type="date"
                      formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <StorageDocumentField label="Passport Copy"  folder="beneficiaries/documents" accept=".pdf,.jpg,.jpeg,.png"
                        onUpload={(key) => updateChild(i, "passport_copy",  key)}
                        onRemove={() => updateChild(i, "passport_copy",  null)}
                        currentName={child.passport_copy  ? "Passport uploaded" : undefined}
                        field={`passport_copy_${i}`} errors={{}} />
                      <StorageDocumentField label="Entrance Stamp" folder="beneficiaries/documents" accept=".pdf,.jpg,.jpeg,.png"
                        onUpload={(key) => updateChild(i, "entrance_stump", key)}
                        onRemove={() => updateChild(i, "entrance_stump", null)}
                        currentName={child.entrance_stump ? "Stamp uploaded"    : undefined}
                        field={`entrance_stump_${i}`} errors={{}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={onBack} className={btnBack}>
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onSubmit} disabled={loading} className={btnNext}>
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <><MdCheckCircle className="h-4 w-4" /> Submit Application</>
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
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdEmail className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-navy-700">Verify your account</h2>
        <p className="mt-1 text-sm text-slate-400">
          We sent a 6-digit code via{" "}
          <span className="font-semibold text-slate-600">{channel}</span> to{" "}
          <span className="font-semibold text-slate-600">{email}</span>
        </p>
      </div>

      <AlertBanner message={otpError} />
      {resent && <AlertBanner message="A new code has been sent." variant="success" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">6-Digit Code</label>
          <input
            type="text" inputMode="numeric" maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="——————" autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.6em] text-slate-900 outline-none transition-all duration-200 focus:border-green focus:bg-white placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
          />
          <p className="mt-1.5 text-center text-xs text-slate-400">{code.length}/6 digits entered</p>
        </div>

        <button type="submit" disabled={loading || !isReady} className={`w-full ${btnNext}`}>
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Verify & Continue"
          }
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Didn't receive a code?{" "}
        <button onClick={handleResend} disabled={resending}
          className="font-medium text-green transition-colors hover:text-[#006833] disabled:opacity-50">
          {resending ? "Sending…" : "Resend"}
        </button>
      </p>
    </>
  );
};

/* ─────────────────────────────────────────────────
   Main
───────────────────────────────────────────────── */
export default function BeneficiaryRegisterForm() {
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
    family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "", spouse_job: "",
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
          family_in_malaysia:   family.family_in_malaysia,
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

  const heroStep = step <= 4 ? step : 4;

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
            By applying you agree to our{" "}
            <a href="/about" className="text-green hover:underline">privacy policy</a>.
            Your information is kept confidential.
          </p>
        </div>
      </section>
    </div>
  );
}
