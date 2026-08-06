import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdEdit, MdPhone, MdSecurity, MdPerson, MdAccountBalance, MdAttachMoney } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import { InputField, SelectField, ToggleInput, StorageImageField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";

const EditProfileSection = ({ profile, onSaved }) => {
  const { t } = useTranslation();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { execute: updatePhoto, loading: savingPhoto } = useUpdateProfile();
  const { success, error: toastError } = useToast();
  const isBeneficiary = profile?.role === "beneficiary";

  const PAYMENT_FREQUENCY_OPTIONS = [
    { value: "monthly",  label: t("users.freq_monthly") },
    { value: "weekly",   label: t("users.freq_weekly") },
    { value: "biweekly", label: t("users.freq_biweekly") },
  ];

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
        banking_information: {
          bank_name:           profile.banking_information?.bank_name           ?? "",
          account_number:      profile.banking_information?.account_number      ?? "",
          account_holder_name: profile.banking_information?.account_holder_name ?? "",
        },
        financial_information: {
          job_title:         profile.financial_information?.job_title         ?? "",
          salary:            profile.financial_information?.salary            ?? "",
          payment_frequency: profile.financial_information?.payment_frequency ?? "",
        },
      };
      setFormData(initial);
      setSnapshot(initial);
      setPhotoKey(profile.profile_photo ?? null);
    }
  }, [profile]);

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const isDirty = snapshot && JSON.stringify(formData) !== JSON.stringify(snapshot);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = t("profile.full_name_required");
    if (Object.keys(newErrors).length) { setFormErrors(newErrors); return; }
    try {
      const payload = {
        full_name:        formData.full_name,
        phone_number:     formData.phone_number,
        whatsapp_enabled: formData.whatsapp_enabled,
        is_2fa_enabled:   formData.is_2fa_enabled,
      };
      if (!isBeneficiary) {
        payload.banking_information = { ...formData.banking_information };
        payload.financial_information = { ...formData.financial_information };
      }
      await updateProfile(payload);
      success(t("profile.toast_profile_updated"), t("profile.toast_profile_updated_sub"));
      setEditMode(false);
      setFormErrors({});
      onSaved?.();
    } catch (err) {
      toastError(t("profile.toast_profile_update_failed"), err?.message);
    }
  };

  const handleCancel = () => {
    if (snapshot) setFormData(snapshot);
    setFormErrors({});
    setEditMode(false);
  };

  const savePhoto = async (key) => {
    const prevPhotoKey = photoKey;
    setPhotoKey(key);
    try {
      await updatePhoto({ profile_photo: key });
      success(t("profile.toast_photo_updated"));
      onSaved?.();
    } catch (err) {
      setPhotoKey(prevPhotoKey);
      toastError(t("profile.toast_photo_update_failed"), err?.message);
    }
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

      <StorageImageField
        label={t("common.profile_photo")}
        folder="profiles/photos"
        currentUrl={currentPhotoUrl}
        onUpload={(key) => savePhoto(key)}
        onRemove={() => savePhoto(null)}
      />
      {savingPhoto && <p className="-mt-3 mb-4 text-xs text-slate-400">{t("profile.saving_photo")}</p>}

      {editMode ? (
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            {isBeneficiary ? (
              <div>
                <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("users.full_name")} value={formData.full_name || "—"} />
                <p className="mt-1 text-xs text-slate-400">{t("profile.name_locked_note")}</p>
              </div>
            ) : (
              <InputField
                label={t("users.full_name")} field="full_name" required
                placeholder={t("profile.full_name_placeholder")}
                formData={formData} errors={formErrors} updateFormData={updateFormData}
                rules={[{ required: true }]}
              />
            )}
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

          {!isBeneficiary && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("users.banking_info")} subtitle={t("users.banking_sub")} />
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <InputField
                  label={t("users.bank_name")} field="banking_information.bank_name" required={false}
                  placeholder="e.g. Maybank"
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                />
                <InputField
                  label={t("users.account_holder")} field="banking_information.account_holder_name" required={false}
                  placeholder="As per bank records"
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                />
              </div>
              <InputField
                label={t("users.account_number")} field="banking_information.account_number" required={false}
                placeholder="e.g. 1234567890"
                formData={formData} errors={formErrors} updateFormData={updateFormData}
              />

              <div className="mt-5">
                <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("users.financial_info")} subtitle={t("users.financial_sub")} />
                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  <InputField
                    label={t("users.job_title")} field="financial_information.job_title" required={false}
                    placeholder="e.g. Program Manager"
                    formData={formData} errors={formErrors} updateFormData={updateFormData}
                  />
                  <InputField
                    label={t("users.salary")} field="financial_information.salary" required={false}
                    placeholder="e.g. 3500.00"
                    formData={formData} errors={formErrors} updateFormData={updateFormData}
                  />
                </div>
                <SelectField
                  label={t("users.payment_frequency")} field="financial_information.payment_frequency" required={false}
                  options={PAYMENT_FREQUENCY_OPTIONS}
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                />
              </div>
            </div>
          )}

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
