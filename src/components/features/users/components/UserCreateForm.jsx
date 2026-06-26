import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPersonAdd, MdPerson, MdSecurity } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateUser } from "components/features/users/hooks";
import { ROLE_OPTIONS } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255, message: "Name must be 255 characters or fewer" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
  role:      [{ required: true, message: "Role is required" }],
};

export default function UserCreateForm() {
  const navigate = useNavigate();
  const { execute: createUser, loading, error } = useCreateUser();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    full_name: "", email: "", phone_number: "",
    role: "", is_active: true,
    is_2fa_enabled: false, is_2fa_verified: false,
  });
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const canSubmit = formData.full_name.trim() && formData.email.trim() && formData.role;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const created = await createUser(formData);
      success("User created", `${formData.full_name} has been added successfully.`);
      navigate(`/admin/users/${created.id}`);
    } catch (err) {
      toastError("Failed to create user", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="Add User"
        subtitle="Create a new portal account"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Users" onClick={() => navigate("/admin/users")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* ── Account Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Login credentials and role assignment" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Full Name"
              field="full_name"
              placeholder="John Doe"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              rules={RULES.full_name}
            />
            <InputField
              label="Email Address"
              field="email"
              type="email"
              placeholder="john@example.com"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              rules={RULES.email}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Phone Number"
              field="phone_number"
              type="tel"
              placeholder="+60 12-345 6789"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
            <SelectField
              label="Role"
              field="role"
              options={ROLE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              rules={RULES.role}
            />
          </div>
          <ToggleInput label="Account Active" field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        {/* ── Security ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdSecurity className="h-5 w-5" />} title="Two-Factor Authentication" subtitle="Configure 2FA settings for this account" />
          <ToggleInput label="2FA Enabled"   field="is_2fa_enabled"  formData={formData} errors={errors} updateFormData={updateFormData} />
          <ToggleInput label="2FA Verified"  field="is_2fa_verified" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/users")} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Create User"
            icon={<MdPersonAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!canSubmit}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
