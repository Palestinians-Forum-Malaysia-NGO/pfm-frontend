import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import StarRating   from "components/ui/StarRating";
import { TextareaField, validate } from "components/form";
import { useSubmitFeedback } from "components/features/feedback/hooks";

const RULES = {
  rating:  [{ min: 1 }, { max: 5 }],
  message: [{ required: true }, { minLength: 10 }, { maxLength: 2000 }],
};

const EMPTY = { rating: 0, message: "" };

const FeedbackForm = ({ projectId, fullName }) => {
  const { t } = useTranslation();
  const [form, setForm]           = useState(EMPTY);
  const [errors, setErrors]       = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { execute: submitFeedback, loading: sending, error } = useSubmitFeedback();

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
      await submitFeedback({
        project:   projectId,
        full_name: fullName,
        message:   form.message,
        rating:    form.rating,
      });
      setSubmitted(true);
    } catch {
      // error state is surfaced via the hook's `error` below
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      {submitted ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
            <MdCheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{t("feedback.success_title")}</h3>
          <p className="max-w-xs text-sm text-slate-400">{t("feedback.success_body")}</p>
          <button
            onClick={() => { setSubmitted(false); setForm(EMPTY); setErrors({}); }}
            className="mt-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
          >
            {t("feedback.send_another")}
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-900">{t("feedback.title")}</h3>
          <p className="mt-1 text-sm text-slate-400">{t("feedback.subtitle_as", { name: fullName })}</p>

          <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col" noValidate>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {t("feedback.rating")} <span className="text-red-500">*</span>
              </label>
              <StarRating value={form.rating} onChange={(v) => updateForm("rating", v)} size="h-7 w-7" />
              {errors.rating && <p className="mt-1 text-xs font-medium text-red-500">{errors.rating}</p>}
            </div>

            <TextareaField
              label={t("feedback.message")} field="message" rows={4} placeholder={t("feedback.message_placeholder")}
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
              {sending ? t("feedback.sending") : t("feedback.send")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default FeedbackForm;
