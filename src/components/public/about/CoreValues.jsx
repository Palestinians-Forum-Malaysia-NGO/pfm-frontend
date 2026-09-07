import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";

const CoreValues = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const VALUES = [
    { num: "01", title: t("about.value_justice_title"),      desc: t("about.value_justice_desc") },
    { num: "02", title: t("about.value_solidarity_title"),   desc: t("about.value_solidarity_desc") },
    { num: "03", title: t("about.value_transparency_title"), desc: t("about.value_transparency_desc") },
    { num: "04", title: t("about.value_action_title"),       desc: t("about.value_action_desc") },
  ];

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.values_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.values_title")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Background number watermark */}
              <span className="pointer-events-none absolute -right-2 -top-2 select-none text-7xl font-black text-slate-100 transition-colors duration-200 group-hover:text-green/10">
                {v.num}
              </span>
              <span className="text-3xl font-black text-green/20">{v.num}</span>
              <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreValues;
