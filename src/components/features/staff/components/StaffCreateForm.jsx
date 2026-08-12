import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdPersonAdd, MdBadge, MdPerson, MdCardTravel } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, StorageImageField, StorageDocumentField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateStaff } from "components/features/staff/hooks";
import { useGetBranches } from "components/features/branches/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name:    [{ required: true }, { maxLength: 255 }],
  email:        [{ required: true }, { email: true }],
  phone_number: [{ required: true }],
  profile_photo: [{ required: true }],
  department:   [{ required: true }],
  position:     [{ required: true }],
  branch:       [{ required: true }],
  joining_date: [{ required: true }],
};

export default function StaffCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: createStaff, loading, error } = useCreateStaff();
  const { branches } = useGetBranches();
  const { success, error: toastError } = useToast();

  const activeBranches = branches.filter((b) => b.is_active);
  const branchOptions  = activeBranches.map((b) => ({ value: b.name, label: b.name }));
  const showBranchPicker = activeBranches.length !== 1;

  const [form, setForm] = useState({
    full_name:    "",
    email:        "",
    phone_number: "",
    department:   "",
    position:     "",
    branch:       "",
    joining_date: "",
    profile_photo: null,
    id_document:  null,
    id_document_type: "",
    has_visa:      false,
    visa_type:     "",
    visa_number:   "",
    visa_expiry_date: "",
    visa_document: null,
  });
  const [errors, setErrors] = useState({});

  const ID_DOCUMENT_TYPE_OPTIONS = [
    { value: "passport",    label: t("staff.id_doc_type_passport") },
    { value: "national_id", label: t("staff.id_doc_type_national_id") },
    { value: "other",       label: t("staff.id_doc_type_other") },
  ];
  const VISA_TYPE_OPTIONS = [
    { value: "employment_pass",         label: t("staff.visa_type_employment_pass") },
    { value: "professional_visit_pass", label: t("staff.visa_type_professional_visit_pass") },
    { value: "dependent_pass",          label: t("staff.visa_type_dependent_pass") },
    { value: "other",                   label: t("staff.visa_type_other") },
  ];

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    if (activeBranches.length === 1) set("branch", activeBranches[0].name);
  }, [activeBranches.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const visaTypeMissing = form.has_visa && !form.visa_type;
  const canSubmit = !Object.entries(RULES).some(([field, rules]) => !!validate(form[field], rules)) && !visaTypeMissing;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (visaTypeMissing) newErrors.visa_type = t("validation.required");
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        full_name:    form.full_name,
        email:        form.email,
        phone_number: form.phone_number,
        department:   form.department,
        position:     form.position,
        branch:       form.branch,
        joining_date: form.joining_date,
        profile_photo: form.profile_photo,
        id_document:  form.id_document || undefined,
        id_document_type: form.id_document_type || undefined,
        has_visa:     form.has_visa,
        visa_type:        form.has_visa ? form.visa_type : undefined,
        visa_number:      form.has_visa ? (form.visa_number || undefined) : undefined,
        visa_expiry_date: form.has_visa ? (form.visa_expiry_date || undefined) : undefined,
        visa_document:    form.has_visa ? (form.visa_document || undefined) : undefined,
      };
      const created = await createStaff(payload);
      success(
        t("staff.toast_created"),
        `${form.full_name} ${t("staff.toast_created_sub")} ${form.email}.`,
      );
      navigate(`${base}/staff/${created.id}`);
    } catch (err) {
      toastError(t("staff.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title={t("staff.add_title")}
        subtitle={t("staff.add_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("staff.back_to_member")} onClick={() => navigate(`${base}/staff`)} />
        }
      />

      <AlertBanner message={error} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        {/* ── Account details ── */}
        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("staff.section_account")} subtitle={t("staff.section_account_sub")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="staff/photos"
            required
            onUpload={(key) => set("profile_photo", key)}
            onRemove={() => set("profile_photo", null)}
            errors={errors}
            field="profile_photo"
          />
          <InputField label={t("users.full_name")} field="full_name" placeholder="Fatima Ali" formData={form} errors={errors} updateFormData={set} rules={RULES.full_name} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.email")} field="email" type="email" placeholder="fatima@pfm.org.my" formData={form} errors={errors} updateFormData={set} rules={RULES.email} />
            <InputField label={t("users.phone")} field="phone_number" placeholder="+60 19-876 5432" formData={form} errors={errors} updateFormData={set} rules={RULES.phone_number} />
          </div>
        </div>

        {/* ── Employment details ── */}
        <div className="border-b border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("staff.section_employment")} subtitle={t("staff.section_employment_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_department")} field="department" placeholder="Programs"        formData={form} errors={errors} updateFormData={set} rules={RULES.department} />
            <InputField label={t("staff.info_position")}   field="position"   placeholder="Program Manager" formData={form} errors={errors} updateFormData={set} rules={RULES.position} />
          </div>
          <div className={showBranchPicker ? "grid grid-cols-1 gap-x-5 sm:grid-cols-2" : ""}>
            {showBranchPicker && (
              <SelectField label={t("staff.info_branch")} field="branch" options={branchOptions} formData={form} errors={errors} updateFormData={set} rules={RULES.branch} />
            )}
            <InputField label={t("staff.info_joining")} field="joining_date" type="date"                   formData={form} errors={errors} updateFormData={set} rules={RULES.joining_date} />
          </div>
        </div>

        {/* ── Documents & Visa ── */}
        <div className="border-b border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("staff.section_visa")} subtitle={t("staff.section_visa_sub")} />
          <StorageDocumentField
            label={t("staff.id_document")}
            folder="staff/documents"
            accept=".pdf,.jpg,.jpeg,.png"
            required={false}
            onUpload={(key) => set("id_document", key)}
            onRemove={() => set("id_document", null)}
            errors={errors}
            field="id_document"
          />
          <SelectField label={t("staff.id_doc_type_label")} field="id_document_type" options={ID_DOCUMENT_TYPE_OPTIONS}
            required={false} formData={form} errors={errors} updateFormData={set} />
          <ToggleInput label={t("staff.has_visa")} field="has_visa" formData={form} errors={errors} updateFormData={set} />
          {form.has_visa && (
            <>
              <SelectField label={t("staff.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS}
                formData={form} errors={errors} updateFormData={set} rules={[{ required: true }]} />
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <InputField label={t("staff.visa_number")} field="visa_number" placeholder="e.g. EP-1234567"
                  required={false} formData={form} errors={errors} updateFormData={set} />
                <InputField label={t("staff.visa_expiry_date")} field="visa_expiry_date" type="date"
                  required={false} formData={form} errors={errors} updateFormData={set} />
              </div>
              <StorageDocumentField
                label={t("staff.visa_document_label")}
                folder="staff/documents"
                accept=".pdf,.jpg,.jpeg,.png"
                required={false}
                onUpload={(key) => set("visa_document", key)}
                onRemove={() => set("visa_document", null)}
              />
            </>
          )}
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("staff.cancel")} onClick={() => navigate(`${base}/staff`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("staff.create_btn")}
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
