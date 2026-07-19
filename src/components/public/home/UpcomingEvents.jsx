import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLocationOn, MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetEvents } from "components/features/events/hooks";

const UpcomingEvents = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  const { events: allEvents, loading } = useGetEvents();

  const now = new Date();
  const upcoming = allEvents
    .filter((e) => e.event_date && new Date(e.event_date) >= now)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 3);

  if (!loading && upcoming.length === 0) return null;

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.calendar")}</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{t("home.upcoming_events")}</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("home.all_events")} <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {(loading ? Array.from({ length: 3 }) : upcoming).map((e, i) => {
            const d = e?.event_date ? new Date(e.event_date) : null;
            return (
              <div
                key={e?.id ?? i}
                onClick={e ? () => navigate(`/events/${e.slug}`) : undefined}
                className={`flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-in-out ${e ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""}`}
                style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                  <span className="text-xl font-black leading-none text-slate-900">{d ? d.toLocaleDateString("en-MY", { day: "numeric" }) : "—"}</span>
                  <span className="text-[11px] font-bold uppercase text-slate-400">{d ? d.toLocaleDateString("en-MY", { month: "short" }) : ""}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-bold text-slate-900">{e ? e.title : "—"}</h3>
                  {e?.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                      <MdLocationOn className="h-3.5 w-3.5 shrink-0" />
                      {e.location}
                    </p>
                  )}
                </div>
                {e?.is_full && (
                  <span className="shrink-0 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">{t("eventsPublic.full")}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
