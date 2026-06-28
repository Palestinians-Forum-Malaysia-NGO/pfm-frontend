import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdAssignment, MdCalendarToday, MdCategory,
  MdAttachMoney, MdTrendingUp, MdPeople, MdFlag,
  MdRadioButtonUnchecked, MdCheck, MdPerson, MdCampaign,
} from "react-icons/md";
import { useGetProject } from "components/features/projects/hooks";
import StorageImage from "components/ui/StorageImage";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";
import Loading from "components/loading/Loading";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export default function ProjectPublicDetail() {
  const { slug } = useParams();
  const navigate  = useNavigate();

  const { project, execute: fetchProject, loading, error } = useGetProject();

  useEffect(() => { fetchProject(slug); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text="Loading project…" />;

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdAssignment className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">Project not found</h2>
        <p className="mb-6 text-sm text-slate-400">This project may have been removed or is not yet published.</p>
        <button onClick={() => navigate("/projects")} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> Back to Projects
        </button>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.max(0, parseFloat(project.progress_percentage) || 0));

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <div className="relative">
        {project.cover_image ? (
          <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
            <StorageImage fileKey={project.cover_image} alt={project.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
            {/* Breadcrumb — top of hero */}
            <div className="absolute left-0 right-0 top-0 px-6 pt-5 sm:px-8">
              <div className="mx-auto max-w-4xl">
                <button
                  onClick={() => navigate("/projects")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-black/40"
                >
                  <MdArrowBack className="h-3.5 w-3.5" /> Projects
                </button>
              </div>
            </div>
            {/* Title — bottom of hero */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-7 sm:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                    {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                  </span>
                  {project.category?.name && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      <MdCategory className="h-3.5 w-3.5" /> {project.category.name}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">{project.title}</h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-green to-green-700">
            <div className="absolute inset-0 bg-dot-white bg-[size:24px_24px] opacity-10" />
            {/* Breadcrumb — top */}
            <div className="absolute left-0 right-0 top-0 px-6 pt-5 sm:px-8">
              <div className="mx-auto max-w-4xl">
                <button
                  onClick={() => navigate("/projects")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-150 hover:bg-white/25"
                >
                  <MdArrowBack className="h-3.5 w-3.5" /> Projects
                </button>
              </div>
            </div>
            {/* Title — bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 sm:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="mb-2 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white/10 text-white border-white/20`}>
                    {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                  </span>
                  {project.category?.name && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white">
                      <MdCategory className="h-3.5 w-3.5" /> {project.category.name}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{project.title}</h1>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">

          {/* Left column — details */}
          <div className="flex-1 min-w-0">

            {/* Summary */}
            {project.summary && (
              <p className="mb-6 text-lg font-medium text-slate-600 leading-relaxed">{project.summary}</p>
            )}

            {/* Dates */}
            {(project.start_date || project.end_date) && (
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-500">
                {project.start_date && (
                  <span className="flex items-center gap-1.5">
                    <MdCalendarToday className="h-4 w-4 text-green" />
                    Started: {fmtDate(project.start_date)}
                  </span>
                )}
                {project.end_date && (
                  <span className="flex items-center gap-1.5">
                    <MdCalendarToday className="h-4 w-4 text-slate-400" />
                    Ends: {fmtDate(project.end_date)}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {project.description && (
              <div className="mb-8">
                <h2 className="mb-3 text-lg font-bold text-slate-900">About This Project</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            )}

            {/* Beneficiary Info */}
            {project.beneficiary_info && (
              <div className="mb-8 rounded-2xl border border-green/20 bg-green/5 p-5">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green">
                  <MdPeople className="h-4 w-4" /> Who Benefits
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{project.beneficiary_info}</p>
              </div>
            )}

            {/* Milestones (read-only) */}
            {project.milestones?.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MdFlag className="h-5 w-5 text-green" /> Milestones
                </h2>
                <div className="flex flex-col divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
                  {project.milestones.map((m) => (
                    <div key={m.id} className="flex items-start gap-3 px-5 py-4">
                      <div className="mt-0.5 shrink-0">
                        {m.is_completed
                          ? <MdCheck className="h-5 w-5 text-green" />
                          : <MdRadioButtonUnchecked className="h-5 w-5 text-slate-300" />
                        }
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${m.is_completed ? "line-through text-slate-400" : "text-slate-900"}`}>{m.title}</p>
                        {m.description && <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>}
                        {m.target_date && <p className="mt-0.5 text-xs text-slate-400">Target: {fmtDate(m.target_date)}</p>}
                        {m.percentage && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-green" style={{ width: `${Math.min(100, parseFloat(m.percentage) || 0)}%` }} />
                            </div>
                            <span className="text-xs font-medium text-green">{parseFloat(m.percentage).toFixed(0)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Updates (read-only) */}
            {project.updates?.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <MdCampaign className="h-5 w-5 text-green" /> Latest Updates
                </h2>
                <div className="flex flex-col gap-4">
                  {project.updates.map((u) => (
                    <div key={u.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                        <MdPerson className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          {u.posted_by && <span className="text-xs font-semibold text-slate-700">{u.posted_by}</span>}
                          {u.created_at && <span className="text-xs text-slate-400">{fmtDate(u.created_at)}</span>}
                        </div>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{u.body}</p>
                        {u.photo && (
                          <img src={u.photo} alt="Update" className="mt-3 max-h-56 rounded-xl object-cover border border-slate-100" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar — funding stats */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-slate-900">Project Progress</h3>

              {project.target ? (
                <>
                  <div className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                      <span>Funding raised</span>
                      <span className="font-bold text-green">{progressPct.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><MdTrendingUp className="h-3.5 w-3.5" /> Raised</span>
                    <span className="text-sm font-bold text-slate-900">{fmtMYR(project.amount_raised) ?? "—"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><MdAttachMoney className="h-3.5 w-3.5" /> Target</span>
                    <span className="text-sm font-bold text-slate-900">{fmtMYR(project.target)}</span>
                  </div>
                </>
              ) : (
                <p className="mb-4 text-xs text-slate-400">Funding target not set.</p>
              )}

              {project.total_beneficiaries_helped && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1"><MdPeople className="h-3.5 w-3.5" /> Beneficiaries helped</span>
                  <span className="text-sm font-bold text-slate-900">{project.total_beneficiaries_helped}</span>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                {project.start_date && <p className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5" /> Started: {fmtDate(project.start_date)}</p>}
                {project.end_date   && <p className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5 text-slate-300" /> Ends: {fmtDate(project.end_date)}</p>}
                {project.category?.name && <p className="flex items-center gap-1"><MdCategory className="h-3.5 w-3.5" /> {project.category.name}</p>}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
