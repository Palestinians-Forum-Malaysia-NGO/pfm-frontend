import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdClose, MdAssignment, MdCalendarToday, MdCategory, MdTrendingUp } from "react-icons/md";
import { useGetProjects } from "components/features/projects/hooks";
import StorageImage from "components/ui/StorageImage";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_BADGE, PROJECT_STATUS_OPTIONS } from "components/features/projects/constants/projects";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { month: "short", year: "numeric" }) : null;

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

function ProjectCard({ project, onClick }) {
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
          <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, #007A3D18 0%, #e2f5eb 100%)" }}>
            <MdAssignment className="h-12 w-12 text-green/30" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
            {PROJECT_STATUS_LABELS[project.status] ?? project.status}
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
              <span className="flex items-center gap-1"><MdTrendingUp className="h-3.5 w-3.5" /> Raised</span>
              <span className="font-semibold text-green">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            {fmtMYR(project.target) && (
              <p className="mt-1 text-xs text-slate-400">Target: {fmtMYR(project.target)}</p>
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

const STATUS_FILTER_OPTIONS = [
  { value: "all",       label: "All Projects" },
  ...PROJECT_STATUS_OPTIONS.filter((o) => o.value),
];

export default function ProjectPublicList() {
  const navigate = useNavigate();
  const { projects: allProjects, loading } = useGetProjects();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const projects = useMemo(() => {
    let list = allProjects;
    if (statusFilter !== "all") list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.title?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allProjects, search, statusFilter]);

  const hasFilters = search !== "" || statusFilter !== "all";

  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const activeCount = allProjects.filter((p) => p.status === "active").length;

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #007A3D 0%, #005a2e 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #ffffff22 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {activeCount} Active {activeCount === 1 ? "Project" : "Projects"}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
              Our Community Projects
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg leading-relaxed">
              Real initiatives, real impact — supporting Palestinians and communities across Malaysia and beyond.
            </p>
          </div>
        </div>
      </div>

    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-green focus:ring-2 focus:ring-green/20"
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MdClose className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
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
          <p className="text-slate-500">{hasFilters ? "No projects match your filters." : "No projects available yet."}</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 text-sm font-medium text-green hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onClick={() => navigate(`/projects/${p.slug}`)}
            />
          ))}
        </div>
      )}
    </section>
    </div>
  );
}
