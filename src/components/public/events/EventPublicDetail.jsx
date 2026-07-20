import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdEvent, MdCalendarToday, MdLocationOn, MdGroups, MdLogin } from "react-icons/md";
import { useGetEvent } from "components/features/events/hooks";
import StorageImage from "components/ui/StorageImage";
import Loading from "components/loading/Loading";
import EventRegistrationForm from "./EventRegistrationForm";
import useAuth from "components/features/auth/hooks/useAuth";
import { ROLES } from "components/features/auth/types";

const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function EventPublicDetail({ basePath = "/events" }) {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate  = useNavigate();

  const { event, execute: fetchEvent, loading, error } = useGetEvent();
  const { user, isAuthenticated } = useAuth();
  const isBeneficiary = isAuthenticated && user?.role === ROLES.BENEFICIARY;

  useEffect(() => { fetchEvent(slug); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text={t("eventsPublic.loading")} />;

  if (error || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdEvent className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">{t("eventsPublic.not_found_title")}</h2>
        <p className="mb-6 text-sm text-slate-400">{t("eventsPublic.not_found_body")}</p>
        <button onClick={() => navigate(basePath)} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> {t("eventsPublic.back_to_events")}
        </button>
      </div>
    );
  }

  const canRegister = event.is_active && !event.is_full;

  return (
    <div className="bg-white">
      {/* ── Hero — plain full-bleed image, no overlay or text ── */}
      {event.cover_image && (
        <div className="h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
          <StorageImage fileKey={event.cover_image} alt={event.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* ── Header block ── */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(basePath)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-green"
        >
          <MdArrowBack className="h-4 w-4" /> {t("eventsPublic.back_to_events")}
        </button>

        {event.location && (
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
              <MdLocationOn className="h-3.5 w-3.5" /> {event.location}
            </span>
            {event.is_full && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                {t("eventsPublic.full")}
              </span>
            )}
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {event.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium uppercase tracking-wide text-slate-400">
          {event.event_date && (
            <span className="flex items-center gap-1.5"><MdCalendarToday className="h-3.5 w-3.5" /> {fmtDate(event.event_date)}</span>
          )}
          {event.start_time && (
            <span>{fmtTime(event.start_time)}{event.end_time ? ` – ${fmtTime(event.end_time)}` : ""}</span>
          )}
          {event.capacity && (
            <span className="flex items-center gap-1.5"><MdGroups className="h-3.5 w-3.5" /> {t("eventsPublic.spots_left", { count: Math.max(0, event.spots_left ?? 0) })}</span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {event.description && (
          <p className="mb-10 text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{event.description}</p>
        )}

        {(!canRegister || isBeneficiary || !isAuthenticated) && (
          <div className="rounded-3xl border border-slate-200 p-6 sm:p-8">
            {!canRegister ? (
              <p className="py-6 text-center text-sm text-slate-500">
                {event.is_full ? t("eventsPublic.registration_full") : t("eventsPublic.registration_closed")}
              </p>
            ) : isBeneficiary ? (
              <EventRegistrationForm eventId={event.id} basePath={basePath} />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
                  <MdLogin className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-600">{t("eventsPublic.signin_prompt")}</p>
                <Link
                  to="/auth/sign-in"
                  className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90"
                >
                  {t("eventsPublic.signin_cta")}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
