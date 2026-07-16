import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdGroups, MdSchedule, MdCheckCircle, MdCancel,
  MdOpenInNew, MdDeleteOutline, MdClose,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useOpportunityApplicationList } from "components/features/opportunityApplications/hooks";
import OpportunityApplicationDeleteModal from "./OpportunityApplicationDeleteModal";
import Button        from "components/ui/buttons/Button";
import FormHeader     from "components/ui/form/FormHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import FilterSelect   from "components/ui/FilterSelect";
import DataTable      from "components/ui/DataTable";

const STATUS_BADGE = {
  pending:  "bg-amber-50 text-amber-600 border border-amber-200",
  approved: "bg-green/10 text-green border border-green/20",
  rejected: "bg-red-50 text-red-500 border border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function OpportunityApplicationsSection({ opportunityId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    applications, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    handleQuickApprove,
  } = useOpportunityApplicationList(opportunityId);

  const STATUS_LABEL = {
    pending:  t("opportunityApplications.status_pending"),
    approved: t("opportunityApplications.status_approved"),
    rejected: t("opportunityApplications.status_rejected"),
  };

  const STATUS_OPTIONS = [
    { value: "all",      label: t("opportunityApplications.status_all") },
    { value: "pending",  label: t("opportunityApplications.status_pending") },
    { value: "approved", label: t("opportunityApplications.status_approved") },
    { value: "rejected", label: t("opportunityApplications.status_rejected") },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const statCards = [
    { key: "total",    label: t("opportunityApplications.total"),           value: stats.total,    icon: <MdGroups className="h-4 w-4" />,      color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",  label: t("opportunityApplications.status_pending"),  value: stats.pending,  icon: <MdSchedule className="h-4 w-4" />,     color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "approved", label: t("opportunityApplications.status_approved"), value: stats.approved, icon: <MdCheckCircle className="h-4 w-4" />,  color: "text-green",     bgColor: "bg-green/10" },
    { key: "rejected", label: t("opportunityApplications.status_rejected"), value: stats.rejected, icon: <MdCancel className="h-4 w-4" />,       color: "text-red-500",   bgColor: "bg-red-50" },
  ];

  const columns = [
    {
      key: "applicant",
      label: t("opportunityApplications.col_applicant"),
      render: (a) => (
        <div className="min-w-0 max-w-[200px]">
          <p className="truncate font-semibold text-slate-900">{a.applicant_full_name}</p>
          <p className="truncate text-xs text-slate-400">{a.applicant_email}</p>
        </div>
      ),
    },
    {
      key: "phone",
      label: t("opportunityApplications.col_phone"),
      render: (a) => <span className="text-sm text-slate-600">{a.applicant_phone || "—"}</span>,
    },
    {
      key: "status",
      label: t("opportunityApplications.col_status"),
      render: (a) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[a.status] ?? "bg-slate-100 text-slate-500"}`}>
          {STATUS_LABEL[a.status] ?? a.status}
        </span>
      ),
    },
    {
      key: "created_at",
      label: t("opportunityApplications.col_submitted"),
      render: (a) => <span className="text-sm text-slate-500">{fmtDate(a.created_at)}</span>,
    },
    {
      key: "actions",
      label: t("opportunityApplications.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (a) => (
        <div className="flex items-center justify-end gap-0.5">
          {a.status === "pending" && (
            <RowIconButton icon={<MdCheckCircle className="h-4 w-4" />} title={t("opportunityApplications.approve")} onClick={() => handleQuickApprove(a)} variant="primary" />
          )}
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("opportunityApplications.view")}   onClick={() => navigate(`${base}/opportunities/${opportunityId}/applications/${a.id}`)} variant="primary" />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("opportunityApplications.delete")} onClick={() => setToDelete(a)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader icon={<MdGroups className="h-5 w-5" />} title={t("opportunityApplications.section_title")} subtitle={t("opportunityApplications.section_subtitle")} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button key={card.key} onClick={() => setStatusFilter(card.key === "total" ? "all" : card.key)}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              (card.key === "total" ? statusFilter === "all" : statusFilter === card.key) ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold leading-none text-slate-900">{loading ? "—" : card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("opportunityApplications.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdSchedule className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("opportunityApplications.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        error={error}
        onRowClick={(a) => navigate(`${base}/opportunities/${opportunityId}/applications/${a.id}`)}
        pageSize={5}
        emptyIcon={<MdGroups />}
        emptyTitle={t("opportunityApplications.no_applications")}
        emptyDesc={hasFilters ? t("opportunityApplications.adjust_filters") : t("opportunityApplications.none_yet")}
      />

      <OpportunityApplicationDeleteModal
        open={!!toDelete}
        application={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
