import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MdPersonAdd, MdArrowForward, MdArrowBack, MdEmail,
  MdBadge, MdFamilyRestroom, MdCheck, MdAdd, MdClose, MdPeople,
} from "react-icons/md";
import InputField            from "components/form/InputField";
import SelectField           from "components/form/SelectField";
import TextareaField         from "components/form/TextareaField";
import ToggleInput           from "components/form/ToggleInput";
import StorageDocumentField  from "components/form/upload/StorageDocumentField";
import AlertBanner           from "components/ui/AlertBanner";
import { validate }          from "components/form/utils/validation";
import { useNavigate } from "react-router-dom";
import { useRegister, useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { setTokens } from "components/features/auth/utils";
import { OTP_PURPOSE }       from "components/features/auth/types";
import { useGetClassifications } from "components/features/beneficiaries/hooks";
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_OPTIONS }   from "components/features/beneficiaries/constants/countries";

/* ── Hero ───────────────────────────────────────── */
const HERO_STEPS = [
  { n: "1", label: "Account" },
  { n: "2", label: "Personal" },
  { n: "3", label: "Family" },
  { n: "✓", label: "Verify" },
];

const Hero = () => (
  <div className="border-b border-slate-100 bg-white px-6 py-14 text-center">
    <span className="inline-flex items-center gap-2 rounded-full bg-green/10 px-4 py-1.5 text-xs font-semibold text-green">
      <MdPeople className="h-4 w-4" />
      Beneficiary Registration
    </span>
    <h1 className="mx-auto mt-4 max-w-xl text-3xl font-extrabold leading-tight text-navy-700 sm:text-4xl">
      Apply for Beneficiary Support
    </h1>
    <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-400">
      Join the PFM support network. Fill in the application below — your details are kept
      confidential and used only to process your request.
    </p>

    <div className="mt-10 flex items-center justify-center gap-0">
      {HERO_STEPS.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green/10 text-sm font-bold text-green ring-1 ring-green/20">
              {s.n}
            </div>
            <span className="text-[10px] font-semibold text-slate-400">{s.label}</span>
          </div>
          {i < HERO_STEPS.length - 1 && (
            <div className="mb-4 mx-2 h-px w-10 bg-slate-200 sm:w-16" />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

/* ── Step indicator ─────────────────────────────── */
const STEP_META = [
  { label: "Account" },
  { label: "Personal" },
  { label: "Family" },
];

const StepIndicator = ({ current }) => (
  <div className="mb-8 flex items-center">
    {STEP_META.map(({ label }, i) => {
      const n      = i + 1;
      const done   = n < current;
      const active = n === current;
      return (
        <React.Fragment key={n}>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
              done || active ? "bg-green text-white" : "border-2 border-slate-200 text-slate-300"
            }`}>
              {done ? <MdCheck className="h-4 w-4" /> : n}
            </div>
            <span className={`text-[9px] font-semibold leading-none ${active ? "text-green" : done ? "text-slate-500" : "text-slate-300"}`}>
              {label}
            </span>
          </div>
          {i < STEP_META.length - 1 && (
            <div className={`mx-2 mb-3 h-0.5 flex-1 rounded-full transition-all duration-300 ${n < current ? "bg-green" : "bg-slate-100"}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

/* ── Step 1 — Account ───────────────────────────── */
const ACCOUNT_RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255 }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

const AccountStep = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState({});

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

  const set     = (f, v) => onChange((p) => ({ ...p, [f]: v }));
  const canNext = data.full_name.trim() && data.email.trim();

  return (
    <>
      <div className="mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green/10">
          <MdPersonAdd className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-navy-700">Create account</h2>
        <p className="mt-1 text-sm text-slate-400">Enter your contact details to get started.</p>
      </div>

      <div className="flex flex-col gap-1">
        <InputField label="Full Name" field="full_name" placeholder="Ahmad Faris bin Abdullah"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.full_name} />
        <InputField label="Email Address" field="email" type="email" placeholder="you@example.com"
          formData={data} errors={errors} updateFormData={set} rules={ACCOUNT_RULES.email} />
        <InputField label="Phone Number" field="phone_number" placeholder="+60 12-345 6789"
          formData={data} errors={{}} updateFormData={set} />
      </div>

      <button type="button" onClick={handleNext} disabled={!canNext}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next <MdArrowForward className="h-4 w-4" />
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

/* ── Step 2 — Personal Info ─────────────────────── */
const PersonalStep = ({ data, onChange, idDoc, onIdDocChange, onBack, onNext }) => {
  const set = (f, v) => onChange((p) => ({ ...p, [f]: v }));

  return (
    <>
      <div className="mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green/10">
          <MdBadge className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-navy-700">Personal information</h2>
        <p className="mt-1 text-sm text-slate-400">Help us know you better. All fields are optional.</p>
      </div>

      <div className="flex flex-col gap-1">
        <InputField label="Full Name (Arabic)" field="full_name_arabic" placeholder="أحمد فارس"
          formData={data} errors={{}} updateFormData={set} />
        <InputField label="Passport Number" field="passport_number" placeholder="A12345678"
          formData={data} errors={{}} updateFormData={set} />
        <InputField label="Date of Birth" field="date_of_birth" type="date"
          formData={data} errors={{}} updateFormData={set} />
        <SelectField label="Gender" field="gender" options={GENDER_OPTIONS}
          formData={data} errors={{}} updateFormData={set} />
        <SelectField label="Marital Status" field="marital_status" options={MARITAL_STATUS_OPTIONS}
          formData={data} errors={{}} updateFormData={set} />
        <SelectField label="Country of Origin" field="country_of_origin" options={COUNTRY_OPTIONS}
          formData={data} errors={{}} updateFormData={set} />
        <TextareaField label="Background" field="background"
          placeholder="Brief background about your situation (optional)…"
          formData={data} errors={{}} updateFormData={set} rows={3} />
        <StorageDocumentField
          label="ID Document"
          folder="beneficiaries/documents"
          accept=".pdf,.jpg,.jpeg,.png"
          onUpload={(key) => onIdDocChange(key)}
          onRemove={() => onIdDocChange(null)}
          currentName={idDoc ? "Uploaded document" : undefined}
        />
      </div>

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onBack}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
        >
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onNext}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
        >
          Next <MdArrowForward className="h-4 w-4" />
        </button>
      </div>
    </>
  );
};

/* ── Step 3 — Location & Family ─────────────────── */
const EMPTY_CHILD = {
  child_name: "", child_name_arabic: "", child_date_of_birth: "",
  passport_copy: null, entrance_stump: null,
};

const LocationFamilyStep = ({ locData, onLocChange, famData, onFamChange, onBack, onSubmit, loading, error }) => {
  const setL = (f, v) => onLocChange((p) => ({ ...p, [f]: v }));
  const setF = (f, v) => onFamChange((p) => ({ ...p, [f]: v }));

  const addChild    = () => onFamChange((p) => ({ ...p, children: [...p.children, { ...EMPTY_CHILD }] }));
  const removeChild = (i) => onFamChange((p) => ({ ...p, children: p.children.filter((_, idx) => idx !== i) }));
  const updateChild = (i, field, value) =>
    onFamChange((p) => ({
      ...p,
      children: p.children.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)),
    }));

  return (
    <>
      <div className="mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green/10">
          <MdFamilyRestroom className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-navy-700">Location & family</h2>
        <p className="mt-1 text-sm text-slate-400">Residence details and family information. All optional.</p>
      </div>

      <AlertBanner message={error} />

      <div className="flex flex-col gap-1">
        <InputField label="Date Arrived in Malaysia" field="date_arrived_in_malaysia" type="date"
          formData={locData} errors={{}} updateFormData={setL} />
        <InputField label="Current City" field="current_city" placeholder="Kuala Lumpur"
          formData={locData} errors={{}} updateFormData={setL} />
        <InputField label="Address" field="address" placeholder="No. 1, Jalan…"
          formData={locData} errors={{}} updateFormData={setL} />

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-100" />
          <span className="text-xs font-semibold text-slate-400">Family</span>
          <div className="h-px flex-1 bg-slate-100" />
        </div>

        <ToggleInput label="Family in Malaysia" field="family_in_malaysia"
          formData={famData} errors={{}} updateFormData={setF} />
        <InputField label="Spouse Name" field="spouse_name" placeholder="Fatimah binti Ali"
          formData={famData} errors={{}} updateFormData={setF} />
        <InputField label="Spouse Name (Arabic)" field="spouse_name_arabic" placeholder="فاطمة بنت علي"
          formData={famData} errors={{}} updateFormData={setF} />
        <InputField label="Spouse Occupation" field="spouse_job" placeholder="Teacher"
          formData={famData} errors={{}} updateFormData={setF} />

        {/* ── Children ── */}
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Children ({famData.children.length})
            </span>
            <button type="button" onClick={addChild}
              className="inline-flex items-center gap-1 rounded-lg bg-green/10 px-2.5 py-1 text-xs font-semibold text-green transition-colors hover:bg-green/20"
            >
              <MdAdd className="h-3.5 w-3.5" /> Add Child
            </button>
          </div>

          {famData.children.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 py-3 text-center text-xs text-slate-400">
              No children added yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {famData.children.map((child, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Child {i + 1}</span>
                    <button type="button" onClick={() => removeChild(i)}
                      className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <MdClose className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <InputField label="Child Name" field="child_name" placeholder="Ahmad"
                      formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />
                    <InputField label="Child Name (Arabic)" field="child_name_arabic" placeholder="أحمد"
                      formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />
                    <InputField label="Date of Birth" field="child_date_of_birth" type="date"
                      formData={child} errors={{}} updateFormData={(f, v) => updateChild(i, f, v)} />

                    <div className="mt-1 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <StorageDocumentField
                        label="Passport Copy"
                        folder="beneficiaries/documents"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onUpload={(key) => updateChild(i, "passport_copy", key)}
                        onRemove={() => updateChild(i, "passport_copy", null)}
                        currentName={child.passport_copy ? "Passport uploaded" : undefined}
                      />
                      <StorageDocumentField
                        label="Entrance Stamp"
                        folder="beneficiaries/documents"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onUpload={(key) => updateChild(i, "entrance_stump", key)}
                        onRemove={() => updateChild(i, "entrance_stump", null)}
                        currentName={child.entrance_stump ? "Stamp uploaded" : undefined}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onBack}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
        >
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <button type="button" onClick={onSubmit} disabled={loading}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <><MdPersonAdd className="h-4 w-4" /> Submit Application</>
          }
        </button>
      </div>
    </>
  );
};

/* ── Step 4 — OTP ───────────────────────────────── */
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
      navigate("/auth/set-password");
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
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green/10">
          <MdEmail className="h-5 w-5 text-green" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-navy-700">Verify your account</h2>
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

        <button type="submit" disabled={loading || !isReady}
          className="flex h-11 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Verify & Continue"
          }
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Didn't receive a code?{" "}
        <button onClick={handleResend} disabled={resending}
          className="font-medium text-green transition-colors hover:text-[#006833] disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </p>
    </>
  );
};

/* ── Main ───────────────────────────────────────── */
export default function BeneficiaryRegisterForm() {
  const [step, setStep]       = useState(1);
  const [otpMeta, setOtpMeta] = useState({ email: "", channel: "" });

  const { classifications }       = useGetClassifications();
  const defaultClassification     = useMemo(() => classifications[0]?.id ?? "", [classifications]);

  const [account,  setAccount]  = useState({ full_name: "", email: "", phone_number: "" });
  const [personal, setPersonal] = useState({
    full_name_arabic: "", passport_number: "", date_of_birth: "",
    gender: "", marital_status: "", country_of_origin: "", background: "",
  });
  const [idDoc,    setIdDoc]    = useState(null);
  const [location, setLocation] = useState({ date_arrived_in_malaysia: "", current_city: "", address: "" });
  const [family,   setFamily]   = useState({
    family_in_malaysia: false,
    spouse_name: "", spouse_name_arabic: "", spouse_job: "",
    children: [],
  });

  const { execute: register, loading, error } = useRegister();

  const handleSubmit = async () => {
    try {
      const payload = {
        /* user-level fields */
        full_name:    account.full_name    || undefined,
        email:        account.email        || undefined,
        phone_number: account.phone_number || undefined,

        classification:           defaultClassification                  || undefined,
        full_name_arabic:         personal.full_name_arabic             || undefined,
        passport_number:          personal.passport_number              || undefined,
        date_of_birth:            personal.date_of_birth                || undefined,
        gender:                   personal.gender                       || undefined,
        marital_status:           personal.marital_status               || undefined,
        country_of_origin:        personal.country_of_origin            || undefined,
        background:               personal.background                   || undefined,
        id_document:              idDoc                                  || undefined,
        date_arrived_in_malaysia: location.date_arrived_in_malaysia     || undefined,
        current_city:             location.current_city                 || undefined,
        address:                  location.address                      || undefined,
        family_information: {
          family_in_malaysia:  family.family_in_malaysia,
          spouse_name:         family.spouse_name        || null,
          spouse_name_arabic:  family.spouse_name_arabic || null,
          spouse_job:          family.spouse_job         || null,
          number_of_children:  family.children.length,
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
      setStep(4);
    } catch { /* error shown by useRegister */ }
  };

  return (
    <div>
      <Hero />

      <section className="bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
            {step < 4 && <StepIndicator current={step} />}

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
              <LocationFamilyStep
                locData={location} onLocChange={setLocation}
                famData={family}   onFamChange={setFamily}
                onBack={() => setStep(2)} onSubmit={handleSubmit}
                loading={loading} error={error}
              />
            )}
            {step === 4 && (
              <OtpStep email={otpMeta.email} channel={otpMeta.channel} onBack={() => setStep(1)} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
