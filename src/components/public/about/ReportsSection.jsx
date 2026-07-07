import React from "react";
import { useTranslation } from "react-i18next";
import { MdDownload, MdPictureAsPdf, MdOpenInNew } from "react-icons/md";
import useInView from "hooks/useInView";

const ReportsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const REPORTS = [
    { year: "2024", title: t("about.report_annual_2024"),      type: "PDF", size: "2.4 MB",  highlight: true },
    { year: "2023", title: t("about.report_annual_2023"),      type: "PDF", size: "1.9 MB" },
    { year: "2023", title: t("about.report_gaza_emergency"),   type: "PDF", size: "850 KB" },
    { year: "2022", title: t("about.report_annual_2022"),      type: "PDF", size: "1.7 MB" },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-6">

        <div
          className="mb-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.accountability_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.reports_title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-400">
            {t("about.reports_desc")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {REPORTS.map((r, i) => (
            <div
              key={r.title}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md ${
                r.highlight
                  ? "border-green/20 bg-green/5"
                  : "border-slate-100 bg-slate-50 hover:bg-white"
              }`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.highlight ? "bg-green text-white" : "bg-slate-200 text-slate-500"}`}>
                <MdPictureAsPdf className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-900">{r.title}</p>
                <p className="text-xs text-slate-400">{r.year} · {r.type} · {r.size}</p>
              </div>
              {r.highlight && (
                <span className="shrink-0 rounded-full bg-green/10 px-2.5 py-0.5 text-[11px] font-bold text-green">{t("about.latest_badge")}</span>
              )}
              <a
                href="#"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ease-in-out hover:-translate-y-0.5 ${
                  r.highlight
                    ? "border-green/20 bg-green/10 text-green hover:bg-green hover:text-white"
                    : "border-slate-200 text-slate-400 hover:border-green/20 hover:text-green"
                }`}
              >
                <MdDownload className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        <div
          className="mt-6 text-center"
          style={{ opacity: inView ? 1 : 0, transition: "all 0.7s ease-in-out", transitionDelay: "320ms" }}
        >
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("about.view_all_publications")} <MdOpenInNew className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default ReportsSection;
