import React from "react";
import { useTranslation } from "react-i18next";
import { MdCategory } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetProjects } from "components/features/projects/hooks";

const ICON_COLORS = [
  "bg-blue-50 text-blue-600",
  "bg-green/10 text-green",
  "bg-red-50 text-red-500",
  "bg-purple-50 text-purple-600",
  "bg-amber-50 text-amber-600",
];

const ProjectCategories = () => {
  const { t, i18n } = useTranslation();
  const [ref, inView] = useInView();
  const { projects: allProjects, loading } = useGetProjects();

  const byCategory = new Map();
  allProjects.forEach((p) => {
    if (!p.category?.slug) return;
    const existing = byCategory.get(p.category.slug);
    if (existing) existing.count += 1;
    else byCategory.set(p.category.slug, { ...p.category, count: 1 });
  });
  const categories = [...byCategory.values()].sort((a, b) => b.count - a.count).slice(0, 5);

  if (!loading && categories.length === 0) return null;

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.what_we_do")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("home.focus_areas")}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {(loading ? Array.from({ length: 5 }) : categories).map((c, i) => (
            <div
              key={c?.slug ?? i}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 70}ms` }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ICON_COLORS[i % ICON_COLORS.length]}`}>
                <MdCategory className="h-7 w-7" />
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight">
                {c ? ((c.name_ar && i18n.language === "ar") ? c.name_ar : c.name) : "—"}
              </p>
              {c && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">
                  {t("home.project_count", { count: c.count })}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCategories;
