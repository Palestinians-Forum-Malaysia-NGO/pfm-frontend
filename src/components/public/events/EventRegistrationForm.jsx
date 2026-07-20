import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSend, MdCheckCircle, MdPerson, MdEmail, MdPhone } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateEventRegistration } from "components/features/eventRegistrations/hooks";
import useAuth from "components/features/auth/hooks/useAuth";
import { hasApplied, markApplied } from "utils/eventApplications";

const EventRegistrationForm = ({ eventId, basePath = "/events" }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(() => hasApplied(user?.id, eventId));
  const { execute: submitRegistration, loading: sending, error } = useCreateEventRegistration();

  const handleApply = async () => {
    try {
      await submitRegistration(eventId, {
        full_name: user.full_name,
        email: user.email,
        phone: user.phone_number,
      });
      markApplied(user.id, eventId);
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
        <Link
          to={basePath}
          className="mt-4 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
        >
          {t("eventsPublic.back_to_events")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900">{t("eventsPublic.register_title")}</h3>
      <p className="mt-1 text-sm text-slate-400">{t("eventsPublic.register_subtitle")}</p>

      <AlertBanner message={error} className="mt-4 rounded-xl border px-4 py-3" />

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{t("eventsPublic.applying_as")}</p>
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <MdPerson className="h-4 w-4 shrink-0 text-slate-400" /> {user.full_name}
        </div>
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <MdEmail className="h-4 w-4 shrink-0 text-slate-400" /> {user.email}
        </div>
        {user.phone_number && (
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <MdPhone className="h-4 w-4 shrink-0 text-slate-400" /> {user.phone_number}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleApply}
        disabled={sending}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-green py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <MdSend className="h-4 w-4" />
        )}
        {sending ? t("eventsPublic.sending") : t("eventsPublic.register_btn")}
      </button>
    </div>
  );
};

export default EventRegistrationForm;
