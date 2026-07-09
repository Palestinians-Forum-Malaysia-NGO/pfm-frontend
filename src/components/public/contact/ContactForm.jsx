import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { InputField, TextareaField, validate } from "components/form";
import { useSubmitContactMessage } from "components/features/contact/hooks";
import useInView from "hooks/useInView";

const RULES = {
  name:    [{ required: true }, { maxLength: 255 }],
  email:   [{ required: true }, { email: true }],
  subject: [{ required: true }, { maxLength: 255 }],
  message: [{ required: true }, { minLength: 10 }, { maxLength: 5000 }],
};

const EMPTY = { name: "", email: "", subject: "", message: "" };

const ContactForm = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { execute: submitMessage, loading: sending, error } = useSubmitContactMessage();

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
      await submitMessage({
        full_name: form.name,
        email:     form.email,
        subject:   form.subject,
        message:   form.message,
      });
      setSubmitted(true);
    } catch {
      // error state is surfaced via the hook's `error` below
    }
  };

  return (
    <div
      ref={ref}
      className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out" }}
    >
      {submitted ? (
        <div className="flex h-full flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
            <MdCheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{t("contact.success_title")}</h3>
          <p className="max-w-xs text-sm text-slate-400">{t("contact.success_body")}</p>
          <button
            onClick={() => { setSubmitted(false); setForm(EMPTY); setErrors({}); }}
            className="mt-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            {t("contact.send_another")}
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-900">{t("contact.send_message")}</h3>
          <p className="mt-1 text-sm text-slate-400">{t("contact.response_time")}</p>

          <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col" noValidate>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <InputField
                label={t("contact.full_name")} field="name" placeholder={t("contact.name_placeholder")}
                formData={form} errors={errors} updateFormData={updateForm} rules={RULES.name}
              />
              <InputField
                label={t("contact.email_address")} field="email" type="email" placeholder="ahmad@email.com"
                formData={form} errors={errors} updateFormData={updateForm} rules={RULES.email}
              />
            </div>

            <InputField
              label={t("contact.subject")} field="subject" placeholder={t("contact.subject_placeholder")}
              formData={form} errors={errors} updateFormData={updateForm} rules={RULES.subject}
            />

            <TextareaField
              label={t("contact.message")} field="message" rows={5} placeholder={t("contact.message_placeholder")}
              formData={form} errors={errors} updateFormData={updateForm} rules={RULES.message}
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
              {sending ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ContactForm;
