import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPersonAdd } from "react-icons/md";
import {
  InputField, PasswordField, SelectField, ToggleInput, validate,
} from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateUser } from "components/features/users/hooks";

const ROLE_OPTIONS = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
  password:  [{ required: true, message: "Password is required" }, { minLength: 8, message: "At least 8 characters" }],
  role:      [{ required: true, message: "Role is required" }],
};

export default function UserCreate() {
  const navigate = useNavigate();
  const { execute: createUser, loading, error } = useCreateUser();

  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "", role: "", is_active: true,
  });
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

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
      navigate(`/admin/users/${created.id}`);
    } catch {
      // error shown via useCreateUser
    }
  };

  return (
    <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-6">

      <FormHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="New User"
        subtitle="Add a new portal account"
        actions={
          <Button
            variant="ghost"
            icon={<MdArrowBack className="h-4 w-4" />}
            text="Back to Users"
            onClick={() => navigate("/admin/users")}
          />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate>
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
          <PasswordField
            label="Password"
            field="password"
            placeholder="Min. 8 characters"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            rules={RULES.password}
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

        <ToggleInput
          label="Account Status"
          field="is_active"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />

        <div className="mt-4 flex gap-3">
          <Button
            variant="ghost"
            text="Cancel"
            onClick={() => navigate("/admin/users")}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            text="Create User"
            icon={<MdPersonAdd className="h-4 w-4" />}
            loading={loading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
