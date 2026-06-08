import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPersonAdd, MdBadge } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, PasswordField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateStaff } from "components/features/staff/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const USER_RULES = {
  full_name: [{ required: true, message: "Full name is required" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
  password:  [{ required: true, message: "Password is required" }, { minLength: 8, message: "At least 8 characters" }],
};

const STAFF_RULES = {
  employee_id: [{ required: true, message: "Employee ID is required" }],
};

export default function StaffCreate() {
  const navigate = useNavigate();
  const { execute: createStaff, loading, error } = useCreateStaff();
  const { success, error: toastError } = useToast();

  const [userForm, setUserForm] = useState({
    full_name: "", email: "", password: "", phone_number: "", is_active: true,
  });
  const [staffForm, setStaffForm] = useState({
    employee_id: "", department: "", position: "", branch: "", joining_date: "",
  });
  const [errors, setErrors] = useState({});

  const setU = (field, value) => setUserForm((p) => ({ ...p, [field]: value }));
  const setS = (field, value) => setStaffForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.entries(USER_RULES).forEach(([field, rules]) => {
      const err = validate(userForm[field], rules);
      if (err) newErrors[field] = err;
    });
    Object.entries(STAFF_RULES).forEach(([field, rules]) => {
      const err = validate(staffForm[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        user: {
          full_name:    userForm.full_name,
          email:        userForm.email,
          password:     userForm.password,
          phone_number: userForm.phone_number || undefined,
          role:         "staff",
          is_active:    userForm.is_active,
        },
        employee_id:  staffForm.employee_id,
        department:   staffForm.department   || undefined,
        position:     staffForm.position     || undefined,
        branch:       staffForm.branch       || undefined,
        joining_date: staffForm.joining_date || undefined,
      };

      const created = await createStaff(payload);
      success("Staff created", `${userForm.full_name} has been added successfully.`);
      navigate(`/admin/staff/${created.id}`);
    } catch (err) {
      toastError("Failed to create staff", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="Add Staff Member"
        subtitle="Create a new staff account and profile"
        actions={
          <Button
            variant="ghost"
            icon={<MdArrowBack className="h-4 w-4" />}
            text="Back to Staff"
            onClick={() => navigate("/admin/staff")}
          />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── User Account ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader
            title="User Account"
            subtitle="Login credentials for this staff member"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Full Name"
              field="full_name"
              placeholder="Ahmad Farid"
              formData={userForm} errors={errors} updateFormData={setU}
              rules={USER_RULES.full_name}
            />
            <InputField
              label="Email Address"
              field="email"
              type="email"
              placeholder="ahmad@example.com"
              formData={userForm} errors={errors} updateFormData={setU}
              rules={USER_RULES.email}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <PasswordField
              label="Password"
              field="password"
              placeholder="Min. 8 characters"
              formData={userForm} errors={errors} updateFormData={setU}
              rules={USER_RULES.password}
            />
            <InputField
              label="Phone Number"
              field="phone_number"
              placeholder="+60 12-345 6789"
              formData={userForm} errors={errors} updateFormData={setU}
            />
          </div>
          <ToggleInput label="Account Active" field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
        </div>

        {/* ── Staff Profile ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader
            icon={<MdBadge className="h-5 w-5" />}
            title="Staff Profile"
            subtitle="Employment and organisational details"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Employee ID"
              field="employee_id"
              placeholder="EMP001"
              formData={staffForm} errors={errors} updateFormData={setS}
              rules={STAFF_RULES.employee_id}
            />
            <InputField
              label="Department"
              field="department"
              placeholder="Finance"
              formData={staffForm} errors={errors} updateFormData={setS}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Position"
              field="position"
              placeholder="Accountant"
              formData={staffForm} errors={errors} updateFormData={setS}
            />
            <InputField
              label="Branch"
              field="branch"
              placeholder="Kuala Lumpur"
              formData={staffForm} errors={errors} updateFormData={setS}
            />
          </div>
          <InputField
            label="Joining Date"
            field="joining_date"
            type="date"
            formData={staffForm} errors={errors} updateFormData={setS}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost"   text="Cancel"       onClick={() => navigate("/admin/staff")} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Staff Member"
            icon={<MdPersonAdd className="h-4 w-4" />}
            loading={loading}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
