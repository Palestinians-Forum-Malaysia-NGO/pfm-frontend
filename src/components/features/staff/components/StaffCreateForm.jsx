import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPersonAdd, MdBadge, MdPerson, MdMarkEmailRead } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateStaff } from "components/features/staff/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [
    { required: true, message: "Full name is required" },
    { maxLength: 255, message: "Name must be 255 characters or fewer" },
  ],
  email: [
    { required: true, message: "Email is required" },
    { email: true },
  ],
};

export default function StaffCreateForm() {
  const navigate = useNavigate();
  const { execute: createStaff, loading, error } = useCreateStaff();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    full_name:    "",
    email:        "",
    phone_number: "",
    department:   "",
    position:     "",
    branch:       "",
    joining_date: "",
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
      };
      const created = await createStaff(payload);
      success(
        "Staff member added",
        `${form.full_name} has been created. An activation email has been sent to ${form.email}.`,
      );
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
        subtitle="Create a new staff account — an activation email will be sent automatically"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Staff" onClick={() => navigate("/admin/staff")} />
        }
      />

      {/* Activation notice */}
      <div className="flex items-start gap-3 rounded-xl border border-green/20 bg-green/5 px-4 py-3">
        <MdMarkEmailRead className="mt-0.5 h-4 w-4 shrink-0 text-green" />
        <p className="text-sm text-green/80">
          When you create a staff member, the system automatically sends an activation email with a one-time code. The staff member uses it to set their own password.
        </p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Personal details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Basic information for the staff member" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Full Name"     field="full_name"    placeholder="Fatima Ali"           formData={form} errors={errors} updateFormData={set} rules={RULES.full_name} />
            <InputField label="Email Address" field="email"        type="email" placeholder="fatima@pfm.org.my" formData={form} errors={errors} updateFormData={set} rules={RULES.email} />
          </div>
          <InputField label="Phone Number" field="phone_number" placeholder="+60 19-876 5432" required={false} formData={form} errors={errors} updateFormData={set} />
        </div>

        {/* ── Employment details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Employment Details" subtitle="Organisational role and assignment" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Department"  field="department"   placeholder="Programs"           required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label="Position"    field="position"     placeholder="Program Manager"     required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Branch"       field="branch"       placeholder="Kuala Lumpur HQ"    required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label="Joining Date" field="joining_date" type="date"                      required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/staff")} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Staff Member"
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
