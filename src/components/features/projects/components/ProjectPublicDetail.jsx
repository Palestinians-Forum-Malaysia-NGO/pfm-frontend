import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack, MdAssignment, MdCalendarToday, MdCategory,
  MdAttachMoney, MdTrendingUp, MdPeople, MdFlag,
  MdRadioButtonUnchecked, MdCheck, MdCampaign, MdRateReview, MdLogin, MdPhotoLibrary,
} from "react-icons/md";
import { useGetProject, useGetProjects } from "components/features/projects/hooks";
import StorageImage from "components/ui/StorageImage";
import { PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";
import Loading from "components/loading/Loading";
import FeedbackForm from "components/public/projects/FeedbackForm";
import useAuth from "components/features/auth/hooks/useAuth";
import { ROLES } from "components/features/auth/types";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

const fmtMonthYear = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { month: "short", year: "numeric" }) : null;

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return null;
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export default function ProjectPublicDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate  = useNavigate();

  const { project, execute: fetchProject, loading, error } = useGetProject();
  const { projects: allProjects } = useGetProjects();
  const { user, isAuthenticated } = useAuth();
  const isBeneficiary = isAuthenticated && user?.role === ROLES.BENEFICIARY;

  const statusLabels = {
    active:    t("projects.status_active"),
    completed: t("projects.status_completed"),
    on_hold:   t("projects.status_on_hold"),
    cancelled: t("projects.status_cancelled"),
  };

  useEffect(() => { fetchProject(slug); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text={t("projects.public_loading")} />;

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdAssignment className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">{t("projects.public_not_found_title")}</h2>
        <p className="mb-6 text-sm text-slate-400">{t("projects.public_not_found_body")}</p>
        <button onClick={() => navigate("/projects")} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> {t("projects.public_back_to_projects")}
        </button>
      </div>
    );
  }

  const progressPct = Math.min(100, Math.max(0, parseFloat(project.progress_percentage) || 0));
  const moreProjects = allProjects
    .filter((p) => p.slug !== project.slug && p.status === "active")
    .slice(0, 3);

  return (
    <div className="bg-white">
      {/* ── Hero — plain full-bleed image, no overlay or text ── */}
      {project.cover_image && (
        <div className="h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
          <StorageImage fileKey={project.cover_image} alt={project.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* ── Header block ── */}
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-green"
        >
          <MdArrowBack className="h-4 w-4" /> {t("projects.public_breadcrumb")}
        </button>

        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              {statusLabels[project.status] ?? project.status}
            </span>
            {project.category?.name && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
                <MdCategory className="h-3.5 w-3.5" /> {project.category.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          {(project.start_date || project.end_date) && (
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-slate-400">
              {project.start_date && fmtDate(project.start_date)}
              {project.end_date ? ` – ${fmtDate(project.end_date)}` : ""}
            </p>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">

          {/* Left column — editorial reading column */}
          <div className="min-w-0 flex-1">
            <div className="max-w-3xl">

              {/* Summary */}
              {project.summary && (
                <p className="mb-10 text-lg font-medium leading-relaxed text-slate-600">{project.summary}</p>
              )}

              {/* Description */}
              {project.description && (
                <div className="mb-12">
                  <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-green">
                    {t("projects.public_about_project")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}

              {/* Beneficiary Info */}
              {project.beneficiary_info && (
                <div className="mb-12 rounded-2xl border border-green/20 bg-green/5 p-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green">
                    <MdPeople className="h-4 w-4" /> {t("projects.public_who_benefits")}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{project.beneficiary_info}</p>
                </div>
              )}

              {/* Milestones (read-only) */}
              {project.milestones?.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <MdFlag className="h-5 w-5 text-green" /> {t("projects.milestones_title")}
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
                          {m.target_date && <p className="mt-0.5 text-xs text-slate-400">{t("projects.target_prefix")} {fmtDate(m.target_date)}</p>}
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

              {/* Updates (read-only) — image + caption, editorial style */}
              {project.updates?.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <MdCampaign className="h-5 w-5 text-green" /> {t("projects.public_latest_updates")}
                  </h2>
                  <div className="flex flex-col gap-10">
                    {project.updates.map((u) => (
                      <div key={u.id}>
                        {u.photo && (
                          <StorageImage fileKey={u.photo} alt={t("projects.update_alt")} className="mb-3 max-h-[420px] w-full rounded-2xl object-cover" />
                        )}
                        <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{u.body}</p>
                        {(u.posted_by || u.created_at) && (
                          <p className="mt-2 text-xs text-slate-400">
                            {u.posted_by}
                            {u.posted_by && u.created_at ? " · " : ""}
                            {u.created_at && fmtDate(u.created_at)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery (read-only) — photo grid */}
              {project.gallery?.length > 0 && (
                <div className="mb-12">
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <MdPhotoLibrary className="h-5 w-5 text-green" /> {t("projects.gallery_title")}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {project.gallery.map((p) => p.image?.public_url && (
                      <a
                        key={p.id}
                        href={p.image.public_url}
                        target="_blank"
                        rel="noreferrer"
                        className="group block overflow-hidden rounded-xl bg-slate-100"
                        title={p.caption || ""}
                      >
                        <img
                          src={p.image.public_url}
                          alt={p.caption || t("projects.gallery_title")}
                          className="h-40 w-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105 sm:h-52"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback — beneficiaries only */}
              {(isBeneficiary || !isAuthenticated) && (
                <div>
                  <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <MdRateReview className="h-5 w-5 text-green" /> {t("feedback.section_title")}
                  </h2>
                  {isBeneficiary ? (
                    <FeedbackForm projectId={project.id} fullName={user.full_name} />
                  ) : (
                    <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
                        <MdLogin className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-slate-600">{t("feedback.signin_prompt")}</p>
                      <Link
                        to="/auth/sign-in"
                        className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90"
                      >
                        {t("feedback.signin_cta")}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar — funding stats */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-100">
              <div className="h-1 w-full bg-green" />
              <div className="p-5">
                <h3 className="mb-4 text-base font-bold text-slate-900">{t("projects.public_progress_title")}</h3>

                {project.target ? (
                  <>
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                        <span>{t("projects.public_funding_raised")}</span>
                        <span className="font-bold text-green">{progressPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MdTrendingUp className="h-3.5 w-3.5" /> {t("projects.public_raised")}</span>
                      <span className="text-sm font-bold text-slate-900">{fmtMYR(project.amount_raised) ?? "—"}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <span className="text-xs text-slate-400 flex items-center gap-1"><MdAttachMoney className="h-3.5 w-3.5" /> {t("projects.public_target")}</span>
                      <span className="text-sm font-bold text-slate-900">{fmtMYR(project.target)}</span>
                    </div>
                  </>
                ) : (
                  <p className="mb-4 text-xs text-slate-400">{t("projects.public_funding_not_set")}</p>
                )}

                {project.total_beneficiaries_helped && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><MdPeople className="h-3.5 w-3.5" /> {t("projects.public_beneficiaries_helped")}</span>
                    <span className="text-sm font-bold text-slate-900">{project.total_beneficiaries_helped}</span>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                  {project.start_date && <p className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5" /> {t("projects.public_started_prefix")} {fmtDate(project.start_date)}</p>}
                  {project.end_date   && <p className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5 text-slate-300" /> {t("projects.public_ends_prefix")} {fmtDate(project.end_date)}</p>}
                  {project.category?.name && <p className="flex items-center gap-1"><MdCategory className="h-3.5 w-3.5" /> {project.category.name}</p>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── More Projects ── */}
      {moreProjects.length > 0 && (
        <div className="border-t border-slate-100 bg-slate-50 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 flex items-center gap-2 text-2xl font-extrabold text-slate-900">
              <MdAssignment className="h-5 w-5 text-green" /> {t("projects.public_more_projects")}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {moreProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.slug}`)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-40 w-full shrink-0 overflow-hidden bg-slate-100">
                    {p.cover_image ? (
                      <StorageImage
                        fileKey={p.cover_image}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <MdAssignment className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-1 line-clamp-2 text-sm font-bold text-slate-900 transition-colors duration-150 group-hover:text-green">
                      {p.title}
                    </h3>
                    {p.start_date && <p className="mt-auto text-xs text-slate-400">{fmtMonthYear(p.start_date)}</p>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
