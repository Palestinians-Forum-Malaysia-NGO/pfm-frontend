import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetProjects } from "components/features/projects/hooks";
import StorageImage from "components/ui/StorageImage";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (!n) return null;
  return `RM ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  const { projects: allProjects, loading } = useGetProjects();

  const featured = [...allProjects]
    .sort((a, b) => (parseFloat(b.progress_percentage) || 0) - (parseFloat(a.progress_percentage) || 0))
    .slice(0, 3);

  if (!loading && featured.length === 0) return null;

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">

        <div
          className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.our_work")}</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{t("home.featured_projects")}</h2>
          </div>
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("home.view_all")} <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : featured).map((p, i) => {
            const pct = Math.min(100, Math.max(0, parseFloat(p?.progress_percentage) || 0));
            return (
              <div
                key={p?.id ?? i}
                onClick={p ? () => navigate(`/projects/${p.slug}`) : undefined}
                className={`group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-in-out ${p ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""}`}
                style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, box-shadow 0.3s ease-in-out", transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {p?.cover_image && (
                    <StorageImage fileKey={p.cover_image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                  )}
                  {p?.category?.name && (
                    <span className="absolute left-3 top-3 rounded-full bg-green/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      {p.category.name}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-bold text-slate-900">{p ? p.title : "—"}</h3>
                  {p?.summary && <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">{p.summary}</p>}
                  <div className="mt-auto">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                      <span>{t("home.raised")}: <span className="font-bold text-slate-800">{fmtMYR(p?.amount_raised) ?? "—"}</span></span>
                      <span>{Math.round(pct)}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-green transition-all duration-1000 ease-out"
                        style={{ width: inView ? `${pct}%` : "0%", transitionDelay: `${i * 100 + 400}ms` }}
                      />
                    </div>
                    {p?.target && <p className="mt-1 text-right text-[11px] text-slate-400">{t("home.goal")}: {fmtMYR(p.target)}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProjects;
