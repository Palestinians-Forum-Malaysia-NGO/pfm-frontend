import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPersonOutline } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import { InputField, SelectField, TextareaField, StorageImageField } from "components/form";
import { useUpdateProfile } from "components/features/profile/hooks";
import { useGetStates } from "components/features/beneficiaries/hooks";
import { COUNTRY_OPTIONS } from "components/features/beneficiaries/constants/countries";
import { missingProfileFields, profileFieldsToAsk } from "components/features/beneficiaries/constants/profileCompleteness";
import { useToast } from "components/ui/toast/ToastContext";

const PROFILE_FIELDS = [
  "gender", "date_of_birth", "has_visa", "visa_type", "situation",
  "country_of_origin", "palestine_region", "state", "address", "background",
];

// Only the answered fields go out; top-level user fields vs nested beneficiary
// profile fields, matching PATCH /accounts/me.
const toPayload = (draft) => {
  const filled = (f) => draft[f] !== undefined && String(draft[f]).trim() !== "";
  const profile = Object.fromEntries(
    PROFILE_FIELDS.filter(filled).map((f) => [f, f === "has_visa" ? draft[f] === "true" : String(draft[f]).trim()])
  );
  return {
    ...(filled("phone_number")  ? { phone_number: draft.phone_number.trim() } : {}),
    ...(filled("profile_photo") ? { profile_photo: draft.profile_photo } : {}),
    ...(Object.keys(profile).length ? { profile } : {}),
  };
};

/**
 * Asks a beneficiary only for the profile details they're missing (see
 * profileCompleteness.js) and saves them to their own profile.
 */
export default function ProfileCompletionForm({ profile, onSaved }) {
  const { t, i18n } = useTranslation();
  const { states } = useGetStates();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { success, error: toastError } = useToast();
  const [draft, setDraft] = useState({});

  const fields = profileFieldsToAsk(profile, draft);
  const stillMissing = missingProfileFields(profile, draft);
  const today = new Date().toISOString().slice(0, 10);
  const dobInFuture = !!draft.date_of_birth && draft.date_of_birth > today;
  const errors = dobInFuture ? { date_of_birth: t("apply.dob_future") } : {};

  const set = (f, v) => setDraft((p) => ({ ...p, [f]: v }));
  const opts = (values, prefix) => values.map((v) => ({ value: v, label: t(`beneficiaries.${prefix}${v}`) }));
  const REQUIRED = [{ required: true }];
  const common = { formData: draft, errors, updateFormData: set, rules: REQUIRED };

  const handleSave = async () => {
    try {
      await updateProfile(toPayload(draft));
      success(t("applications.profile_saved"));
      setDraft({});
      onSaved?.();
    } catch (err) {
      toastError(t("profile.toast_profile_update_failed"), err?.message);
    }
  };

  const FIELD = {
    profile_photo: (
      <StorageImageField label={t("common.profile_photo")} folder="profiles/photos" required
        onUpload={(key) => set("profile_photo", key)} onRemove={() => set("profile_photo", "")}
        errors={errors} field="profile_photo" />
    ),
    phone_number: <InputField label={t("apply.phone")} field="phone_number" placeholder="+60 12-345 6789" {...common} />,
    gender: (
      <SelectField label={t("beneficiaries.gender")} field="gender" options={opts(["male", "female"], "gender_")} {...common} />
    ),
    date_of_birth: <InputField label={t("beneficiaries.date_of_birth")} field="date_of_birth" type="date" {...common} />,
    has_visa: (
      <SelectField label={t("apply.visa_status")} field="has_visa" {...common}
        options={[{ value: "true", label: t("beneficiaries.visa_status_yes") }, { value: "false", label: t("beneficiaries.visa_status_no") }]} />
    ),
    visa_type: (
      <SelectField label={t("apply.visa_type")} field="visa_type" {...common}
        options={opts(["student", "work", "dependent", "social_visit", "refugee_pass", "other"], "visa_type_")} />
    ),
    situation: (
      <SelectField label={t("apply.situation")} field="situation" {...common}
        options={opts(["refugee", "asylum_seeker", "undocumented", "overstayed"], "situation_")} />
    ),
    country_of_origin: <SelectField label={t("apply.country_origin")} field="country_of_origin" options={COUNTRY_OPTIONS} {...common} />,
    palestine_region: (
      <SelectField label={t("apply.palestine_region")} field="palestine_region" {...common}
        options={opts(["gaza", "west_bank", "refugee_outside"], "region_")} />
    ),
    state: (
      <SelectField label={t("apply.state")} field="state" {...common}
        options={states.map((s) => ({ value: s.code, label: (s.label_ar && i18n.language === "ar") ? s.label_ar : s.label }))} />
    ),
    address: <InputField label={t("beneficiaries.address")} field="address" placeholder="No. 1, Jalan…" {...common} />,
    background: (
      <TextareaField label={t("apply.background")} field="background" rows={3}
        placeholder={t("apply.background_placeholder")} {...common} />
    ),
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <MdPersonOutline className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{t("applications.profile_step_title")}</p>
          <p className="text-sm text-slate-500">{t("applications.profile_step_body")}</p>
        </div>
      </div>

      <div className="flex flex-col">
        {fields.map((f) => <React.Fragment key={f}>{FIELD[f]}</React.Fragment>)}
      </div>

      <Button
        onClick={handleSave}
        loading={saving}
        disabled={stillMissing.length > 0 || dobInFuture}
        text={t("applications.profile_save_btn")}
      />
    </div>
  );
}
