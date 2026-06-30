import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const PAYMENT_FREQUENCY_OPTIONS = [
  { value: "monthly",   label: "Monthly" },
  { value: "weekly",    label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "annually",  label: "Annually" },
];

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255, message: "Name must be 255 characters or fewer" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

const EMPTY = {
  full_name: "", email: "", phone_number: "", role: "admin",
  department: "", job_title: "", branch: "", joining_date: "",
  banking_information:  { bank_name: "", account_number: "", account_holder_name: "" },
  financial_information: { job_title: "", salary: "", payment_frequency: "" },
};

export default function UserCreateForm() {
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
      success("User created", `${formData.full_name} has been added. An activation email will be sent.`);
      navigate(`/admin/users/${created.id}`);
    } catch (err) {
      toastError("Failed to create user", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="Add Admin"
        subtitle="Create a new admin account"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Users" onClick={() => navigate("/admin/users")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Login credentials for the new admin account" />
          <AlertBanner variant="info" message="After the account is created, an activation email with a one-time password (OTP) will be sent to the user's email address." />
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
          <InputField
            label="Phone Number" field="phone_number" type="tel" placeholder="+60 12-345 6789"
            required={false}
            formData={formData} errors={errors} updateFormData={updateFormData}
          />
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
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/users")} className="flex-1" />
          <Button
            type="submit" variant="primary" text="Create User"
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
