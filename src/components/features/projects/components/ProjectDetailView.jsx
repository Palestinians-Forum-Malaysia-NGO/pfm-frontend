import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdAssignment,
  MdCalendarToday, MdPublic, MdPublicOff, MdPerson,
  MdCategory, MdInfoOutline, MdUpdate, MdAttachMoney,
  MdTrendingUp, MdPeople,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import DropdownButton from "components/ui/buttons/DropdownButton";
import StorageImage from "components/ui/StorageImage";
import ProjectDeleteModal from "./ProjectDeleteModal";
import MilestoneSection from "./MilestoneSection";
import UpdatesSection from "./UpdatesSection";
import {
  useGetProject, useDeleteProject, usePublishProject, useUnpublishProject,
} from "components/features/projects/hooks";
import { PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function ProjectDetailView() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { project, execute: fetchProject, loading, error } = useGetProject();
  const { execute: deleteProject,    loading: deleteLoading  } = useDeleteProject();
  const { execute: publishProject,   loading: publishing     } = usePublishProject();
  const { execute: unpublishProject                          } = useUnpublishProject();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchProject(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      success(t("projects.toast_deleted"), `"${project?.title}" ${t("projects.toast_deleted_sub")}`);
      navigate(`${base}/projects`);
    } catch (err) {
      toastError(t("projects.toast_delete_failed"), err?.message);
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (project.is_published) {
        await unpublishProject(id);
        success(t("projects.toast_unpublished"), `"${project.title}" ${t("projects.toast_unpublished_sub")}`);
      } else {
        await publishProject(id);
        success(t("projects.toast_published"), `"${project.title}" ${t("projects.toast_published_sub")}`);
      }
      fetchProject(id);
    } catch (err) {
      toastError(t("projects.toast_publish_failed"), err?.message);
    }
  };

  if (loading)  return <Loading text={t("projects.loading")} />;
  if (error)    return <AlertBanner message={error} />;
  if (!project) return null;

  const progressPct = parseFloat(project.progress_percentage) || 0;
  const clampedPct  = Math.min(100, Math.max(0, progressPct));
  const statusLabel = t(`projects.status_${project.status}`, { defaultValue: project.status });
  const categoryName = (project.category?.name_ar && i18n.language === "ar")
    ? project.category.name_ar
    : project.category?.name;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAssignment className="h-5 w-5" />}
        title={project.title}
        subtitle={t("projects.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("projects.back")} onClick={() => navigate(`${base}/projects`)} />
            <DropdownButton
              label={t("projects.actions")}
              items={[
                { label: t("projects.edit_project"),  icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/projects/${id}/edit`) },
                {
                  label: project.is_published ? t("projects.unpublish") : t("projects.publish"),
                  icon: project.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />,
                  onClick: handleTogglePublish,
                },
                { divider: true },
                { label: t("projects.delete_project"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {project.cover_image ? (
          <StorageImage fileKey={project.cover_image} alt={project.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
            <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
          </div>
        )}
        <div className="px-6 pb-6 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
            {project.title_ar && (
              <p className="mt-0.5 text-base font-semibold text-slate-500" dir="rtl">{project.title_ar}</p>
            )}
            {project.summary && <p className="mt-1 text-sm text-slate-500">{project.summary}</p>}
            {project.summary_ar && (
              <p className="mt-0.5 text-sm text-slate-400" dir="rtl">{project.summary_ar}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {statusLabel}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${project.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${project.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {project.is_published ? t("projects.live") : t("projects.draft")}
              </span>
              {categoryName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  <MdCategory className="h-3 w-3" /> {categoryName}
                </span>
              )}
            </div>
          </div>
          <Button
            variant={project.is_published ? "ghost" : "primary"}
            icon={project.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
            text={project.is_published ? t("projects.unpublish") : t("projects.publish")}
            loading={publishing}
            onClick={handleTogglePublish}
          />
        </div>
      </div>

      {/* ── Funding Stats ── */}
      {(project.target || project.amount_raised || project.total_beneficiaries_helped) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("projects.funding_impact")} subtitle={t("projects.funding_impact_sub")} />
          {project.target && (
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>{t("projects.funding_progress")}</span>
                <span className="font-semibold text-slate-700">{clampedPct.toFixed(1)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${clampedPct}%` }} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {project.target && (
              <InfoRow icon={<MdAttachMoney className="h-4 w-4" />} label={t("projects.target_info")} value={fmtMYR(project.target)} />
            )}
            {project.amount_raised && (
              <InfoRow icon={<MdTrendingUp className="h-4 w-4" />} label={t("projects.raised_info")} value={fmtMYR(project.amount_raised)} />
            )}
            {project.total_beneficiaries_helped && (
              <InfoRow icon={<MdPeople className="h-4 w-4" />} label={t("projects.beneficiaries_info")} value={project.total_beneficiaries_helped} />
            )}
          </div>
        </div>
      )}

      {/* ── Project Info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title={t("projects.project_info")} subtitle={t("projects.project_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("projects.start_date_info")}   value={fmtDate(project.start_date)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("projects.end_date_info")}     value={fmtDate(project.end_date)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("projects.created_by_info")}   value={project.created_by || "—"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("projects.last_updated_info")} value={fmtDate(project.updated_at)} />
        </div>
      </div>

      {/* ── Description ── */}
      {(project.description || project.description_ar || project.beneficiary_info || project.beneficiary_info_ar) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title={t("projects.description_section")} subtitle={t("projects.description_section_sub")} />

          {(project.description || project.description_ar) && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("projects.description_label")}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.description && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.description}</p>
                  </div>
                )}
                {project.description_ar && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3" dir="rtl">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.description_ar}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {(project.beneficiary_info || project.beneficiary_info_ar) && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t("projects.beneficiary_label")}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.beneficiary_info && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.beneficiary_info}</p>
                  </div>
                )}
                {project.beneficiary_info_ar && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3" dir="rtl">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.beneficiary_info_ar}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Milestones ── */}
      <MilestoneSection projectId={id} initialMilestones={project.milestones ?? []} />

      {/* ── Updates ── */}
      <UpdatesSection projectId={id} initialUpdates={project.updates ?? []} />

      <ProjectDeleteModal
        open={deleteOpen}
        project={project}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
