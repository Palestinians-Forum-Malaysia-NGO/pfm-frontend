import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdPerson, MdFlight,
  MdFamilyRestroom, MdBadge, MdShield, MdCardTravel,
  MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import {
  InputField, SelectField, MultiSelect, TextareaField,
  ToggleInput, StorageDocumentField, StorageImageField, validate,
} from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetBeneficiary, useUpdateBeneficiary, useGetClassifications } from "components/features/beneficiaries/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
};

export default function BeneficiaryEditForm() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { beneficiary, execute: fetchBeneficiary, loading, error: loadError } = useGetBeneficiary();
  const { execute: updateBeneficiary, loading: saving, error: saveError } = useUpdateBeneficiary();
  const { classifications } = useGetClassifications();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [userForm, setUserForm] = useState({ full_name: "", email: "", phone_number: "", is_active: true, profile_photo: null });
  const [photoKey, setPhotoKey] = useState(null);
  const { url: currentPhotoUrl } = useStorageUrl(photoKey);
  const [classForm, setClassForm] = useState({ classifications: [] });
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
  const [visaForm, setVisaForm] = useState({
    has_visa: "", visa_type: "", situation: "", unhcr_number: "", palestine_region: "",
  });
  const [bankForm, setBankForm] = useState({ bank_name: "", account_number: "", account_holder_name: "" });
  const [finForm,  setFinForm]  = useState({ job_title: "", salary: "", payment_frequency: "" });
  const [idDoc, setIdDoc] = useState(null);
  const { url: currentIdDocUrl } = useStorageUrl(idDoc, { forcePresigned: true });

  const [initialUser,     setInitialUser]     = useState(null);
  const [initialClass,    setInitialClass]    = useState(null);
  const [initialPersonal, setInitialPersonal] = useState(null);
  const [initialLocation, setInitialLocation] = useState(null);
  const [initialFamily,   setInitialFamily]   = useState(null);
  const [initialVisa,     setInitialVisa]     = useState(null);
  const [initialBank,     setInitialBank]     = useState(null);
  const [initialFin,      setInitialFin]      = useState(null);
  const [initialIdDoc,    setInitialIdDoc]    = useState(undefined);
  const [errors, setErrors] = useState({});

  const setU  = (f, v) => setUserForm((p)    => ({ ...p, [f]: v }));
  const setC  = (f, v) => setClassForm((p)   => ({ ...p, [f]: v }));
  const setP  = (f, v) => setPersonalForm((p) => ({ ...p, [f]: v }));
  const setL  = (f, v) => setLocationForm((p) => ({ ...p, [f]: v }));
  const setFa = (f, v) => setFamilyForm((p)  => ({ ...p, [f]: v }));
  const setV  = (f, v) => setVisaForm((p)    => ({ ...p, [f]: v }));
  const setB  = (f, v) => setBankForm((p)    => ({ ...p, [f]: v }));
  const setFi = (f, v) => setFinForm((p)     => ({ ...p, [f]: v }));

  const CLASSIFICATION_OPTIONS = classifications.map((c) => ({
    value: c.id,
    label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
  }));

  const ACCOUNT_STATUS_FORM_OPTIONS_T = [
    { value: "active",    label: t("beneficiaries.account_status_active") },
    { value: "pending",   label: t("beneficiaries.account_status_pending") },
    { value: "suspended", label: t("beneficiaries.account_status_suspended") },
    { value: "rejected",  label: t("beneficiaries.account_status_rejected") },
  ];

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

  const isDirty = initialUser === null || initialClass === null || !initialPersonal || !initialLocation || !initialFamily || !initialVisa || !initialBank || !initialFin || initialIdDoc === undefined || (
    JSON.stringify(userForm)     !== JSON.stringify(initialUser)     ||
    JSON.stringify(classForm)    !== JSON.stringify(initialClass)    ||
    JSON.stringify(personalForm) !== JSON.stringify(initialPersonal) ||
    JSON.stringify(locationForm) !== JSON.stringify(initialLocation) ||
    JSON.stringify(familyForm)   !== JSON.stringify(initialFamily)   ||
    JSON.stringify(visaForm)     !== JSON.stringify(initialVisa)     ||
    JSON.stringify(bankForm)     !== JSON.stringify(initialBank)     ||
    JSON.stringify(finForm)      !== JSON.stringify(initialFin)      ||
    idDoc !== initialIdDoc
  );

  useEffect(() => {
    fetchBeneficiary(id).then((data) => {
      if (!data) return;
      const u   = data.user ?? {};
      const fi  = data.family_information ?? {};
      const bi  = u.banking_information   ?? {};
      const fi2 = u.financial_information ?? {};

      const uSnap = { full_name: u.full_name ?? "", email: u.email ?? "", phone_number: u.phone_number ?? "", is_active: u.is_active ?? true, profile_photo: u.profile_photo ?? null };
      const cSnap = { classifications: (data.classifications ?? []).map((c) => c.id) };
      const pSnap = {
        full_name_arabic: data.full_name_ar       ?? "",
        passport_number:  data.passport_number    ?? "",
        date_of_birth:    data.date_of_birth      ? data.date_of_birth.slice(0, 10) : "",
        gender:           data.gender             ?? "",
        marital_status:   data.marital_status     ?? "",
        account_status:   data.account_status     ?? "",
        background:       data.background         ?? "",
      };
      const lSnap = {
        country_of_origin:        data.country_of_origin        ?? "",
        date_arrived_in_malaysia: data.date_arrived_in_malaysia  ? data.date_arrived_in_malaysia.slice(0, 10) : "",
        current_city:             data.current_city             ?? "",
        address:                  data.address                  ?? "",
      };
      const faSnap = {
        family_in_malaysia: fi.family_in_malaysia  ?? false,
        spouse_name:        fi.spouse_name         ?? "",
        spouse_name_arabic: fi.spouse_name_ar      ?? "",
        spouse_job:         fi.spouse_job          ?? "",
        number_of_children: fi.number_of_children  ?? "",
      };
      const vSnap = {
        has_visa:         data.has_visa == null ? "" : String(data.has_visa),
        visa_type:        data.visa_type        ?? "",
        situation:        data.situation        ?? "",
        unhcr_number:     data.unhcr_number     ?? "",
        palestine_region: data.palestine_region ?? "",
      };
      const bSnap  = { bank_name: bi.bank_name ?? "", account_number: bi.account_number ?? "", account_holder_name: bi.account_holder_name ?? "" };
      const fiSnap = { job_title: fi2.job_title ?? "", salary: fi2.salary ?? "", payment_frequency: fi2.payment_frequency ?? "" };
      const docSnap = data.id_document ?? null;

      setUserForm(uSnap);    setClassForm(cSnap);    setPersonalForm(pSnap);
      setLocationForm(lSnap); setFamilyForm(faSnap); setVisaForm(vSnap);
      setBankForm(bSnap);    setFinForm(fiSnap);     setIdDoc(docSnap);
      setPhotoKey(u.profile_photo ?? null);

      setInitialUser(uSnap);    setInitialClass(cSnap);    setInitialPersonal(pSnap);
      setInitialLocation(lSnap); setInitialFamily(faSnap); setInitialVisa(vSnap);
      setInitialBank(bSnap);    setInitialFin(fiSnap);     setInitialIdDoc(docSnap);
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
      const hasVisaBool = visaForm.has_visa === "true" ? true : visaForm.has_visa === "false" ? false : undefined;
      const payload = {
        user: {
          full_name:    userForm.full_name,
          email:        userForm.email,
          phone_number: userForm.phone_number || undefined,
          is_active:    userForm.is_active,
          profile_photo: userForm.profile_photo || undefined,
          banking_information: {
            bank_name:           bankForm.bank_name           || undefined,
            account_number:      bankForm.account_number      || undefined,
            account_holder_name: bankForm.account_holder_name || undefined,
          },
          financial_information: {
            job_title:         finForm.job_title         || undefined,
            salary:            finForm.salary            || undefined,
            payment_frequency: finForm.payment_frequency || undefined,
          },
        },
        classifications:            classForm.classifications,
        full_name_arabic:           personalForm.full_name_arabic        || undefined,
        passport_number:            personalForm.passport_number         || undefined,
        date_of_birth:              personalForm.date_of_birth           || undefined,
        gender:                     personalForm.gender                  || undefined,
        marital_status:             personalForm.marital_status          || undefined,
        account_status:             personalForm.account_status          || undefined,
        background:                 personalForm.background              || undefined,
        id_document:                idDoc                                ?? undefined,
        has_visa:                   hasVisaBool,
        visa_type:                  hasVisaBool === true  ? (visaForm.visa_type    || undefined) : undefined,
        situation:                  hasVisaBool === false ? (visaForm.situation    || undefined) : undefined,
        unhcr_number:               (hasVisaBool === false && visaForm.situation === "refugee") ? (visaForm.unhcr_number || undefined) : undefined,
        palestine_region:           locationForm.country_of_origin === "PS" ? (visaForm.palestine_region || undefined) : undefined,
        country_of_origin:          locationForm.country_of_origin        || undefined,
        date_arrived_in_malaysia:   locationForm.date_arrived_in_malaysia  || undefined,
        current_city:               locationForm.current_city             || undefined,
        address:                    locationForm.address                  || undefined,
        family_information: {
          family_in_malaysia:  familyForm.family_in_malaysia,
          spouse_name:         familyForm.spouse_name        || null,
          spouse_name_arabic:  familyForm.spouse_name_arabic || null,
          spouse_job:          familyForm.spouse_job         || null,
          number_of_children:  familyForm.number_of_children !== "" ? Number(familyForm.number_of_children) : null,
        },
      };
      await updateBeneficiary(id, payload);
      success(t("beneficiaries.toast_updated"), `${userForm.full_name} ${t("beneficiaries.toast_updated_sub")}`);
      navigate(`${base}/beneficiaries/${id}`);
    } catch (err) {
      toastError(t("beneficiaries.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("beneficiaries.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("beneficiaries.edit_title")}
        subtitle={userForm.full_name || t("beneficiaries.edit_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("beneficiaries.back_to_beneficiary")} onClick={() => navigate(`${base}/beneficiaries/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── User Account ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("beneficiaries.section_user")} subtitle={t("beneficiaries.section_user_sub")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="beneficiaries/photos"
            currentUrl={currentPhotoUrl}
            onUpload={(key) => { setU("profile_photo", key); setPhotoKey(null); }}
            onRemove={() => { setU("profile_photo", null); setPhotoKey(null); }}
            errors={errors}
            field="profile_photo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.full_name")} field="full_name" placeholder="Ahmad Faris"       formData={userForm} errors={errors} updateFormData={setU} rules={RULES.full_name} />
            <InputField label={t("beneficiaries.email")}     field="email"     type="email" placeholder="ahmad@email.com" formData={userForm} errors={errors} updateFormData={setU} rules={RULES.email} />
          </div>
          <InputField  label={t("beneficiaries.phone")} field="phone_number" placeholder="+60 12-345 6789" required={false} formData={userForm} errors={errors} updateFormData={setU} />
          {isAdmin && (
            <ToggleInput label={t("beneficiaries.account_active")} field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
          )}
        </div>

        {/* ── Classification ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdShield className="h-5 w-5" />} title={t("beneficiaries.section_classification")} subtitle={t("beneficiaries.section_classification_sub")} />
          <MultiSelect label={t("beneficiaries.classification")} field="classifications" options={CLASSIFICATION_OPTIONS} required={false} formData={classForm} errors={errors} updateFormData={setC} />
        </div>

        {/* ── Personal Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("beneficiaries.section_personal")} subtitle={t("beneficiaries.section_personal_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label={t("beneficiaries.full_name_ar_label")} field="full_name_arabic" placeholder={t("beneficiaries.full_name_ar_placeholder")} required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <InputField  label={t("beneficiaries.passport_number")}    field="passport_number"  placeholder="A12345678" required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label={t("beneficiaries.date_of_birth")} field="date_of_birth" type="date" required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <SelectField label={t("beneficiaries.gender")}        field="gender"        options={GENDER_OPTIONS_T}  required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label={t("beneficiaries.marital_status")}  field="marital_status" options={MARITAL_OPTIONS_T}           required={false} formData={personalForm} errors={errors} updateFormData={setP} />
            <SelectField label={t("beneficiaries.account_status_label")} field="account_status" options={ACCOUNT_STATUS_FORM_OPTIONS_T} required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          </div>
          <TextareaField label={t("beneficiaries.background")} field="background" rows={3} placeholder={t("beneficiaries.background_placeholder")} required={false} formData={personalForm} errors={errors} updateFormData={setP} />
          <StorageDocumentField
            label={t("beneficiaries.id_document")}
            folder="beneficiaries/documents"
            accept=".pdf,.jpg,.jpeg,.png"
            currentName={idDoc ? "Current document" : undefined}
            currentUrl={currentIdDocUrl}
            onUpload={(key) => setIdDoc(key)}
            onRemove={() => setIdDoc(null)}
            errors={errors}
            field="id_document"
          />
        </div>

        {/* ── Location & Travel ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFlight className="h-5 w-5" />} title={t("beneficiaries.section_location")} subtitle={t("beneficiaries.section_location_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label={t("beneficiaries.country_of_origin")} field="country_of_origin"       options={COUNTRY_OPTIONS} required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField  label={t("beneficiaries.date_arrived")}      field="date_arrived_in_malaysia" type="date" required={false} formData={locationForm} errors={errors} updateFormData={setL} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.current_city")} field="current_city" placeholder="Kuala Lumpur"  required={false} formData={locationForm} errors={errors} updateFormData={setL} />
            <InputField label={t("beneficiaries.address")}      field="address"      placeholder="No. 1, Jalan…" required={false} formData={locationForm} errors={errors} updateFormData={setL} />
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

        {/* ── Banking Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("beneficiaries.section_banking")} subtitle={t("beneficiaries.section_banking_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.bank_name")}    field="bank_name"           placeholder="e.g. Maybank"        required={false} formData={bankForm} errors={errors} updateFormData={setB} />
            <InputField label={t("beneficiaries.account_holder")} field="account_holder_name" placeholder="As per bank records" required={false} formData={bankForm} errors={errors} updateFormData={setB} />
          </div>
          <InputField label={t("beneficiaries.account_number")} field="account_number" placeholder="e.g. 1234567890" required={false} formData={bankForm} errors={errors} updateFormData={setB} />
        </div>

        {/* ── Financial Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("beneficiaries.section_financial")} subtitle={t("beneficiaries.section_financial_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.job_title")} field="job_title" placeholder="e.g. Seamstress" required={false} formData={finForm} errors={errors} updateFormData={setFi} />
            <InputField label={t("beneficiaries.salary")}    field="salary"    placeholder="e.g. 1500.00"    required={false} formData={finForm} errors={errors} updateFormData={setFi} />
          </div>
        </div>

        {/* ── Family Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title={t("beneficiaries.section_family")} subtitle={t("beneficiaries.section_family_sub")} />
          <ToggleInput label={t("beneficiaries.family_in_malaysia")} field="family_in_malaysia" formData={familyForm} errors={errors} updateFormData={setFa} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.spouse_name")}          field="spouse_name"        placeholder="Fatimah binti Ali" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label={t("beneficiaries.spouse_name_ar_label")} field="spouse_name_arabic" placeholder={t("beneficiaries.spouse_name_ar_placeholder")} required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("beneficiaries.spouse_job")}         field="spouse_job"         placeholder="Teacher"      required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
            <InputField label={t("beneficiaries.number_of_children")} field="number_of_children" type="number" placeholder="0" required={false} formData={familyForm} errors={errors} updateFormData={setFa} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("beneficiaries.cancel")} onClick={() => navigate(`${base}/beneficiaries/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("beneficiaries.save_changes")}
            loading={saving}
            disabled={!userForm.full_name.trim() || !userForm.email.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
