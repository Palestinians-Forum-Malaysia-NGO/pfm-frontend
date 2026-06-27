import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ProjectDeleteModal from "./ProjectDeleteModal";
import MilestoneSection from "./MilestoneSection";
import UpdatesSection from "./UpdatesSection";
import {
  useGetProject, useDeleteProject, usePublishProject, useUnpublishProject,
} from "components/features/projects/hooks";
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function ProjectDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { project, execute: fetchProject, loading, error } = useGetProject();
  const { execute: deleteProject,   loading: deleteLoading  } = useDeleteProject();
  const { execute: publishProject,  loading: publishing     } = usePublishProject();
  const { execute: unpublishProject                         } = useUnpublishProject();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchProject(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      success("Project deleted", `"${project?.title}" has been removed.`);
      navigate(`${base}/projects`);
    } catch (err) {
      toastError("Failed to delete project", err?.message);
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (project.is_published) {
        await unpublishProject(id);
        success("Unpublished", `"${project.title}" is now hidden from the public.`);
      } else {
        await publishProject(id);
        success("Published", `"${project.title}" is now live.`);
      }
      fetchProject(id);
    } catch (err) {
      toastError("Failed to update publish status", err?.message);
    }
  };

  if (loading) return <Loading text="Loading project…" />;
  if (error)   return <AlertBanner message={error} />;
  if (!project) return null;

  const progressPct = parseFloat(project.progress_percentage) || 0;
  const clampedPct  = Math.min(100, Math.max(0, progressPct));

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAssignment className="h-5 w-5" />}
        title={project.title}
        subtitle="Project Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Projects" onClick={() => navigate(`${base}/projects`)} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Project",  icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/projects/${id}/edit`) },
                {
                  label: project.is_published ? "Unpublish" : "Publish",
                  icon: project.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />,
                  onClick: handleTogglePublish,
                },
                { divider: true },
                { label: "Delete Project", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {project.cover_image ? (
          <img src={project.cover_image} alt={project.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-28 w-full" style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}>
            <div className="h-full w-full opacity-40" style={{ backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          </div>
        )}
        <div className="px-6 pb-6 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{project.title}</h2>
            {project.summary && <p className="mt-1 text-sm text-slate-500">{project.summary}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${PROJECT_STATUS_BADGE[project.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {PROJECT_STATUS_LABELS[project.status] ?? project.status}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${project.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${project.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {project.is_published ? "Live" : "Draft"}
              </span>
              {project.category?.name && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  <MdCategory className="h-3 w-3" /> {project.category.name}
                </span>
              )}
            </div>
          </div>
          <Button
            variant={project.is_published ? "ghost" : "primary"}
            icon={project.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
            text={project.is_published ? "Unpublish" : "Publish"}
            loading={publishing}
            onClick={handleTogglePublish}
          />
        </div>
      </div>

      {/* ── Funding Stats ── */}
      {(project.target || project.amount_raised || project.total_beneficiaries_helped) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title="Funding & Impact" subtitle="Progress towards target and beneficiaries reached" />
          {project.target && (
            <div className="mb-4">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Funding Progress</span>
                <span className="font-semibold text-slate-700">{clampedPct.toFixed(1)}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${clampedPct}%` }} />
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {project.target && (
              <InfoRow icon={<MdAttachMoney className="h-4 w-4" />} label="Target" value={fmtMYR(project.target)} />
            )}
            {project.amount_raised && (
              <InfoRow icon={<MdTrendingUp className="h-4 w-4" />} label="Amount Raised" value={fmtMYR(project.amount_raised)} />
            )}
            {project.total_beneficiaries_helped && (
              <InfoRow icon={<MdPeople className="h-4 w-4" />} label="Beneficiaries Helped" value={project.total_beneficiaries_helped} />
            )}
          </div>
        </div>
      )}

      {/* ── Project Info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title="Project Information" subtitle="Dates, team, and metadata" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Start Date"   value={fmtDate(project.start_date)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="End Date"     value={fmtDate(project.end_date)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Created By"   value={project.created_by || "—"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Last Updated" value={fmtDate(project.updated_at)} />
        </div>
      </div>

      {/* ── Description ── */}
      {(project.description || project.beneficiary_info) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title="Description" subtitle="Full project description and beneficiary details" />
          {project.description && (
            <div className="mb-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Description</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}
          {project.beneficiary_info && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Beneficiary Information</p>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{project.beneficiary_info}</p>
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
