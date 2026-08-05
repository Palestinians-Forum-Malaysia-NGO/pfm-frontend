import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle, MdLocationOn, MdPerson, MdEmail, MdPhone } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import { InputField, SelectField, validate } from "components/form";
import StorageDocumentField from "components/form/upload/StorageDocumentField";
import { useSubmitOpportunityApplication } from "components/features/opportunityApplications/hooks";
import { NATIONALITIES } from "constants/lists";
import useAuth from "components/features/auth/hooks/useAuth";
import { ROLES } from "components/features/auth/types";

const NATIONALITY_OPTIONS = NATIONALITIES.map((n) => ({ value: n.name, label: n.label }));

const RULES = {
  opportunity_id:         [{ required: true }],
  applicant_full_name:    [{ required: true }, { maxLength: 255 }],
  applicant_email:        [{ required: true }, { email: true }],
  applicant_phone:        [{ required: true }, { maxLength: 30 }],
  applicant_cover_letter: [{ required: true }],
};

const emptyForm = (opportunityId) => ({
  opportunity_id: opportunityId || "",
  applicant_full_name: "", applicant_email: "", applicant_phone: "",
  applicant_date_of_birth: "", applicant_gender: "", applicant_nationality: "", applicant_current_city: "",
  applicant_resume: null,
  applicant_cover_letter: "",
});

/**
 * opportunityId — when given, the form applies to that one opportunity only
 * and hides the picker (used when embedded on a single opportunity's detail
 * page). Omit it to show the dropdown (used on the combined apply page).
 */
