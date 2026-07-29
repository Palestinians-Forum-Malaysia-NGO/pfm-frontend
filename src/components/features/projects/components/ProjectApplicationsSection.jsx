import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdFactCheck, MdPending, MdCheckCircle, MdCancel,
  MdOpenInNew, MdDeleteOutline, MdClose, MdPerson,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useApplicationList, useApproveApplication, useRejectApplication } from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";
import ApplicationDeleteModal from "components/features/applications/components/ApplicationDeleteModal";
import ApplicationActionModal from "components/features/applications/components/ApplicationActionModal";
import Button        from "components/ui/buttons/Button";
import FormHeader     from "components/ui/form/FormHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import DataTable      from "components/ui/DataTable";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

export default function ProjectApplicationsSection({ projectId }) {
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
    refetch,
  } = useApplicationList(projectId);

  const { execute: approveApplication, loading: approveLoading } = useApproveApplication();
  const { execute: rejectApplication, loading: rejectLoading } = useRejectApplication();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [actioning, setActioning] = useState(null); // { action: "approve"|"reject", application }

  const hasFilters = search !== "" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const handleActionConfirm = async (note) => {
    if (!actioning) return;
    const { action, application } = actioning;
    try {
      if (action === "approve") await approveApplication(application.id, note);
      else await rejectApplication(application.id, note);
      success(
        action === "approve" ? t("applications.toast_approved") : t("applications.toast_rejected"),
        application.user?.full_name
      );
      setActioning(null);
      refetch();
    } catch (err) {
      toastError(
        action === "approve" ? t("applications.toast_approve_failed") : t("applications.toast_reject_failed"),
        err?.message
      );
    }
  };

  const statCards = [
    { key: "total",    label: t("applications.total"),           value: stats.total,    icon: <MdFactCheck className="h-4 w-4" />, color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",  label: t("applications.status_pending"),  value: stats.pending,  icon: <MdPending className="h-4 w-4" />,   color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "approved", label: t("applications.status_approved"), value: stats.approved, icon: <MdCheckCircle className="h-4 w-4" />, color: "text-green",    bgColor: "bg-green/10" },
    { key: "rejected", label: t("applications.status_rejected"), value: stats.rejected, icon: <MdCancel className="h-4 w-4" />,    color: "text-red-500",   bgColor: "bg-red-50" },
  ];

  const columns = [
    {
      key: "applicant",
      label: t("applications.col_applicant"),
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdPerson className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{a.user?.full_name ?? "—"}</p>
            <p className="truncate text-xs text-slate-400">{a.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: t("applications.col_status"),
      render: (a) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          APPLICATION_STATUS_BADGE[a.status] ?? "bg-slate-100 text-slate-500 border border-slate-200"
        }`}>
          {t(`applications.status_${a.status}`, { defaultValue: a.status ?? "—" })}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("applications.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (a) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("applications.view")} onClick={() => navigate(`${base}/applications/${a.id}`)} variant="primary" />
          {a.status === "pending" && (
            <>
              <RowIconButton icon={<MdCheckCircle className="h-4 w-4" />} title={t("applications.approve_btn")} onClick={() => setActioning({ action: "approve", application: a })} variant="primary" />
              <RowIconButton icon={<MdCancel className="h-4 w-4" />}      title={t("applications.reject_btn")}  onClick={() => setActioning({ action: "reject", application: a })} variant="danger" />
            </>
          )}
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("applications.delete")} onClick={() => setToDelete(a)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader icon={<MdFactCheck className="h-5 w-5" />} title={t("applications.project_section_title")} subtitle={t("applications.project_section_subtitle")} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button key={card.key} onClick={() => setStatusFilter((s) => (card.key === "total" ? "all" : s === card.key ? "all" : card.key))}
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("applications.search_placeholder")} className="flex-1" />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("applications.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        error={error}
        onRowClick={(a) => navigate(`${base}/applications/${a.id}`)}
        pageSize={5}
        emptyIcon={<MdFactCheck />}
        emptyTitle={t("applications.no_applications")}
        emptyDesc={hasFilters ? t("applications.adjust_filters") : t("applications.project_none_yet")}
      />

      <ApplicationDeleteModal
        open={!!toDelete}
        application={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />

      <ApplicationActionModal
        open={!!actioning}
        action={actioning?.action}
        application={actioning?.application}
        onClose={() => setActioning(null)}
        onConfirm={handleActionConfirm}
        loading={actioning?.action === "approve" ? approveLoading : rejectLoading}
      />
    </div>
  );
}
