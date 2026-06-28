import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdPerson, MdFlight,
  MdFamilyRestroom, MdBadge, MdShield,
} from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import {
  InputField, SelectField, TextareaField,
  ToggleInput, StorageDocumentField, validate,
} from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetBeneficiary, useUpdateBeneficiary, useGetClassifications } from "components/features/beneficiaries/hooks";
import {
  GENDER_OPTIONS, MARITAL_STATUS_OPTIONS, ACCOUNT_STATUS_FORM_OPTIONS,
} from "components/features/beneficiaries/constants/beneficiary";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255, message: "Name must be 255 characters or fewer" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

export default function BeneficiaryEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { beneficiary, execute: fetchBeneficiary, loading, error: loadError } = useGetBeneficiary();
  const { execute: updateBeneficiary, loading: saving, error: saveError } = useUpdateBeneficiary();
  const { classifications } = useGetClassifications();
  const { success, error: toastError } = useToast();

  const [userForm, setUserForm] = useState({
    full_name: "", email: "", phone_number: "", is_active: true,
  });
  const [classForm, setClassForm] = useState({ classification: "" });
  const [personalForm, setPersonalForm] = useState({
    full_name_arabic: "", passport_number: "", date_of_birth: "", gender: "",
    marital_status: "", account_status: "", background: "",
  });
  const [locationForm, setLocationForm] = useState({
    country_of_origin: "", date_arrived_in_malaysia: "", current_city: "", address: "",
  });
  const [familyForm, setFamilyForm] = useState({
    family_in_malaysia: false, spouse_name: "", spouse_name_arabic: "", spouse_job: "", number_of_children: "",
  });
  const [idDoc, setIdDoc] = useState(null);

  const [initialUser,     setInitialUser]     = useState(null);
  const [initialClass,    setInitialClass]    = useState(null);
  const [initialPersonal, setInitialPersonal] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  const [initialFamily,   setInitialFamily]   = useState(null);
  const [initialIdDoc,    setInitialIdDoc]    = useState(undefined);
  const [errors, setErrors] = useState({});

  const setU  = (f, v) => setUserForm((p)    => ({ ...p, [f]: v }));
  const setC  = (f, v) => setClassForm((p)   => ({ ...p, [f]: v }));
  const setP  = (f, v) => setPersonalForm((p) => ({ ...p, [f]: v }));
  const setL  = (f, v) => setLocationForm((p) => ({ ...p, [f]: v }));
  const setFa = (f, v) => setFamilyForm((p)  => ({ ...p, [f]: v }));

  const CLASSIFICATION_OPTIONS = [
    { value: "", label: "Select classification" },
    ...classifications.map((c) => ({ value: c.id, label: c.name })),
  ];

  const isDirty = initialUser === null || initialClass === null || !initialPersonal || !initialLocation || !initialFamily || initialIdDoc === undefined || (
    JSON.stringify(userForm) !== JSON.stringify(initialUser) ||
    JSON.stringify(classForm)    !== JSON.stringify(initialClass)    ||
    JSON.stringify(personalForm) !== JSON.stringify(initialPersonal) ||
    JSON.stringify(locationForm) !== JSON.stringify(initialLocation) ||
    JSON.stringify(familyForm)   !== JSON.stringify(initialFamily)   ||
    idDoc !== initialIdDoc
  );

  useEffect(() => {
    fetchBeneficiary(id).then((data) => {
      if (!data) return;
      const u  = data.user ?? {};
      const fi = data.family_information ?? {};
      const cd = data.classification_details ?? {};

      const uSnap = { full_name: u.full_name ?? "", email: u.email ?? "", phone_number: u.phone_number ?? "", is_active: u.is_active ?? true };
      const cSnap = { classification: cd.id ?? data.classification ?? "" };
      const pSnap = {
        full_name_arabic: data.full_name_arabic  ?? "",
        passport_number:  data.passport_number   ?? "",
        date_of_birth:    data.date_of_birth     ? data.date_of_birth.slice(0, 10) : "",
        gender:           data.gender            ?? "",
        marital_status:   data.marital_status    ?? "",
        account_status:   data.account_status    ?? "",
        background:       data.background        ?? "",
      };
      const lSnap = {
        country_of_origin:        data.country_of_origin        ?? "",
        date_arrived_in_malaysia: data.date_arrived_in_malaysia ? data.date_arrived_in_malaysia.slice(0, 10) : "",
        current_city:             data.current_city             ?? "",
        address:                  data.address                  ?? "",
      };
      const faSnap = {
        family_in_malaysia: fi.family_in_malaysia  ?? false,
        spouse_name:        fi.spouse_name         ?? "",
        spouse_name_arabic: fi.spouse_name_arabic  ?? "",
        spouse_job:         fi.spouse_job          ?? "",
        number_of_children: fi.number_of_children  ?? "",
      };
      const docSnap = data.id_document ?? null;

      setUserForm(uSnap);
      setClassForm(cSnap);
      setPersonalForm(pSnap);
      setLocationForm(lSnap);
      setFamilyForm(faSnap);
      setIdDoc(docSnap);

      setInitialUser(uSnap);
      setInitialClass(cSnap);
      setInitialPersonal(pSnap);
      setInitialLocation(lSnap);
      setInitialFamily(faSnap);
      setInitialIdDoc(docSnap);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(userForm[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    try {
      const payload = {
        user: {
          full_name:    userForm.full_name,
          email:        userForm.email,
          phone_number: userForm.phone_number || undefined,
          is_active:    userForm.is_active,
        },
        classification:             classForm.classification             || undefined,
        full_name_arabic:           personalForm.full_name_arabic        || undefined,
        passport_number:            personalForm.passport_number         || undefined,
        date_of_birth:              personalForm.date_of_birth           || undefined,
        gender:                     personalForm.gender                  || undefined,
        marital_status:             personalForm.marital_status          || undefined,
        account_status:             personalForm.account_status          || undefined,
        background:                 personalForm.background              || undefined,
        id_document:                idDoc                                ?? undefined,
        country_of_origin:          locationForm.country_of_origin       || undefined,
        date_arrived_in_malaysia:   locationForm.date_arrived_in_malaysia || undefined,
        current_city:               locationForm.current_city            || undefined,
        address:                    locationForm.address                 || undefined,
        family_information: {
          family_in_malaysia:  familyForm.family_in_malaysia,
          spouse_name:         familyForm.spouse_name        || null,
          spouse_name_arabic:  familyForm.spouse_name_arabic || null,
          spouse_job:          familyForm.spouse_job         || null,
          number_of_children:  familyForm.number_of_children !== "" ? Number(familyForm.number_of_children) : null,
        },
      };
      await updateBeneficiary(id, payload);
      success("Beneficiary updated", `${userForm.full_name} has been updated successfully.`);
      navigate(`${base}/beneficiaries/${id}`);
    } catch (err) {
      toastError("Failed to update beneficiary", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading beneficiary…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Beneficiary"
        subtitle={userForm.full_name || "Update beneficiary details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Beneficiary" onClick={() => navigate(`${base}/beneficiaries/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── User Account ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="User Account" subtitle="Login credentials" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField    label="Full Name"     field="full_name"    placeholder="Ahmad Faris"           formData={userForm} errors={errors} updateFormData={setU} rules={RULES.full_name} />
            <InputField    label="Email Address" field="email"        type="email" placeholder="ahmad@email.com" formData={userForm} errors={errors} updateFormData={setU} rules={RULES.email} />
          </div>
          <InputField label="Phone Number" field="phone_number" placeholder="+60 12-345 6789" required={false} formData={userForm} errors={errors} updateFormData={setU} />
          <ToggleInput label="Account Active" field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
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
            <InputField    label="Full Name (Arabic)"  field="full_name_arabic" placeholder="أحمد فارس"   required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <InputField    label="Passport Number"     field="passport_number"  placeholder="A12345678"    required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField    label="Date of Birth"  field="date_of_birth"  type="date"       required={false}            formData={personalForm} errors={errors} updateFormData={setP} />
            <SelectField   label="Gender"         field="gender"         options={GENDER_OPTIONS}  required={false}    formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField   label="Marital Status"  field="marital_status"  options={MARITAL_STATUS_OPTIONS}      required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <SelectField   label="Account Status"  field="account_status"  options={ACCOUNT_STATUS_FORM_OPTIONS} required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <TextareaField label="Background" field="background" rows={3} placeholder="Brief background about the beneficiary…" required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          <StorageDocumentField
            label="ID Document"
            folder="beneficiaries/documents"
            accept=".pdf,.jpg,.jpeg,.png"
            currentName={idDoc ? "Current document" : undefined}
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
            <InputField  label="Current City" field="current_city" placeholder="Kuala Lumpur"    required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField  label="Address"      field="address"      placeholder="No. 1, Jalan…"   required={false} formData={locationForm} errors={errors} updateFormData={setL} />
          </div>
        </div>

        {/* ── Family Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title="Family Information" subtitle="Family details and dependants" />
          <ToggleInput label="Family in Malaysia" field="family_in_malaysia" formData={familyForm} errors={errors} updateFormData={setFa} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Spouse Name"          field="spouse_name"        placeholder="Fatimah binti Ali"  required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label="Spouse Name (Arabic)" field="spouse_name_arabic" placeholder="فاطمة بنت علي"  required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Spouse Occupation" field="spouse_job"         placeholder="Teacher"             required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label="No. of Children"   field="number_of_children" type="number" placeholder="0"    required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`${base}/beneficiaries/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Save Changes"
            loading={saving}
            disabled={!userForm.full_name.trim() || !userForm.email.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
