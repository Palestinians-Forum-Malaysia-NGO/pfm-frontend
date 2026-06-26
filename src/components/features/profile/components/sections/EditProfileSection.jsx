import React, { useState, useEffect } from "react";
import { MdEdit, MdPhone, MdSecurity, MdPerson } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import { InputField, ToggleInput } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const EditProfileSection = ({ profile, onSaved }) => {
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { success, error: toastError } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [snapshot, setSnapshot] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (profile) {
      const initial = {
        full_name:        profile.full_name        ?? "",
        phone_number:     profile.phone_number     ?? "",
        whatsapp_enabled: profile.whatsapp_enabled ?? false,
        is_2fa_enabled:   profile.is_2fa_enabled   ?? false,
      };
      setFormData(initial);
      setSnapshot(initial);
    }
  }, [profile]);

  const updateFormData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isDirty = snapshot && (
    formData.full_name        !== snapshot.full_name        ||
    formData.phone_number     !== snapshot.phone_number     ||
    formData.whatsapp_enabled !== snapshot.whatsapp_enabled ||
    formData.is_2fa_enabled   !== snapshot.is_2fa_enabled
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (Object.keys(newErrors).length) { setFormErrors(newErrors); return; }
    try {
      await updateProfile({
        full_name:        formData.full_name,
        phone_number:     formData.phone_number,
        whatsapp_enabled: formData.whatsapp_enabled,
        is_2fa_enabled:   formData.is_2fa_enabled,
      });
      success("Profile updated", "Your changes have been saved.");
      setEditMode(false);
      setFormErrors({});
      onSaved?.();
    } catch (err) {
      toastError("Failed to update profile", err?.message);
    }
  };

  const handleCancel = () => {
    if (snapshot) setFormData(snapshot);
    setFormErrors({});
    setEditMode(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Profile"
        subtitle="Update your name, contact details and preferences"
        actions={
          !editMode && (
            <Button
              variant="ghost"
              icon={<MdEdit className="h-4 w-4" />}
              text="Edit"
              onClick={() => setEditMode(true)}
            />
          )
        }
      />

      {editMode ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Full Name" field="full_name" required
              placeholder="Your full name"
              formData={formData} errors={formErrors} updateFormData={updateFormData}
              rules={[{ type: "required", message: "Full name is required" }]}
            />
            <InputField
              label="Phone Number" field="phone_number" required={false}
              placeholder="+60 12 345 6789"
              formData={formData} errors={formErrors} updateFormData={updateFormData}
            />
            <ToggleInput
              label="WhatsApp Enabled" field="whatsapp_enabled"
              formData={formData} updateFormData={updateFormData} errors={formErrors}
            />
            <ToggleInput
              label="Two-Factor Authentication" field="is_2fa_enabled"
              formData={formData} updateFormData={updateFormData} errors={formErrors}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="ghost" text="Cancel" onClick={handleCancel} className="flex-1" />
            <Button type="submit" variant="primary" text="Save Changes" loading={saving} disabled={!isDirty} className="flex-1" />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />}   label="Full Name"    value={profile.full_name    || "—"} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}    label="Phone Number" value={profile.phone_number || "—"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />} label="WhatsApp"     value={profile.whatsapp_enabled ? "Enabled" : "Disabled"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />} label="2FA"          value={profile.is_2fa_enabled ? "Enabled" : "Disabled"} />
        </div>
      )}
    </div>
  );
};

export default EditProfileSection;
