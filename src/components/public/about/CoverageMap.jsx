import React from "react";
import { useTranslation } from "react-i18next";
import { MdLocationOn } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetBranches } from "components/features/branches/hooks";

const CoverageMap = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView();
  const { branches: allBranches, loading } = useGetBranches();

  const branches = allBranches.filter((b) => b.is_active);

  if (!loading && branches.length === 0) return null;

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center transition-all duration-700 ease-in-out"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.coverage_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.coverage_title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-400">
            {t("about.coverage_desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : branches).map((b, i) => (
            <div
              key={b?.id ?? i}
              className={`flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md transition-[opacity,transform] duration-700 ease-in-out ${
                i === 0
                  ? "border-2 border-green/20 bg-green/5"
                  : "border border-slate-200 bg-white"
              }`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${i === 0 ? "bg-green text-white" : "bg-green/10 text-green"}`}>
                <MdLocationOn className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {b ? ((b.name_ar && i18n.language === "ar") ? b.name_ar : b.name) : "—"}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoverageMap;
