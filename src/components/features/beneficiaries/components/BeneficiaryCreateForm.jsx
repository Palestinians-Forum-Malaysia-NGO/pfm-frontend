import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdPersonAdd, MdPerson, MdFlight,
  MdFamilyRestroom, MdBadge, MdInfoOutline, MdShield,
} from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import {
  InputField, SelectField, TextareaField,
  ToggleInput, StorageDocumentField, validate,
} from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateBeneficiary, useGetClassifications } from "components/features/beneficiaries/hooks";
import {
  GENDER_OPTIONS, MARITAL_STATUS_OPTIONS,
} from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [
    { required: true, message: "Full name is required" },
    { maxLength: 255, message: "Name must be 255 characters or fewer" },
  ],
  email: [
    { required: true, message: "Email is required" },
    { email: true },
  ],
};

const EMPTY_CHILD = {
  child_name: "", child_name_arabic: "", child_date_of_birth: "",
  passport_copy: null, entrance_stump: null,
};

export default function BeneficiaryCreateForm() {
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createBeneficiary, loading, error } = useCreateBeneficiary();
  const { classifications } = useGetClassifications();
  const { success, error: toastError } = useToast();

  /* ── Form state ── */
  const [accountForm, setAccountForm] = useState({ full_name: "", email: "", phone_number: "" });
  const [classForm,    setClassForm]   = useState({ classification: "" });
  const [personalForm, setPersonalForm] = useState({
    full_name_arabic: "", passport_number: "", date_of_birth: "",
    gender: "", marital_status: "", background: "",
  });
  const [locationForm, setLocationForm] = useState({
    country_of_origin: "", date_arrived_in_malaysia: "", current_city: "", address: "",
  });
  const [familyForm, setFamilyForm] = useState({
    family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "",
    spouse_job: "", number_of_children: "",
  });
  const [children, setChildren] = useState([]);
  const [idDoc,   setIdDoc]   = useState(null);
  const [errors,  setErrors]  = useState({});

  const setA  = (f, v) => setAccountForm((p)  => ({ ...p, [f]: v }));
  const setC  = (f, v) => setClassForm((p)    => ({ ...p, [f]: v }));
  const setP  = (f, v) => setPersonalForm((p) => ({ ...p, [f]: v }));
  const setL  = (f, v) => setLocationForm((p) => ({ ...p, [f]: v }));
  const setFa = (f, v) => setFamilyForm((p)   => ({ ...p, [f]: v }));

  const setChild = (i, f, v) =>
    setChildren((prev) => prev.map((c, idx) => idx === i ? { ...c, [f]: v } : c));

  const CLASSIFICATION_OPTIONS = [
    { value: "", label: "Select classification" },
    ...classifications.map((c) => ({ value: c.id, label: c.name })),
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
        /* user-level fields (flat, no nested user object) */
        full_name:    accountForm.full_name,
        email:        accountForm.email,
        phone_number: accountForm.phone_number || undefined,

        /* beneficiary fields */
        classification:           classForm.classification             || undefined,
        full_name_arabic:         personalForm.full_name_arabic        || undefined,
        passport_number:          personalForm.passport_number         || undefined,
        date_of_birth:            personalForm.date_of_birth           || undefined,
        gender:                   personalForm.gender                  || undefined,
        marital_status:           personalForm.marital_status          || undefined,
        background:               personalForm.background              || undefined,
        id_document:              idDoc                                || undefined,
        country_of_origin:        locationForm.country_of_origin       || undefined,
        date_arrived_in_malaysia: locationForm.date_arrived_in_malaysia || undefined,
        current_city:             locationForm.current_city            || undefined,
        address:                  locationForm.address                 || undefined,

        family_information: {
          family_in_malaysia:  familyForm.family_in_malaysia,
          spouse_name:         familyForm.spouse_name        || null,
          spouse_name_arabic:  familyForm.spouse_name_arabic || null,
          spouse_job:          familyForm.spouse_job         || null,
          number_of_children:  familyForm.number_of_children !== "" ? Number(familyForm.number_of_children) : null,
          children_information: children.map((c) => ({
            child_name:         c.child_name         || undefined,
            child_name_arabic:  c.child_name_arabic  || undefined,
            child_date_of_birth: c.child_date_of_birth || undefined,
            passport_copy:      c.passport_copy      || undefined,
            entrance_stump:     c.entrance_stump     || undefined,
          })),
        },
      };

      const created = await createBeneficiary(payload);
      success("Beneficiary added", `${accountForm.full_name} has been registered successfully.`);
      navigate(`${base}/beneficiaries/${created.id}`);
    } catch (err) {
      toastError("Failed to create beneficiary", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="Add Beneficiary"
        subtitle="Register a new PFM beneficiary profile"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Beneficiaries" onClick={() => navigate(`${base}/beneficiaries`)} />
        }
      />

      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <MdInfoOutline className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p className="text-xs text-blue-700">
          Beneficiaries can also self-register via the <span className="font-semibold">Register</span> page. Use this form to manually add a beneficiary as an administrator.
        </p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Basic contact information for the beneficiary" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Full Name"     field="full_name"    placeholder="Ahmad Faris" formData={accountForm} errors={errors} updateFormData={setA} rules={RULES.full_name} />
            <InputField label="Email Address" field="email"        type="email" placeholder="ahmad@email.com" formData={accountForm} errors={errors} updateFormData={setA} rules={RULES.email} />
          </div>
          <InputField label="Phone Number" field="phone_number" placeholder="+60 12-345 6789" required={false} formData={accountForm} errors={errors} updateFormData={setA} />
        </div>

        {/* ── Classification ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdShield className="h-5 w-5" />} title="Classification" subtitle="Assign a beneficiary category" />
          <SelectField label="Classification" field="classification" options={CLASSIFICATION_OPTIONS} required={false} formData={classForm} errors={errors} updateFormData={setC} />
        </div>

        {/* ── Personal Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Personal Information" subtitle="Identity and personal details" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label="Full Name (Arabic)" field="full_name_arabic" placeholder="أحمد فارس"  required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <InputField  label="Passport Number"    field="passport_number"  placeholder="A12345678"   required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label="Date of Birth"  field="date_of_birth"  type="date"       required={false}            formData={personalForm} errors={errors} updateFormData={setP} />
            <SelectField label="Gender"         field="gender"         options={GENDER_OPTIONS} required={false}     formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <SelectField   label="Marital Status" field="marital_status" options={MARITAL_STATUS_OPTIONS} required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          <TextareaField label="Background" field="background" rows={3} placeholder="Brief background about the beneficiary…" required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          <StorageDocumentField
            label="ID Document"
            folder="beneficiaries/documents"
            accept=".pdf,.jpg,.jpeg,.png"
            onUpload={(key) => setIdDoc(key)}
            onRemove={() => setIdDoc(null)}
            errors={errors}
            field="id_document"
          />
        </div>

        {/* ── Location & Travel ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFlight className="h-5 w-5" />} title="Location & Travel" subtitle="Country of origin and residence in Malaysia" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label="Country of Origin"        field="country_of_origin"       options={COUNTRY_OPTIONS} required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField  label="Date Arrived in Malaysia" field="date_arrived_in_malaysia" type="date" required={false} formData={locationForm} errors={errors} updateFormData={setL} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label="Current City" field="current_city" placeholder="Kuala Lumpur"   required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField  label="Address"      field="address"      placeholder="No. 1, Jalan…"  required={false} formData={locationForm} errors={errors} updateFormData={setL} />
          </div>
        </div>

        {/* ── Family Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title="Family Information" subtitle="Family details and dependants" />
          <ToggleInput label="Family in Malaysia" field="family_in_malaysia" formData={familyForm} errors={errors} updateFormData={setFa} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Spouse Name"          field="spouse_name"        placeholder="Fatimah binti Ali" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label="Spouse Name (Arabic)" field="spouse_name_arabic" placeholder="فاطمة بنت علي"  required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Spouse Occupation" field="spouse_job"         placeholder="Teacher"          required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label="No. of Children"   field="number_of_children" type="number" placeholder="0" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>

          {/* ── Children ── */}
          {children.length > 0 && (
            <div className="mt-5 flex flex-col gap-4">
              {children.map((child, i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Child {i + 1}</p>
                    <button type="button" onClick={() => setChildren((p) => p.filter((_, idx) => idx !== i))}
                      className="text-xs font-medium text-red-400 transition-colors hover:text-red-600">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <InputField label="Child Name"         field="child_name"         placeholder="Ahmad Jr." formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                    <InputField label="Child Name (Arabic)" field="child_name_arabic"  placeholder="أحمد"      formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                  </div>
                  <InputField label="Date of Birth" field="child_date_of_birth" type="date" formData={child} errors={{}} updateFormData={(f, v) => setChild(i, f, v)} />
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <StorageDocumentField label="Passport Copy"  folder="beneficiaries/children" accept=".pdf,.jpg,.jpeg,.png"
                      onUpload={(key) => setChild(i, "passport_copy",  key)}
                      onRemove={() => setChild(i, "passport_copy",  null)} field={`passport_copy_${i}`} errors={{}} />
                    <StorageDocumentField label="Entrance Stamp" folder="beneficiaries/children" accept=".pdf,.jpg,.jpeg,.png"
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
            + Add Child
          </button>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`${base}/beneficiaries`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Beneficiary"
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
