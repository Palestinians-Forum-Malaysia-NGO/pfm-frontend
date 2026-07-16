import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdWork,
  MdLocationOn, MdPeople, MdPublic, MdLock, MdPerson,
  MdCalendarToday, MdCategory, MdGroups,
} from "react-icons/md";
import Button       from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FormHeader    from "components/ui/form/FormHeader";
import InfoRow       from "components/ui/InfoRow";
import AlertBanner   from "components/ui/AlertBanner";
import Loading       from "components/loading/Loading";
import OpportunityDeleteModal from "./OpportunityDeleteModal";
import OpportunityApplicationsSection from "components/features/opportunityApplications/components/OpportunityApplicationsSection";
import { useGetOpportunity, useDeleteOpportunity } from "components/features/opportunities/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function OpportunityDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { opportunity, execute: fetchOpportunity, loading, error } = useGetOpportunity();
  const { execute: deleteOpportunity, loading: deleteLoading, error: deleteError } = useDeleteOpportunity();
  const { success, error: toastError } = useToast();

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchOpportunity(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteOpportunity(id);
      success(t("opportunities.toast_deleted"), `${opportunity?.title} ${t("opportunities.toast_deleted_sub")}`);
      navigate(`${base}/opportunities`);
    } catch (err) {
      toastError(t("opportunities.toast_delete_failed"), err?.message);
    }
  };

  if (loading)      return <Loading text={t("opportunities.loading")} />;
  if (error)        return <AlertBanner message={error} />;
  if (!opportunity) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdWork className="h-5 w-5" />}
        title={opportunity.title}
        subtitle={t("opportunities.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("opportunities.back")} onClick={() => navigate(`${base}/opportunities`)} />
            <Button variant="ghost" icon={<MdEdit className="h-4 w-4" />} text={t("opportunities.edit")} onClick={() => navigate(`${base}/opportunities/${id}/edit`)} />
            <Button variant="danger" icon={<MdDeleteOutline className="h-4 w-4" />} text={t("opportunities.delete")} onClick={() => setDeleteOpen(true)} />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Status + description ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-semibold text-green">
            <MdCategory className="h-3.5 w-3.5" /> {t(`opportunities.type_${opportunity.type}`, { defaultValue: opportunity.type })}
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
            opportunity.for_public ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
          }`}>
            {opportunity.for_public ? <MdPublic className="h-3.5 w-3.5" /> : <MdLock className="h-3.5 w-3.5" />}
            {opportunity.for_public ? t("opportunities.visibility_public") : t("opportunities.visibility_private")}
          </span>
        </div>
        <FormHeader icon={<MdWork className="h-5 w-5" />} title={t("opportunities.section_description")} subtitle={t("opportunities.section_description_sub")} />
        <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{opportunity.description}</p>
      </div>

      {/* ── Details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPeople className="h-5 w-5" />} title={t("opportunities.section_details")} subtitle={t("opportunities.section_details_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}  label={t("opportunities.info_location")}     value={t(`opportunities.location_${opportunity.location}`, { defaultValue: opportunity.location })} />
          <InfoRow icon={<MdPeople className="h-4 w-4" />}      label={t("opportunities.info_positions")}    value={opportunity.available_positions} />
          <InfoRow icon={<MdGroups className="h-4 w-4" />}      label={t("opportunities.info_applications")} value={opportunity.applications_count ?? 0} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}      label={t("opportunities.info_created_by")}   value={opportunity.created_by ?? "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("opportunities.info_created")}    value={fmtDate(opportunity.created_at)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("opportunities.info_updated")}    value={fmtDate(opportunity.updated_at)} />
        </div>
      </div>

      <OpportunityApplicationsSection opportunityId={id} />

      <OpportunityDeleteModal
        open={deleteOpen}
        opportunity={opportunity}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
