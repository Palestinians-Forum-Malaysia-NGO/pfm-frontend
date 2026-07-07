import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";

const PARTNERS = [
  { name: "Islamic Relief Malaysia",   short: "IRM",  color: "bg-green/10 text-green" },
  { name: "AMAN Palestine",            short: "AP",   color: "bg-blue-50 text-blue-600" },
  { name: "MERCY Malaysia",            short: "MM",   color: "bg-red-50 text-red-500" },
  { name: "UNRWA Malaysia",            short: "UN",   color: "bg-amber-50 text-amber-600" },
  { name: "Palestinian Red Crescent",  short: "PRC",  color: "bg-red-50 text-red-500" },
  { name: "Majlis Agama Islam KL",     short: "MAIK", color: "bg-green/10 text-green" },
  { name: "Pertubuhan IKRAM Malaysia", short: "IKRAM",color: "bg-purple-50 text-purple-600" },
  { name: "Aman Palestine Malaysia",   short: "APM",  color: "bg-blue-50 text-blue-600" },
];

const PartnersGallery = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.partners_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.partners_title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-400">
            {t("about.partners_desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PARTNERS.map((p, i) => (
            <div
              key={p.name}
              title={p.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-green/20 hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-sm font-black shadow-sm ${p.color}`}>
                {p.short}
              </div>
              <p className="text-[11px] font-medium leading-tight text-slate-500">{p.name}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PartnersGallery;
