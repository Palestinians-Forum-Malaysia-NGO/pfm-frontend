import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLocationOn, MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";

const UpcomingEvents = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const EVENTS = [
    { date: { day: "15", month: "Jul" }, title: "Palestine Solidarity March KL", location: "Dataran Merdeka, KL",   type: t("home.event1_type"), color: "bg-red-50 text-red-500 border-red-100" },
    { date: { day: "22", month: "Jul" }, title: "Fundraising Gala Dinner 2025",  location: "Grand Ballroom, KL",    type: t("home.event2_type"), color: "bg-green/10 text-green border-green/20" },
    { date: { day: "05", month: "Aug" }, title: "Youth Leadership Workshop",     location: "PFM Community Centre",  type: t("home.event3_type"), color: "bg-blue-50 text-blue-600 border-blue-100" },
  ];

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
          {EVENTS.map((e, i) => (
            <div
              key={e.title}
              className="flex items-center gap-5 rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-50 text-center">
                <span className="text-xl font-black leading-none text-slate-900">{e.date.day}</span>
                <span className="text-[11px] font-bold uppercase text-slate-400">{e.date.month}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-slate-900">{e.title}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                  <MdLocationOn className="h-3.5 w-3.5 shrink-0" />
                  {e.location}
                </p>
              </div>
              <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${e.color}`}>{e.type}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
