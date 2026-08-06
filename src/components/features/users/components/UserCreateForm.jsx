import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack, MdPersonAdd, MdPerson, MdBusiness,
  MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { InputField, StorageImageField, validate } from "components/form";
import { getNestedValue } from "components/form/utils/getNestedValue";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import { useCreateUser } from "components/features/users/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name:    [{ required: true }, { maxLength: 255 }],
  email:        [{ required: true }, { email: true }],
  phone_number: [{ required: true }],
  profile_photo: [{ required: true }],
  department:   [{ required: true }],
  job_title:    [{ required: true }],
  branch:       [{ required: true }],
  joining_date: [{ required: true }],
  "banking_information.bank_name":           [{ required: true }],
  "banking_information.account_holder_name": [{ required: true }],
  "banking_information.account_number":      [{ required: true }],
  "financial_information.job_title":         [{ required: true }],
  "financial_information.salary":            [{ required: true }],
};

const EMPTY = {
  full_name: "", email: "", phone_number: "", role: "admin", profile_photo: null,
  department: "", job_title: "", branch: "", joining_date: "",
  banking_information:  { bank_name: "", account_number: "", account_holder_name: "" },
  financial_information: { job_title: "", salary: "", payment_frequency: "monthly" },
};

const setNestedError = (errs, field, err) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".");
    errs[parent] = { ...(errs[parent] || {}), [child]: err };
  } else {
    errs[field] = err;
  }
};

export default function UserCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
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

  const canSubmit = !Object.entries(RULES).some(
    ([field, rules]) => !!validate(getNestedValue(formData, field), rules)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(getNestedValue(formData, field), rules);
      if (err) setNestedError(newErrors, field, err);
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    const bi = formData.banking_information;
    const fi = formData.financial_information;

    const payload = {
      full_name:    formData.full_name,
      email:        formData.email,
      phone_number: formData.phone_number,
      role:         formData.role,
      department:   formData.department,
      job_title:    formData.job_title,
      branch:       formData.branch,
      joining_date: formData.joining_date,
      profile_photo: formData.profile_photo,
      banking_information: {
        bank_name:           bi.bank_name,
        account_number:      bi.account_number,
        account_holder_name: bi.account_holder_name,
      },
      financial_information: {
        job_title:         fi.job_title,
        salary:            fi.salary,
        payment_frequency: fi.payment_frequency,
      },
    };

    try {
      const created = await createUser(payload);
      success(t("users.toast_created"), `${formData.full_name} ${t("users.toast_created_sub")}`);
      navigate(`${base}/users/${created.id}`);
    } catch (err) {
      toastError(t("users.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title={t("users.add_admin_title")}
        subtitle={t("users.create_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("users.back_to_users")} onClick={() => navigate(`${base}/users`)} />
        }
      />

      <AlertBanner message={error} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        {/* ── Account Details ── */}
        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("users.account_details")} subtitle={t("users.account_details_sub_create")} />
          <AlertBanner variant="info" message={t("users.activation_info")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="users/photos"
            required
            onUpload={(key) => updateFormData("profile_photo", key)}
            onRemove={() => updateFormData("profile_photo", null)}
            errors={errors}
            field="profile_photo"
          />
          <InputField
            label={t("users.full_name")} field="full_name" placeholder="John Doe"
            formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.full_name}
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.email")} field="email" type="email" placeholder="john@example.com"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.email}
            />
            <InputField
              label={t("users.phone")} field="phone_number" type="tel" placeholder="+60 12-345 6789"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.phone_number}
            />
          </div>
        </div>

        {/* ── Employment Details ── */}
        <div className="border-b border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("users.employment_details")} subtitle={t("users.employment_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.department")} field="department" placeholder="e.g. Operations"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.department}
            />
            <InputField
              label={t("users.job_title")} field="job_title" placeholder="e.g. Project Manager"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.job_title}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.branch")} field="branch" placeholder="e.g. Kuala Lumpur"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.branch}
            />
            <InputField
              label={t("users.joining_date")} field="joining_date" type="date"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.joining_date}
            />
          </div>
        </div>

        {/* ── Banking Information ── */}
        <div className="border-b border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("users.banking_info")} subtitle={t("users.banking_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.bank_name")} field="banking_information.bank_name" placeholder="e.g. Maybank"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["banking_information.bank_name"]}
            />
            <InputField
              label={t("users.account_holder")} field="banking_information.account_holder_name" placeholder="As per bank records"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["banking_information.account_holder_name"]}
            />
          </div>
          <InputField
            label={t("users.account_number")} field="banking_information.account_number" placeholder="e.g. 1234567890"
            formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["banking_information.account_number"]}
          />
        </div>

        {/* ── Financial Information ── */}
        <div className="border-b border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("users.financial_info")} subtitle={t("users.financial_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.job_title")} field="financial_information.job_title" placeholder="e.g. Senior Officer"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["financial_information.job_title"]}
            />
            <InputField
              label={t("users.salary")} field="financial_information.salary" placeholder="e.g. 3500.00"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["financial_information.salary"]}
            />
          </div>
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("users.cancel")} onClick={() => navigate(`${base}/users`)} className="flex-1" />
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
