import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLocationOn, MdArrowForward, MdEvent, MdCalendarToday, MdGroups } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetEvents } from "components/features/events/hooks";
import StorageImage from "components/ui/StorageImage";

const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : null;

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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : upcoming).map((e, i) => {
            const filled = e?.capacity ? e.capacity - (e.spots_left ?? e.capacity) : 0;
            const filledPct = e?.capacity ? Math.min(100, Math.max(0, (filled / e.capacity) * 100)) : 0;
            return (
              <div
                key={e?.id ?? i}
                onClick={e ? () => navigate(`/events/${e.slug}`) : undefined}
                className={`group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-in-out ${e ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""}`}
                style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, box-shadow 0.3s ease-in-out", transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-40 overflow-hidden bg-slate-100">
                  {e?.cover_image ? (
                    <StorageImage fileKey={e.cover_image} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green/10 to-green-50">
                      <MdEvent className="h-10 w-10 text-green/30" />
                    </div>
                  )}
                  {e?.is_full && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-50/95 px-3 py-1 text-xs font-bold text-red-500 backdrop-blur-sm">
                      {t("eventsPublic.full")}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="line-clamp-2 font-bold text-slate-900">{e ? e.title : "—"}</h3>
                  <div className="flex flex-col gap-1 text-xs text-slate-400">
                    {e?.event_date && (
                      <span className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5" /> {fmtDate(e.event_date)}</span>
                    )}
                    {e?.location && (
                      <span className="flex items-center gap-1"><MdLocationOn className="h-3.5 w-3.5" /> {e.location}</span>
                    )}
                  </div>
                  {e?.capacity ? (
                    <div className="mt-auto pt-1">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1"><MdGroups className="h-3.5 w-3.5" /> {t("eventsPublic.spots_left", { count: Math.max(0, e.spots_left ?? 0) })}</span>
                        <span className="font-semibold text-green">{filledPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green transition-all duration-1000 ease-out"
                          style={{ width: inView ? `${filledPct}%` : "0%", transitionDelay: `${i * 100 + 400}ms` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
