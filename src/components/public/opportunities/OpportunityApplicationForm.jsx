import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle, MdInfoOutline, MdLocationOn } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { InputField, TextareaField, SelectField, validate } from "components/form";
import { useSubmitOpportunityApplication } from "components/features/opportunityApplications/hooks";
import { NATIONALITIES } from "constants/lists";

const NATIONALITY_OPTIONS = NATIONALITIES.map((n) => ({ value: n.name, label: n.label }));

const RULES = {
  opportunity_id:         [{ required: true }],
  applicant_full_name:    [{ required: true }, { maxLength: 255 }],
  applicant_email:        [{ required: true }, { email: true }],
  applicant_phone:        [{ required: true }, { maxLength: 30 }],
  applicant_cover_letter: [{ required: true }, { minLength: 20 }, { maxLength: 5000 }],
};

const EMPTY = {
  opportunity_id: "",
  applicant_full_name: "", applicant_email: "", applicant_phone: "",
  applicant_date_of_birth: "", applicant_gender: "", applicant_nationality: "", applicant_current_city: "",
  applicant_cover_letter: "",
};

const OpportunityApplicationForm = ({ opportunities }) => {
  const { t } = useTranslation();
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { execute: submitApplication, loading: sending, error } = useSubmitOpportunityApplication();

  const updateForm = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const OPPORTUNITY_OPTIONS = opportunities.map((o) => ({ value: o.id, label: o.title }));
  const selectedOpportunity = opportunities.find((o) => o.id === form.opportunity_id) ?? null;

  const canSubmit = !Object.entries(RULES).some(([field, rules]) => !!validate(form[field], rules));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    const { opportunity_id, ...payload } = form;
    if (!payload.applicant_date_of_birth) delete payload.applicant_date_of_birth;

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
        <button
          onClick={() => { setSubmitted(false); setForm(EMPTY); setErrors({}); }}
          className="mt-4 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
        >
          {t("opportunityApply.send_another")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900">{t("opportunityApply.form_title")}</h3>
      <p className="mt-1 text-sm text-slate-400">{t("opportunityApply.form_subtitle")}</p>

      <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col" noValidate>
        <SelectField
          label={t("opportunityApply.opportunity")} field="opportunity_id"
          options={OPPORTUNITY_OPTIONS}
          formData={form} errors={errors} updateFormData={updateForm} rules={RULES.opportunity_id}
        />
        {selectedOpportunity && (
          <p className="-mt-3 mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>{t(`opportunities.type_${selectedOpportunity.type}`, { defaultValue: selectedOpportunity.type })}</span>
            <span className="flex items-center gap-1"><MdLocationOn className="h-3.5 w-3.5" /> {t(`opportunities.location_${selectedOpportunity.location}`, { defaultValue: selectedOpportunity.location })}</span>
          </p>
        )}

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
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField
            label={t("opportunityApply.phone")} field="applicant_phone" placeholder="+60 12-345 6789"
            formData={form} errors={errors} updateFormData={updateForm} rules={RULES.applicant_phone}
          />
          <InputField
            label={t("opportunityApply.dob")} field="applicant_date_of_birth" type="date" required={false}
            formData={form} errors={errors} updateFormData={updateForm}
          />
        </div>
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField
            label={t("opportunityApply.gender")} field="applicant_gender" required={false} placeholder={t("opportunityApply.gender_placeholder")}
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

        <div className="mb-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          <MdInfoOutline className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>{t("opportunityApply.documents_coming_soon")}</p>
        </div>

        <TextareaField
          label={t("opportunityApply.cover_letter")} field="applicant_cover_letter" rows={5} placeholder={t("opportunityApply.cover_letter_placeholder")}
          formData={form} errors={errors} updateFormData={updateForm} rules={RULES.applicant_cover_letter}
        />

        <button
          type="submit"
          disabled={sending || !canSubmit}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-green py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <MdSend className="h-4 w-4" />
          )}
          {sending ? t("opportunityApply.sending") : t("opportunityApply.send")}
        </button>
      </form>
    </div>
  );
};

export default OpportunityApplicationForm;
