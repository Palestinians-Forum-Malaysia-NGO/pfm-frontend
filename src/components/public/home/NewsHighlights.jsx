import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import img1 from "assets/img/gallery/gallery-6.jpg";
import img2 from "assets/img/gallery/gallery-23.jpg";
import img3 from "assets/img/gallery/gallery-15.jpg";

const NEWS = [
  { img: img1, date: "10 Jun 2025", tag: "Announcement", title: "PFM Launches New Scholarship Programme for Palestinian Students in Malaysia" },
  { img: img2, date: "02 Jun 2025", tag: "Campaign",     title: "Ramadan Relief Drive Exceeds Target — Over RM 80,000 Raised in 30 Days" },
  { img: img3, date: "25 May 2025", tag: "Event",        title: "1,000 Attendees Join PFM Annual Solidarity Dinner in Kuala Lumpur" },
];

const NewsHighlights = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.latest")}</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{t("home.news_updates")}</h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("home.all_news")} <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {NEWS.map((n, i) => (
            <article
              key={n.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, box-shadow 0.3s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={n.img} alt={n.title} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
                  {n.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-[11px] font-semibold text-slate-400">{n.date}</p>
                <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-green transition-colors duration-200">{n.title}</h3>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-green">
                  {t("home.read_more")} <MdArrowForward className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsHighlights;
