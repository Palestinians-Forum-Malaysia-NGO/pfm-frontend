import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch, MdClose, MdAssignment, MdCalendarToday, MdCategory, MdTrendingUp } from "react-icons/md";
import { useGetProjects } from "components/features/projects/hooks";
import StorageImage from "components/ui/StorageImage";
import { PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { month: "short", year: "numeric" }) : null;

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

function ProjectCard({ project, onClick, statusLabels }) {
  const { t } = useTranslation();
  const pct = Math.min(100, Math.max(0, parseFloat(project.progress_percentage) || 0));

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-md active:scale-[0.99]"
    >
      {/* Cover */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100">
        {project.cover_image ? (
          <StorageImage
            fileKey={project.cover_image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green/10 to-green-50">
            <MdAssignment className="h-12 w-12 text-green/30" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
            {statusLabels[project.status] ?? project.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {project.category?.name && (
          <span className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-green">
            <MdCategory className="h-3.5 w-3.5" /> {project.category.name}
          </span>
        )}
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold text-slate-900 group-hover:text-green transition-colors duration-150">
          {project.title}
        </h3>
        {project.summary && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-500">{project.summary}</p>
        )}

        {/* Progress */}
        {project.target && (
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><MdTrendingUp className="h-3.5 w-3.5" /> {t("projects.public_raised")}</span>
              <span className="font-semibold text-green">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            {fmtMYR(project.target) && (
              <p className="mt-1 text-xs text-slate-400">{t("projects.target_prefix")} {fmtMYR(project.target)}</p>
            )}
          </div>
        )}

        {/* Footer */}
        {project.start_date && (
          <div className="mt-auto flex items-center gap-1 text-xs text-slate-400">
            <MdCalendarToday className="h-3.5 w-3.5" />
            <span>{fmtDate(project.start_date)}{project.end_date ? ` – ${fmtDate(project.end_date)}` : ""}</span>
          </div>
        )}
      </div>
    </button>
  );
}

export default function ProjectPublicList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projects: allProjects, loading } = useGetProjects();

  const statusLabels = {
    active:    t("projects.status_active"),
    completed: t("projects.status_completed"),
    on_hold:   t("projects.status_on_hold"),
    cancelled: t("projects.status_cancelled"),
  };

  const [search, setSearch] = useState("");

  const projects = useMemo(() => {
    if (!search.trim()) return allProjects;
    const q = search.toLowerCase();
    return allProjects.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.summary?.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
  }, [allProjects, search]);

  const hasSearch = search !== "";

  const activeCount = allProjects.filter((p) => p.status === "active").length;

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green to-green-700">
        <div className="absolute inset-0 bg-dot-white bg-[size:28px_28px] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {t("projects.public_active_projects", { count: activeCount })}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("projects.public_hero_title")}
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg leading-relaxed">
              {t("projects.public_hero_subtitle")}
            </p>
          </div>
        </div>
      </div>

    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Search */}
      <div className="mb-8 flex items-center gap-2">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("projects.public_search_placeholder")}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder:text-slate-400"
          />
        </div>
        {hasSearch && (
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <MdClose className="h-4 w-4" /> {t("projects.clear")}
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 h-80" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center">
          <MdAssignment className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="text-slate-500">{hasSearch ? t("projects.public_no_match") : t("projects.public_no_projects")}</p>
          {hasSearch && (
            <button onClick={() => setSearch("")} className="mt-4 text-sm font-medium text-green hover:underline">{t("projects.clear")}</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              statusLabels={statusLabels}
              onClick={() => navigate(`/projects/${p.slug}`)}
            />
          ))}
        </div>
      )}
    </section>
    </div>
  );
}
