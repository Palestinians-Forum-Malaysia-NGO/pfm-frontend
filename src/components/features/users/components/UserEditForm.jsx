import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdVerified, MdEdit, MdPerson,
  MdBusiness, MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading     from "components/loading/Loading";
import { useGetUser, useUpdateUser } from "components/features/users/hooks";
import {
  ROLE_VALUES, ROLE_LABELS,
  ROLE_BADGE_BORDER as ROLE_BADGE,
  ROLE_AVATAR_GRADIENT as AVATAR_BG,
} from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const PAYMENT_FREQUENCY_OPTIONS = [
  { value: "monthly",   label: "Monthly" },
  { value: "weekly",    label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "annually",  label: "Annually" },
];

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255, message: "Name must be 255 characters or fewer" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

const EMPTY = {
  full_name: "", email: "", phone_number: "",
  role: ROLE_VALUES.ADMIN, is_active: true,
  department: "", job_title: "", branch: "", joining_date: "",
  banking_information:  { bank_name: "", account_number: "", account_holder_name: "" },
  financial_information: { job_title: "", salary: "", payment_frequency: "" },
};

export default function UserEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { execute: fetchUser, loading, error: loadError } = useGetUser();
  const { execute: updateUser, loading: saving, error: saveError } = useUpdateUser();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((p) => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    } else {
      setFormData((p) => ({ ...p, [field]: value }));
    }
  };

  const isDirty = !initial || (
    formData.full_name    !== initial.full_name    ||
    formData.email        !== initial.email        ||
    formData.phone_number !== initial.phone_number ||
    formData.is_active    !== initial.is_active    ||
    formData.department   !== initial.department   ||
    formData.job_title    !== initial.job_title    ||
    formData.branch       !== initial.branch       ||
    formData.joining_date !== initial.joining_date ||
    formData.banking_information.bank_name           !== initial.banking_information.bank_name           ||
    formData.banking_information.account_number      !== initial.banking_information.account_number      ||
    formData.banking_information.account_holder_name !== initial.banking_information.account_holder_name ||
    formData.financial_information.job_title         !== initial.financial_information.job_title         ||
    formData.financial_information.salary            !== initial.financial_information.salary            ||
    formData.financial_information.payment_frequency !== initial.financial_information.payment_frequency
  );

  useEffect(() => {
    fetchUser(id).then((data) => {
      if (!data) return;
      const snapshot = {
        full_name:    data.full_name    ?? "",
        email:        data.email        ?? "",
        phone_number: data.phone_number ?? "",
        role:         ROLE_VALUES.ADMIN,
        is_active:    data.is_active    ?? true,
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
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const bi = formData.banking_information;
    const fi = formData.financial_information;

    const payload = {
      full_name:    formData.full_name,
      email:        formData.email,
      phone_number: formData.phone_number  || undefined,
      role:         formData.role,
      is_active:    formData.is_active,
      department:   formData.department    || undefined,
      job_title:    formData.job_title     || undefined,
      branch:       formData.branch        || undefined,
      joining_date: formData.joining_date  || undefined,
      banking_information: {
        bank_name:           bi.bank_name           || undefined,
        account_number:      bi.account_number      || undefined,
        account_holder_name: bi.account_holder_name || undefined,
      },
      financial_information: {
        job_title:         fi.job_title         || undefined,
        salary:            fi.salary            || undefined,
        payment_frequency: fi.payment_frequency || undefined,
      },
    };

    try {
      await updateUser(id, payload);
      success("User updated", `${formData.full_name} has been updated successfully.`);
      navigate(`/admin/users/${id}`);
    } catch (err) {
      toastError("Failed to update user", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading user..." />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Admin"
        subtitle={formData.full_name || "Update admin account details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to User" onClick={() => navigate(`/admin/users/${id}`)} />
        }
      />

      {/* ── Live preview card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[formData.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {getInitials(formData.full_name) || "?"}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[formData.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[formData.role] ?? formData.role}
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
              {formData.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Login credentials for this admin account" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Full Name" field="full_name" placeholder="John Doe"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.full_name}
            />
            <InputField
              label="Email Address" field="email" type="email" placeholder="john@example.com"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.email}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Phone Number" field="phone_number" type="tel" placeholder="+60 12-345 6789"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <ToggleInput label="Account Active" field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
          </div>
        </div>

        {/* ── Employment Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title="Employment Details" subtitle="Department, branch, and position info (optional)" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Department" field="department" placeholder="e.g. Operations"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label="Job Title" field="job_title" placeholder="e.g. Project Manager"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Branch" field="branch" placeholder="e.g. Kuala Lumpur"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label="Joining Date" field="joining_date" type="date"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
        </div>

        {/* ── Banking Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title="Banking Information" subtitle="Bank account details for payments (optional)" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Bank Name" field="banking_information.bank_name" placeholder="e.g. Maybank"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label="Account Holder Name" field="banking_information.account_holder_name" placeholder="As per bank records"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <InputField
            label="Account Number" field="banking_information.account_number" placeholder="e.g. 1234567890"
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
        </div>

        {/* ── Financial Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title="Financial Information" subtitle="Salary and payment details (optional)" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Job Title" field="financial_information.job_title" placeholder="e.g. Senior Officer"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
            <InputField
              label="Salary" field="financial_information.salary" placeholder="e.g. 3500.00"
              required={false}
              formData={formData} errors={errors} updateFormData={updateFormData}
            />
          </div>
          <SelectField
            label="Payment Frequency" field="financial_information.payment_frequency"
            options={PAYMENT_FREQUENCY_OPTIONS}
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`/admin/users/${id}`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text="Save Changes"
            loading={saving}
            disabled={!formData.full_name.trim() || !formData.email.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
