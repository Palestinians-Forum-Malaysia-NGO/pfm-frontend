import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack, MdPersonAdd, MdPerson, MdBusiness,
  MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import PageHeader   from "components/ui/PageHeader";
import { InputField, SelectField, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import { useCreateUser } from "components/features/users/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
};

const EMPTY = {
  full_name: "", email: "", phone_number: "", role: "admin",
  department: "", job_title: "", branch: "", joining_date: "",
  banking_information:  { bank_name: "", account_number: "", account_holder_name: "" },
  financial_information: { job_title: "", salary: "", payment_frequency: "" },
};

export default function UserCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { execute: createUser, loading, error } = useCreateUser();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((p) => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    } else {
      setFormData((p) => ({ ...p, [field]: value }));
    }
  };

  const PAYMENT_FREQUENCY_OPTIONS = [
    { value: "monthly",   label: t("users.freq_monthly") },
    { value: "weekly",    label: t("users.freq_weekly") },
    { value: "bi-weekly", label: t("users.freq_biweekly") },
    { value: "annually",  label: t("users.freq_annually") },
  ];

  const canSubmit = formData.full_name.trim() && formData.email.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const bi = formData.banking_information;
    const fi = formData.financial_information;

    const payload = {
      full_name:    formData.full_name,
      email:        formData.email,
      phone_number: formData.phone_number  || undefined,
      role:         formData.role,
      department:   formData.department    || undefined,
      job_title:    formData.job_title     || undefined,
      branch:       formData.branch        || undefined,
      joining_date: formData.joining_date  || undefined,
      banking_information: (bi.bank_name || bi.account_number || bi.account_holder_name)
        ? {
            bank_name:           bi.bank_name           || undefined,
            account_number:      bi.account_number      || undefined,
            account_holder_name: bi.account_holder_name || undefined,
          }
        : undefined,
      financial_information: (fi.job_title || fi.salary || fi.payment_frequency)
        ? {
            job_title:         fi.job_title         || undefined,
            salary:            fi.salary            || undefined,
            payment_frequency: fi.payment_frequency || undefined,
          }
        : undefined,
    };

    try {
      const created = await createUser(payload);
      success(t("users.toast_created"), `${formData.full_name} ${t("users.toast_created_sub")}`);
      navigate(`/admin/users/${created.id}`);
    } catch (err) {
      toastError(t("users.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title={t("users.add_admin_title")}
        subtitle={t("users.create_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("users.back_to_users")} onClick={() => navigate("/admin/users")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("users.account_details")} subtitle={t("users.account_details_sub_create")} />
          <AlertBanner variant="info" message={t("users.activation_info")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.full_name")} field="full_name" placeholder="John Doe"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.full_name}
            />
            <InputField
              label={t("users.email")} field="email" type="email" placeholder="john@example.com"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.email}
            />
          </div>
          <InputField
            label={t("users.phone")} field="phone_number" type="tel" placeholder="+60 12-345 6789"
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
        </div>

        {/* ── Employment Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("users.employment_details")} subtitle={t("users.employment_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.department")} field="department" placeholder="e.g. Operations"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label={t("users.job_title")} field="job_title" placeholder="e.g. Project Manager"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.branch")} field="branch" placeholder="e.g. Kuala Lumpur"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label={t("users.joining_date")} field="joining_date" type="date"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
        </div>

        {/* ── Banking Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("users.banking_info")} subtitle={t("users.banking_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.bank_name")} field="banking_information.bank_name" placeholder="e.g. Maybank"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label={t("users.account_holder")} field="banking_information.account_holder_name" placeholder="As per bank records"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <InputField
            label={t("users.account_number")} field="banking_information.account_number" placeholder="e.g. 1234567890"
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
        </div>

        {/* ── Financial Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("users.financial_info")} subtitle={t("users.financial_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.job_title")} field="financial_information.job_title" placeholder="e.g. Senior Officer"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label={t("users.salary")} field="financial_information.salary" placeholder="e.g. 3500.00"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <SelectField
            label={t("users.payment_frequency")} field="financial_information.payment_frequency"
            options={PAYMENT_FREQUENCY_OPTIONS}
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("users.cancel")} onClick={() => navigate("/admin/users")} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("users.create_user")}
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
