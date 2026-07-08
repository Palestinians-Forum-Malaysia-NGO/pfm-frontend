import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdPersonAdd, MdBadge, MdPerson } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, StorageImageField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateStaff } from "components/features/staff/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name:    [{ required: true }, { maxLength: 255 }],
  full_name_ar: [{ required: true }, { maxLength: 255 }],
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
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    full_name:    "",
    full_name_ar: "",
    email:        "",
    phone_number: "",
    department:   "",
    position:     "",
    branch:       "",
    joining_date: "",
    profile_photo: null,
  });
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const canSubmit = !Object.entries(RULES).some(([field, rules]) => !!validate(form[field], rules));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        full_name:    form.full_name,
        full_name_ar: form.full_name_ar,
        email:        form.email,
        phone_number: form.phone_number,
        department:   form.department,
        position:     form.position,
        branch:       form.branch,
        joining_date: form.joining_date,
        profile_photo: form.profile_photo,
      };
      const created = await createStaff(payload);
      success(
        t("staff.toast_created"),
        `${form.full_name} ${t("staff.toast_created_sub")} ${form.email}.`,
      );
      navigate(`${base}/staff/${created.id}`);
    } catch {
      toastError(t("staff.toast_create_failed"));
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
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.full_name")} field="full_name" placeholder="Fatima Ali" formData={form} errors={errors} updateFormData={set} rules={RULES.full_name} />
            <InputField label={t("staff.full_name_ar_label")} field="full_name_ar" placeholder="فاطمة علي" formData={form} errors={errors} updateFormData={set} rules={RULES.full_name_ar} />
          </div>
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
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_branch")}       field="branch"       placeholder="Kuala Lumpur HQ" formData={form} errors={errors} updateFormData={set} rules={RULES.branch} />
            <InputField label={t("staff.info_joining")} field="joining_date" type="date"                   formData={form} errors={errors} updateFormData={set} rules={RULES.joining_date} />
          </div>
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
