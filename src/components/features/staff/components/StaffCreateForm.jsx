import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdPersonAdd, MdBadge, MdPerson, MdMarkEmailRead } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, StorageImageField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateStaff } from "components/features/staff/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
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

  const canSubmit = form.full_name.trim() && form.email.trim();

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
        email:        form.email,
        phone_number: form.phone_number  || undefined,
        department:   form.department    || undefined,
        position:     form.position      || undefined,
        branch:       form.branch        || undefined,
        joining_date: form.joining_date  || undefined,
        profile_photo: form.profile_photo || undefined,
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
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title={t("staff.add_title")}
        subtitle={t("staff.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("staff.back_to_member")} onClick={() => navigate(`${base}/staff`)} />
        }
      />

      <div className="flex items-start gap-3 rounded-xl border border-green/20 bg-green/5 px-4 py-3">
        <MdMarkEmailRead className="mt-0.5 h-4 w-4 shrink-0 text-green" />
        <p className="text-sm text-green/80">{t("staff.email_notice")}</p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("staff.section_account")} subtitle={t("staff.section_account_sub")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="staff/photos"
            onUpload={(key) => set("profile_photo", key)}
            onRemove={() => set("profile_photo", null)}
            errors={errors}
            field="profile_photo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.full_name_label")} field="full_name" placeholder="Fatima Ali" formData={form} errors={errors} updateFormData={set} rules={RULES.full_name} />
            <InputField label={t("staff.full_name_ar_label")} field="full_name_ar" placeholder="فاطمة علي" required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.email_label")} field="email" type="email" placeholder="fatima@pfm.org.my" formData={form} errors={errors} updateFormData={set} rules={RULES.email} />
            <InputField label={t("users.phone_label")} field="phone_number" placeholder="+60 19-876 5432" required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
        </div>

        {/* ── Employment details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("staff.section_employment")} subtitle={t("staff.section_employment_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_department")} field="department" placeholder="Programs"          required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label={t("staff.info_position")}   field="position"   placeholder="Program Manager"   required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_branch")}       field="branch"       placeholder="Kuala Lumpur HQ" required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label={t("staff.info_joining_date")} field="joining_date" type="date"                   required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
        </div>

        <div className="flex gap-3">
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
