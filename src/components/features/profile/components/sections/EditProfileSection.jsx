import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  MdEdit, MdPhone, MdSecurity, MdPerson, MdAccountBalance, MdAttachMoney,
  MdBusiness, MdWork, MdLocationCity, MdCardTravel, MdBadge, MdOpenInNew,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import Button from "components/ui/buttons/Button";
import StorageFileLink from "components/ui/StorageFileLink";
import DocumentManagerSection from "components/ui/DocumentManagerSection";
import { InputField, SelectField, ToggleInput, StorageImageField, StorageDocumentField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import {
  useGetAdminDocuments, useCreateAdminDocument, useUpdateAdminDocument, useDeleteAdminDocument,
} from "components/features/users/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";

const EditProfileSection = ({ profile, onSaved }) => {
  const { t } = useTranslation();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { execute: updatePhoto, loading: savingPhoto } = useUpdateProfile();
  const { success, error: toastError } = useToast();
  const isBeneficiary = profile?.role === "beneficiary";
  const isStaff = profile?.role === "staff";
  const isAdmin = profile?.role === "admin";
  const staffProfile = profile?.profile;
  const adminProfile = isAdmin ? profile?.profile : null;

  const { documents, execute: fetchDocuments, loading: docsLoading } = useGetAdminDocuments();
  const { execute: createDocument } = useCreateAdminDocument();
  const { execute: updateDocument } = useUpdateAdminDocument();
  const { execute: deleteDocument } = useDeleteAdminDocument();

  useEffect(() => {
    if (isAdmin && profile?.id) fetchDocuments(profile.id);
  }, [isAdmin, profile?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddDocument = async (payload) => {
    try {
      await createDocument(profile.id, payload);
      success(t("documents.toast_added"));
      fetchDocuments(profile.id);
    } catch (err) {
      toastError(t("documents.toast_add_failed"), err?.message);
    }
  };
  const handleUpdateDocument = async (docId, payload) => {
    try {
      await updateDocument(profile.id, docId, payload);
      success(t("documents.toast_saved"));
      fetchDocuments(profile.id);
    } catch (err) {
      toastError(t("documents.toast_save_failed"), err?.message);
    }
  };
  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocument(profile.id, docId);
      success(t("documents.toast_deleted"));
      fetchDocuments(profile.id);
    } catch (err) {
      toastError(t("documents.toast_delete_failed"), err?.message);
    }
  };

  const PAYMENT_FREQUENCY_OPTIONS = [
    { value: "monthly",  label: t("users.freq_monthly") },
    { value: "weekly",   label: t("users.freq_weekly") },
    { value: "biweekly", label: t("users.freq_biweekly") },
  ];
  const ID_DOCUMENT_TYPE_OPTIONS = [
    { value: "passport",    label: t("staff.id_doc_type_passport") },
    { value: "national_id", label: t("staff.id_doc_type_national_id") },
    { value: "other",       label: t("staff.id_doc_type_other") },
  ];
  const VISA_TYPE_OPTIONS = [
    { value: "employment_pass",         label: t("staff.visa_type_employment_pass") },
    { value: "professional_visit_pass", label: t("staff.visa_type_professional_visit_pass") },
    { value: "dependent_pass",          label: t("staff.visa_type_dependent_pass") },
    { value: "other",                   label: t("staff.visa_type_other") },
  ];
  const ID_DOCUMENT_TYPE_LABELS = Object.fromEntries(ID_DOCUMENT_TYPE_OPTIONS.map((o) => [o.value, o.label]));
  const VISA_TYPE_LABELS = Object.fromEntries(VISA_TYPE_OPTIONS.map((o) => [o.value, o.label]));

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [snapshot, setSnapshot] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [photoKey, setPhotoKey] = useState(null);
  const { url: currentPhotoUrl } = useStorageUrl(photoKey);
  const { url: currentIdDocUrl }   = useStorageUrl(formData.id_document,   { forcePresigned: true });
  const { url: currentVisaDocUrl } = useStorageUrl(formData.visa_document, { forcePresigned: true });

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
        ...(isAdmin ? {
          id_document:      adminProfile?.id_document?.file_key ?? adminProfile?.id_document ?? null,
          id_document_type: adminProfile?.id_document_type      ?? "",
          has_visa:         adminProfile?.has_visa               ?? false,
          visa_type:        adminProfile?.visa_type               ?? "",
          visa_number:      adminProfile?.visa_number             ?? "",
          visa_expiry_date: adminProfile?.visa_expiry_date ? adminProfile.visa_expiry_date.slice(0, 10) : "",
          visa_document:    adminProfile?.visa_document?.file_key ?? adminProfile?.visa_document ?? null,
        } : {}),
      };
      setFormData(initial);
      setSnapshot(initial);
      setPhotoKey(profile.profile_photo ?? null);
    }
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (isAdmin) {
      if (!formData.phone_number?.trim()) newErrors.phone_number = t("validation.required");
      const bi = formData.banking_information;
      if (!bi.bank_name?.trim())           newErrors.banking_information = { ...newErrors.banking_information, bank_name: t("validation.required") };
      if (!bi.account_holder_name?.trim()) newErrors.banking_information = { ...newErrors.banking_information, account_holder_name: t("validation.required") };
      if (!bi.account_number?.trim())      newErrors.banking_information = { ...newErrors.banking_information, account_number: t("validation.required") };
      const fi = formData.financial_information;
      if (!fi.job_title?.trim())         newErrors.financial_information = { ...newErrors.financial_information, job_title: t("validation.required") };
      if (!String(fi.salary ?? "").trim()) newErrors.financial_information = { ...newErrors.financial_information, salary: t("validation.required") };
      if (!fi.payment_frequency)         newErrors.financial_information = { ...newErrors.financial_information, payment_frequency: t("validation.required") };
      if (formData.has_visa && !formData.visa_type) newErrors.visa_type = t("validation.required");
    }
    if (Object.keys(newErrors).length) { setFormErrors(newErrors); return; }
    try {
      const payload = {
        full_name:        formData.full_name,
        phone_number:     formData.phone_number,
        whatsapp_enabled: formData.whatsapp_enabled,
      };
      if (isBeneficiary) {
        payload.is_2fa_enabled = false;
      } else if (isAdmin) {
        payload.is_2fa_enabled = formData.is_2fa_enabled;
      }
      if (!isBeneficiary) {
        payload.banking_information = { ...formData.banking_information };
        payload.financial_information = { ...formData.financial_information };
      }
      if (isAdmin) {
        payload.profile = {
          id_document:      formData.id_document      || undefined,
          id_document_type: formData.id_document_type || undefined,
          has_visa:         formData.has_visa,
          visa_type:        formData.has_visa ? formData.visa_type : undefined,
          visa_number:      formData.has_visa ? (formData.visa_number || undefined) : undefined,
          visa_expiry_date: formData.has_visa ? (formData.visa_expiry_date || undefined) : undefined,
          visa_document:    formData.has_visa ? (formData.visa_document || undefined) : undefined,
        };
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
              label={t("users.phone")} field="phone_number" required={isAdmin}
              placeholder="+60 12 345 6789"
              formData={formData} errors={formErrors} updateFormData={updateFormData}
              rules={isAdmin ? [{ required: true }] : []}
            />
            <ToggleInput
              label={t("profile.whatsapp_enabled")} field="whatsapp_enabled"
              formData={formData} updateFormData={updateFormData} errors={formErrors}
            />
            {isAdmin && (
              <ToggleInput
                label={t("profile.two_factor_auth")} field="is_2fa_enabled"
                formData={formData} updateFormData={updateFormData} errors={formErrors}
              />
            )}
          </div>

          {!isBeneficiary && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("users.banking_info")} subtitle={t("users.banking_sub")} />
              <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                <InputField
                  label={t("users.bank_name")} field="banking_information.bank_name" required={isAdmin}
                  placeholder="e.g. Maybank"
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                  rules={isAdmin ? [{ required: true }] : []}
                />
                <InputField
                  label={t("users.account_holder")} field="banking_information.account_holder_name" required={isAdmin}
                  placeholder="As per bank records"
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                  rules={isAdmin ? [{ required: true }] : []}
                />
              </div>
              <InputField
                label={t("users.account_number")} field="banking_information.account_number" required={isAdmin}
                placeholder="e.g. 1234567890"
                formData={formData} errors={formErrors} updateFormData={updateFormData}
                rules={isAdmin ? [{ required: true }] : []}
              />

              <div className="mt-5">
                <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("users.financial_info")} subtitle={t("users.financial_sub")} />
                <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                  <InputField
                    label={t("users.job_title")} field="financial_information.job_title" required={isAdmin}
                    placeholder="e.g. Program Manager"
                    formData={formData} errors={formErrors} updateFormData={updateFormData}
                    rules={isAdmin ? [{ required: true }] : []}
                  />
                  <InputField
                    label={t("users.salary")} field="financial_information.salary" required={isAdmin}
                    placeholder="e.g. 3500.00"
                    formData={formData} errors={formErrors} updateFormData={updateFormData}
                    rules={isAdmin ? [{ required: true }] : []}
                  />
                </div>
                <SelectField
                  label={t("users.payment_frequency")} field="financial_information.payment_frequency" required={isAdmin}
                  options={PAYMENT_FREQUENCY_OPTIONS}
                  formData={formData} errors={formErrors} updateFormData={updateFormData}
                  rules={isAdmin ? [{ required: true }] : []}
                />
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <FormHeader icon={<MdCardTravel className="h-5 w-5" />} title={t("staff.section_visa")} subtitle={t("staff.section_visa_sub")} />
              <StorageDocumentField
                label={t("staff.id_document")}
                folder="users/documents"
                accept=".pdf,.jpg,.jpeg,.png"
                required={false}
                currentUrl={currentIdDocUrl}
                onUpload={(key) => updateFormData("id_document", key)}
                onRemove={() => updateFormData("id_document", null)}
              />
              <SelectField
                label={t("staff.id_doc_type_label")} field="id_document_type" options={ID_DOCUMENT_TYPE_OPTIONS}
                required={false} formData={formData} errors={formErrors} updateFormData={updateFormData}
              />
              <ToggleInput label={t("staff.has_visa")} field="has_visa" formData={formData} errors={formErrors} updateFormData={updateFormData} />
              {formData.has_visa && (
                <>
                  <SelectField
                    label={t("staff.visa_type")} field="visa_type" options={VISA_TYPE_OPTIONS}
                    formData={formData} errors={formErrors} updateFormData={updateFormData} rules={[{ required: true }]}
                  />
                  <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
                    <InputField
                      label={t("staff.visa_number")} field="visa_number" placeholder="e.g. EP-1234567"
                      required={false} formData={formData} errors={formErrors} updateFormData={updateFormData}
                    />
                    <InputField
                      label={t("staff.visa_expiry_date")} field="visa_expiry_date" type="date"
                      required={false} formData={formData} errors={formErrors} updateFormData={updateFormData}
                    />
                  </div>
                  <StorageDocumentField
                    label={t("staff.visa_document_label")}
                    folder="users/documents"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required={false}
                    currentUrl={currentVisaDocUrl}
                    onUpload={(key) => updateFormData("visa_document", key)}
                    onRemove={() => updateFormData("visa_document", null)}
                  />
                </>
              )}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Button variant="ghost" text={t("common.cancel")} onClick={handleCancel} className="flex-1" />
            <Button type="submit" variant="primary" text={t("profile.save_changes")} loading={saving} disabled={!isDirty} className="flex-1" />
          </div>
        </form>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdPerson className="h-4 w-4" />}   label={t("users.full_name")}    value={profile.full_name    || "—"} />
            <InfoRow icon={<MdPhone className="h-4 w-4" />}    label={t("users.phone")} value={profile.phone_number || "—"} />
            <InfoRow icon={<MdSecurity className="h-4 w-4" />} label={t("contact.whatsapp")}     value={profile.whatsapp_enabled ? t("common.enabled") : t("common.disabled")} />
            {!isBeneficiary && (
              <InfoRow icon={<MdSecurity className="h-4 w-4" />} label={t("users.info_2fa")} value={profile.is_2fa_enabled ? t("common.enabled") : t("common.disabled")} />
            )}
            {isStaff && staffProfile && (
              <>
                <InfoRow icon={<MdBusiness className="h-4 w-4" />}     label={t("staff.info_department")} value={staffProfile.department || "—"} />
                <InfoRow icon={<MdWork className="h-4 w-4" />}         label={t("staff.info_position")}   value={staffProfile.position   || "—"} />
                <InfoRow icon={<MdLocationCity className="h-4 w-4" />} label={t("staff.info_branch")}     value={staffProfile.branch     || "—"} />
              </>
            )}
            {isAdmin && adminProfile && (
              <>
                {adminProfile.id_document_type && (
                  <InfoRow icon={<MdBadge className="h-4 w-4" />} label={t("staff.id_doc_type_label")} value={ID_DOCUMENT_TYPE_LABELS[adminProfile.id_document_type] ?? adminProfile.id_document_type} />
                )}
                {adminProfile.id_document && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{t("staff.id_document")}</span>
                    <StorageFileLink fileKey={adminProfile.id_document} className="inline-flex items-center gap-1 text-xs font-medium text-green hover:underline">
                      {t("beneficiaries.doc_view")} <MdOpenInNew className="h-3 w-3" />
                    </StorageFileLink>
                  </div>
                )}
                <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("staff.has_visa")} value={adminProfile.has_visa ? t("common.enabled") : t("common.disabled")} />
                {adminProfile.has_visa && (
                  <>
                    <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("staff.visa_type")} value={VISA_TYPE_LABELS[adminProfile.visa_type] ?? adminProfile.visa_type ?? "—"} />
                    {adminProfile.visa_number && (
                      <InfoRow icon={<MdBadge className="h-4 w-4" />} label={t("staff.visa_number")} value={adminProfile.visa_number} />
                    )}
                    {adminProfile.visa_expiry_date && (
                      <InfoRow icon={<MdCardTravel className="h-4 w-4" />} label={t("staff.visa_expiry_date")} value={adminProfile.visa_expiry_date.slice(0, 10)} />
                    )}
                    {adminProfile.visa_document && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{t("staff.visa_document_label")}</span>
                        <StorageFileLink fileKey={adminProfile.visa_document} className="inline-flex items-center gap-1 text-xs font-medium text-green hover:underline">
                          {t("beneficiaries.doc_view")} <MdOpenInNew className="h-3 w-3" />
                        </StorageFileLink>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}

      {isAdmin && (
        <div className="mt-5 border-t border-slate-200 pt-5">
          <DocumentManagerSection
            documents={documents}
            loading={docsLoading}
            folder="users/documents"
            onAdd={handleAddDocument}
            onUpdate={handleUpdateDocument}
            onDelete={handleDeleteDocument}
          />
        </div>
      )}
    </div>
  );
};

export default EditProfileSection;
