import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { InputField, validate } from "components/form";
import { useCreateEventRegistration } from "components/features/eventRegistrations/hooks";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
  phone:     [{ required: true }, { maxLength: 30 }],
};

const EMPTY = { full_name: "", email: "", phone: "" };

const EventRegistrationForm = ({ eventId }) => {
  const { t } = useTranslation();
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { execute: submitRegistration, loading: sending, error } = useCreateEventRegistration();

  const updateForm = (field, value) => setForm((p) => ({ ...p, [field]: value }));

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

    try {
      await submitRegistration(eventId, form);
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
        <h3 className="mt-4 text-xl font-bold text-slate-900">{t("eventsPublic.success_title")}</h3>
        <p className="mt-1 max-w-xs text-sm text-slate-400">{t("eventsPublic.success_body")}</p>
        <button
          onClick={() => { setSubmitted(false); setForm(EMPTY); setErrors({}); }}
          className="mt-4 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
        >
          {t("eventsPublic.register_another")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900">{t("eventsPublic.register_title")}</h3>
      <p className="mt-1 text-sm text-slate-400">{t("eventsPublic.register_subtitle")}</p>

      <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col" noValidate>
        <InputField
          label={t("eventsPublic.full_name")} field="full_name" placeholder="Ahmad Faris"
          formData={form} errors={errors} updateFormData={updateForm} rules={RULES.full_name}
        />
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField
            label={t("eventsPublic.email")} field="email" type="email" placeholder="ahmad@email.com"
            formData={form} errors={errors} updateFormData={updateForm} rules={RULES.email}
          />
          <InputField
            label={t("eventsPublic.phone")} field="phone" placeholder="+60 12-345 6789"
            formData={form} errors={errors} updateFormData={updateForm} rules={RULES.phone}
          />
        </div>

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
          {sending ? t("eventsPublic.sending") : t("eventsPublic.register_btn")}
        </button>
      </form>
    </div>
  );
};

export default EventRegistrationForm;
