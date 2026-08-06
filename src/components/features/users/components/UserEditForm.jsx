import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack, MdVerified, MdEdit, MdPerson,
  MdBusiness, MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader  from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, StorageImageField, validate } from "components/form";
import { getNestedValue } from "components/form/utils/getNestedValue";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading     from "components/loading/Loading";
import { useGetUser, useUpdateUser } from "components/features/users/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import {
  ROLE_BADGE_BORDER as ROLE_BADGE,
  ROLE_AVATAR_GRADIENT as AVATAR_BG,
} from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

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
  "financial_information.payment_frequency": [{ required: true }],
};

const EMPTY = {
  full_name: "", email: "", phone_number: "",
  role: "admin", is_active: true, profile_photo: null,
  department: "", job_title: "", branch: "", joining_date: "",
  banking_information:  { bank_name: "", account_number: "", account_holder_name: "" },
  financial_information: { job_title: "", salary: "", payment_frequency: "" },
};

const setNestedError = (errs, field, err) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".");
    errs[parent] = { ...(errs[parent] || {}), [child]: err };
  } else {
    errs[field] = err;
  }
};

export default function UserEditForm() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: fetchUser, loading, error: loadError } = useGetUser();
  const { execute: updateUser, loading: saving, error: saveError } = useUpdateUser();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});
  const [photoKey, setPhotoKey] = useState(null);
  const { url: currentPhotoUrl } = useStorageUrl(photoKey);

  const PAYMENT_FREQUENCY_OPTIONS = [
    { value: "monthly",   label: t("users.freq_monthly") },
    { value: "weekly",    label: t("users.freq_weekly") },
    { value: "bi-weekly", label: t("users.freq_biweekly") },
    { value: "annually",  label: t("users.freq_annually") },
  ];

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((p) => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    } else {
      setFormData((p) => ({ ...p, [field]: value }));
    }
  };

  const isDirty = !initial || JSON.stringify(formData) !== JSON.stringify(initial);

  const hasErrors = Object.entries(RULES).some(
    ([field, rules]) => !!validate(getNestedValue(formData, field), rules)
  );

  useEffect(() => {
    fetchUser(id).then((data) => {
      if (!data) return;
      const snapshot = {
        full_name:    data.full_name    ?? "",
        email:        data.email        ?? "",
        phone_number: data.phone_number ?? "",
        role:         data.role         ?? "admin",
        is_active:    data.is_active    ?? true,
        profile_photo: data.profile_photo ?? null,
        department:   data.department   ?? "",
        job_title:    data.job_title    ?? "",
        branch:       data.branch       ?? "",
        joining_date: data.joining_date ?? "",
        banking_information: {
          bank_name:           data.banking_information?.bank_name           ?? "",
          account_number:      data.banking_information?.account_number      ?? "",
          account_holder_name: data.banking_information?.account_holder_name ?? "",
        },
        financial_information: {
          job_title:         data.financial_information?.job_title         ?? "",
          salary:            data.financial_information?.salary            ?? "",
          payment_frequency: data.financial_information?.payment_frequency ?? "",
        },
      };
      setFormData(snapshot);
      setInitial(snapshot);
      setPhotoKey(data.profile_photo ?? null);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(getNestedValue(formData, field), rules);
      if (err) setNestedError(newErrors, field, err);
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const bi = formData.banking_information;
    const fi = formData.financial_information;

    const payload = {
      full_name:    formData.full_name,
      email:        formData.email,
      phone_number: formData.phone_number,
      role:         formData.role,
      is_active:    formData.is_active,
      profile_photo: formData.profile_photo,
      department:   formData.department,
      job_title:    formData.job_title,
      branch:       formData.branch,
      joining_date: formData.joining_date,
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
      await updateUser(id, payload);
      success(t("users.toast_updated"), `${formData.full_name} ${t("users.toast_updated_sub")}`);
      navigate(`${base}/users/${id}`);
    } catch (err) {
      toastError(t("users.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("users.loading_user")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("users.edit_admin_title")}
        subtitle={formData.full_name || t("users.user_details")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("users.back_to_user")} onClick={() => navigate(`${base}/users/${id}`)} />
        }
      />

      {/* ── Live preview card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[formData.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {currentPhotoUrl ? (
                <img src={currentPhotoUrl} alt={formData.full_name} className="h-full w-full object-cover" />
              ) : (
                getInitials(formData.full_name) || "?"
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[formData.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {t(`users.role_${formData.role}`, { defaultValue: formData.role })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {formData.full_name || <span className="text-slate-300">Full Name</span>}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">{formData.email || "email@example.com"}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              formData.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${formData.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {formData.is_active ? t("users.status_active") : t("users.status_inactive")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
        <AlertBanner message={saveError} className="p-6 border-b border-slate-200" />

        <form onSubmit={handleSubmit} noValidate className="flex flex-col">

          {/* ── Account Details ── */}
          <div className="bg-white p-6 border-b border-slate-200">
            <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("users.account_details")} subtitle={t("users.account_details_sub_edit")} />
            <StorageImageField
              label={t("common.profile_photo")}
              folder="users/photos"
              required
              currentUrl={currentPhotoUrl}
              onUpload={(key) => { updateFormData("profile_photo", key); setPhotoKey(null); }}
              onRemove={() => { updateFormData("profile_photo", null); setPhotoKey(null); }}
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
            <ToggleInput label={t("users.account_active")} field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
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
            <SelectField
              label={t("users.payment_frequency")} field="financial_information.payment_frequency"
              options={PAYMENT_FREQUENCY_OPTIONS}
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES["financial_information.payment_frequency"]}
            />
          </div>

          <div className="flex gap-3 p-6">
            <Button variant="ghost" text={t("users.cancel")} onClick={() => navigate(`${base}/users/${id}`)} className="flex-1" />
            <Button
              type="submit" variant="primary" text={t("users.save_changes")}
              loading={saving}
              disabled={hasErrors || !isDirty || saving}
              className="flex-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
