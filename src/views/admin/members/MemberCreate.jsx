import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdPersonAdd } from "react-icons/md";
import { memberService } from "components/features/members/services/memberService";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";

const TYPE_OPTIONS = [
  { value: "regular",  label: "Regular" },
  { value: "student",  label: "Student" },
  { value: "honorary", label: "Honorary" },
  { value: "lifetime", label: "Lifetime" },
];

const NATIONALITY_OPTIONS = [
  { value: "Malaysian",    label: "Malaysian" },
  { value: "Palestinian",  label: "Palestinian" },
  { value: "Other",        label: "Other" },
];

const RULES = {
  name:            [{ required: true, message: "Full name is required" }],
  email:           [{ required: true, message: "Email is required" }, { email: true }],
  phone:           [{ required: true, message: "Phone number is required" }],
  ic_number:       [{ required: true, message: "IC / Passport number is required" }],
  membership_type: [{ required: true, message: "Membership type is required" }],
  nationality:     [{ required: true, message: "Nationality is required" }],
};

export default function MemberCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", ic_number: "",
    membership_type: "", nationality: "", is_active: true,
  });
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

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
      setSaving(true);
      setSaveError(null);
      const created = await memberService.create(formData);
      navigate(`/admin/members/${created.id}`);
    } catch (err) {
      setSaveError(err.message ?? "Failed to create member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6">

      <FormHeader
        icon={<MdPersonAdd className="h-5 w-5" />}
        title="New Member"
        subtitle="Register a new PFM community member"
        actions={
          <Button
            variant="ghost"
            icon={<MdArrowBack className="h-4 w-4" />}
            text="Back to Members"
            onClick={() => navigate("/admin/members")}
          />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate>

        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField label="Full Name"  field="name"  placeholder="Ahmad Faris bin Abdullah" formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name} />
          <InputField label="Email Address" field="email" type="email" placeholder="ahmad@email.com" formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.email} />
        </div>

        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField label="Phone Number" field="phone" placeholder="+60123456789" formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.phone} />
          <InputField label="IC / Passport Number" field="ic_number" placeholder="900101-14-1234" formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.ic_number} />
        </div>

        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <SelectField label="Membership Type" field="membership_type" options={TYPE_OPTIONS} formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.membership_type} />
          <SelectField label="Nationality" field="nationality" options={NATIONALITY_OPTIONS} formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.nationality} />
        </div>

        <ToggleInput label="Active Status" field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />

        <div className="mt-4 flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/members")} className="flex-1" />
          <Button type="submit" variant="primary" text={saving ? "Creating..." : "Create Member"} icon={!saving && <MdPersonAdd className="h-4 w-4" />} loading={saving} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