const OpportunityApplicationForm = ({ opportunities, opportunityId }) => {
  const { t } = useTranslation();
  const singleMode = !!opportunityId;
  const { user, isAuthenticated } = useAuth();
  const isBeneficiary = isAuthenticated && user?.role === ROLES.BENEFICIARY;
  const [form, setForm]           = useState(() => emptyForm(opportunityId));
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { execute: submitApplication, loading: sending, error } = useSubmitOpportunityApplication();

  // Beneficiaries already have this info on their account (name/email/phone
  // at the top level, dob/gender/city on their beneficiary profile) — fill
  // those in instead of asking them to retype them. Nationality has no
  // reliable source (the profile only stores an ISO country code, a
  // different value space than this form's demonym list), and resume/cover
  // letter/nationality aren't available anywhere, so those stay as fields
  // to fill in. Pre-filled fields stay editable in case circumstances
  // (e.g. current city) changed since the beneficiary last updated their profile.
  useEffect(() => {
    if (!isBeneficiary || !user) return;
    const p = user.profile ?? {};
    setForm((prev) => ({
      ...prev,
      applicant_full_name: user.full_name ?? "",
      applicant_email: user.email ?? "",
      applicant_phone: user.phone_number ?? "",
      applicant_date_of_birth: p.date_of_birth ? p.date_of_birth.slice(0, 10) : prev.applicant_date_of_birth,
      applicant_gender: p.gender ?? prev.applicant_gender,
      applicant_current_city: p.current_city ?? prev.applicant_current_city,
    }));
  }, [isBeneficiary, user]);

  const updateForm = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const GENDER_OPTIONS = [
    { value: "male",   label: t("opportunityApply.gender_male") },
    { value: "female", label: t("opportunityApply.gender_female") },
  ];

  const OPPORTUNITY_OPTIONS = opportunities.map((o) => ({ value: o.id, label: o.title }));
  const selectedOpportunity = opportunities.find((o) => o.id === (singleMode ? opportunityId : form.opportunity_id)) ?? null;

  const activeRules = {
    ...RULES,
    // Locked-from-account fields for beneficiaries: full_name/email are
    // required on every account so they're always present; phone is
    // optional on the account, so don't block submission over a field the
    // beneficiary has no way to edit from this form.
    ...(isBeneficiary ? { applicant_phone: [{ maxLength: 30 }] } : {}),
  };

  const canSubmit = !Object.entries(activeRules).some(([field, rules]) => !!validate(form[field], rules));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(activeRules).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const { opportunity_id, ...payload } = form;
    if (!payload.applicant_date_of_birth) delete payload.applicant_date_of_birth;
    if (!payload.applicant_resume) delete payload.applicant_resume;

    try {
      await submitApplication(opportunity_id, payload);
      setSubmitted(true);
    } catch {
      // error state is surfaced via the hook's `error` below
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
          <MdCheckCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">{t("opportunityApply.success_title")}</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-400">{t("opportunityApply.success_body")}</p>
        <Button
          variant="ghost"
          text={t("opportunityApply.send_another")}
          onClick={() => { setSubmitted(false); setForm(emptyForm(opportunityId)); setErrors({}); }}
          className="mt-4"
        />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900">{t("opportunityApply.form_title")}</h3>
      <p className="mt-1 text-sm text-slate-400">{t("opportunityApply.form_subtitle")}</p>

      <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col" noValidate>
        {!singleMode && (
          <SelectField
            label={t("opportunityApply.opportunity")} field="opportunity_id"
            options={OPPORTUNITY_OPTIONS}
            formData={form} errors={errors} updateFormData={updateForm} rules={RULES.opportunity_id}
          />
        )}
        {selectedOpportunity && (
          <p className="-mt-3 mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>{t(`opportunities.type_${selectedOpportunity.type}`, { defaultValue: selectedOpportunity.type })}</span>
            <span className="flex items-center gap-1"><MdLocationOn className="h-3.5 w-3.5" /> {t(`opportunities.location_${selectedOpportunity.location}`, { defaultValue: selectedOpportunity.location })}</span>
          </p>
        )}

        {isBeneficiary ? (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("opportunityApply.applying_as")}</p>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <MdPerson className="h-4 w-4 shrink-0 text-slate-400" /> {form.applicant_full_name}
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-700">
              <MdEmail className="h-4 w-4 shrink-0 text-slate-400" /> {form.applicant_email}
            </div>
            {form.applicant_phone && (
              <div className="flex items-center gap-2.5 text-sm text-slate-700">
                <MdPhone className="h-4 w-4 shrink-0 text-slate-400" /> {form.applicant_phone}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <InputField
                label={t("opportunityApply.full_name")} field="applicant_full_name" placeholder="Ahmad Faris"
                formData={form} errors={errors} updateFormData={updateForm} rules={RULES.applicant_full_name}
              />
              <InputField
                label={t("opportunityApply.email")} field="applicant_email" type="email" placeholder="ahmad@email.com"
                formData={form} errors={errors} updateFormData={updateForm} rules={RULES.applicant_email}
              />
            </div>
            <InputField
              label={t("opportunityApply.phone")} field="applicant_phone" placeholder="+60 12-345 6789"
              formData={form} errors={errors} updateFormData={updateForm} rules={RULES.applicant_phone}
            />
          </>
        )}
        <InputField
          label={t("opportunityApply.dob")} field="applicant_date_of_birth" type="date" required={false}
          formData={form} errors={errors} updateFormData={updateForm}
        />
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <SelectField
            label={t("opportunityApply.gender")} field="applicant_gender" required={false}
            options={GENDER_OPTIONS}
            formData={form} errors={errors} updateFormData={updateForm}
          />
          <SelectField
            label={t("opportunityApply.nationality")} field="applicant_nationality" required={false}
            options={NATIONALITY_OPTIONS}
            formData={form} errors={errors} updateFormData={updateForm}
          />
        </div>
        <InputField
          label={t("opportunityApply.city")} field="applicant_current_city" required={false} placeholder="Kuala Lumpur"
          formData={form} errors={errors} updateFormData={updateForm}
        />

        <StorageDocumentField
          label={t("opportunityApply.resume")}
          publicEndpoint="opportunityApplication"
          accept=".pdf,.doc,.docx"
          required={false}
          onUpload={(key) => updateForm("applicant_resume", key)}
          onRemove={() => updateForm("applicant_resume", null)}
          field="applicant_resume"
          errors={errors}
        />

        <StorageDocumentField
          label={t("opportunityApply.cover_letter")}
          publicEndpoint="opportunityApplication"
          accept=".pdf,.doc,.docx"
          required
          onUpload={(key) => updateForm("applicant_cover_letter", key)}
          onRemove={() => updateForm("applicant_cover_letter", "")}
          field="applicant_cover_letter"
          errors={errors}
        />

        <Button
          type="submit"
          variant="primary"
          icon={<MdSend className="h-4 w-4" />}
          text={sending ? t("opportunityApply.sending") : t("opportunityApply.send")}
          loading={sending}
          disabled={!canSubmit}
          className="mt-2"
        />
      </form>
    </div>
  );
};

export default OpportunityApplicationForm;
