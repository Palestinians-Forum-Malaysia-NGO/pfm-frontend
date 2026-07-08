import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdEdit, MdPhone, MdSecurity, MdPerson } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import { InputField, ToggleInput, StorageImageField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";

const EditProfileSection = ({ profile, onSaved }) => {
  const { t } = useTranslation();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { success, error: toastError } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [snapshot, setSnapshot] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [photoKey, setPhotoKey] = useState(null);
  const { url: currentPhotoUrl } = useStorageUrl(photoKey);

  useEffect(() => {
    if (profile) {
      const initial = {
        full_name:        profile.full_name        ?? "",
        phone_number:     profile.phone_number     ?? "",
        whatsapp_enabled: profile.whatsapp_enabled ?? false,
        is_2fa_enabled:   profile.is_2fa_enabled   ?? false,
        profile_photo:    profile.profile_photo    ?? null,
      };
      setFormData(initial);
      setSnapshot(initial);
      setPhotoKey(profile.profile_photo ?? null);
    }
  }, [profile]);

  const updateFormData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const isDirty = snapshot && (
    formData.full_name        !== snapshot.full_name        ||
    formData.phone_number     !== snapshot.phone_number     ||
    formData.whatsapp_enabled !== snapshot.whatsapp_enabled ||
    formData.is_2fa_enabled   !== snapshot.is_2fa_enabled   ||
    formData.profile_photo    !== snapshot.profile_photo
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = t("profile.full_name_required");
    if (Object.keys(newErrors).length) { setFormErrors(newErrors); return; }
    try {
      await updateProfile({
        full_name:        formData.full_name,
        phone_number:     formData.phone_number,
        whatsapp_enabled: formData.whatsapp_enabled,
        is_2fa_enabled:   formData.is_2fa_enabled,
        profile_photo:    formData.profile_photo || undefined,
      });
      success(t("profile.toast_profile_updated"), t("profile.toast_profile_updated_sub"));
      setEditMode(false);
      setFormErrors({});
      onSaved?.();
    } catch (err) {
      toastError(t("profile.toast_profile_update_failed"), err?.message);
    }
  };

  const handleCancel = () => {
    if (snapshot) { setFormData(snapshot); setPhotoKey(snapshot.profile_photo ?? null); }
    setFormErrors({});
    setEditMode(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("profile.edit_profile_title")}
        subtitle={t("profile.edit_profile_sub")}
        actions={
          !editMode && (
            <Button
              variant="ghost"
              icon={<MdEdit className="h-4 w-4" />}
              text={t("profile.edit_btn")}
              onClick={() => setEditMode(true)}
            />
          )
        }
      />

      {editMode ? (
        <form onSubmit={handleSubmit} noValidate>
          <StorageImageField
            label={t("common.profile_photo")}
            folder="profiles/photos"
            currentUrl={currentPhotoUrl}
            onUpload={(key) => { updateFormData("profile_photo", key); setPhotoKey(null); }}
            onRemove={() => { updateFormData("profile_photo", null); setPhotoKey(null); }}
            errors={formErrors}
            field="profile_photo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("users.full_name")} field="full_name" required
              placeholder={t("profile.full_name_placeholder")}
              formData={formData} errors={formErrors} updateFormData={updateFormData}
              rules={[{ required: true }]}
            />
            <InputField
              label={t("users.phone")} field="phone_number" required={false}
              placeholder="+60 12 345 6789"
              formData={formData} errors={formErrors} updateFormData={updateFormData}
            />
            <ToggleInput
              label={t("profile.whatsapp_enabled")} field="whatsapp_enabled"
              formData={formData} updateFormData={updateFormData} errors={formErrors}
            />
            <ToggleInput
              label={t("profile.two_factor_auth")} field="is_2fa_enabled"
              formData={formData} updateFormData={updateFormData} errors={formErrors}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="ghost" text={t("common.cancel")} onClick={handleCancel} className="flex-1" />
            <Button type="submit" variant="primary" text={t("profile.save_changes")} loading={saving} disabled={!isDirty} className="flex-1" />
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />}   label={t("users.full_name")}    value={profile.full_name    || "—"} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}    label={t("users.phone")} value={profile.phone_number || "—"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />} label={t("contact.whatsapp")}     value={profile.whatsapp_enabled ? t("common.enabled") : t("common.disabled")} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />} label={t("users.info_2fa")}          value={profile.is_2fa_enabled ? t("common.enabled") : t("common.disabled")} />
        </div>
      )}
    </div>
  );
};

export default EditProfileSection;
