import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdRateReview, MdSchedule, MdCheckCircle, MdCancel,
  MdOpenInNew, MdDeleteOutline, MdClose,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useFeedbackList } from "components/features/feedback/hooks";
import FeedbackDeleteModal from "./FeedbackDeleteModal";
import StarRating         from "components/ui/StarRating";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
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

export default function FeedbackList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    feedbacks, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    handleQuickApprove,
  } = useFeedbackList();

  const STATUS_LABEL = {
    pending:  t("feedbackMessages.status_pending"),
    approved: t("feedbackMessages.status_approved"),
    rejected: t("feedbackMessages.status_rejected"),
  };

  const STATUS_OPTIONS = [
    { value: "all",      label: t("feedbackMessages.status_all") },
    { value: "pending",  label: t("feedbackMessages.status_pending") },
    { value: "approved", label: t("feedbackMessages.status_approved") },
    { value: "rejected", label: t("feedbackMessages.status_rejected") },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const statCards = [
    { key: "total",    label: t("feedbackMessages.total"),           value: stats.total,    icon: <MdRateReview className="h-5 w-5" />,  color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",  label: t("feedbackMessages.status_pending"),  value: stats.pending,  icon: <MdSchedule className="h-5 w-5" />,    color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "approved", label: t("feedbackMessages.status_approved"), value: stats.approved, icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green",     bgColor: "bg-green/10" },
    { key: "rejected", label: t("feedbackMessages.status_rejected"), value: stats.rejected, icon: <MdCancel className="h-5 w-5" />,      color: "text-red-500",   bgColor: "bg-red-50" },
  ];

  const columns = [
    {
      key: "reviewer",
      label: t("feedbackMessages.col_reviewer"),
      icon: <MdRateReview className="h-3.5 w-3.5" />,
      render: (f) => (
        <div className="min-w-0 max-w-[200px]">
          <p className="truncate font-semibold text-slate-900">{f.full_name}</p>
          <p className="truncate text-xs text-slate-400">{f.project?.title ?? f.project ?? "—"}</p>
        </div>
      ),
    },
    {
      key: "rating",
      label: t("feedbackMessages.col_rating"),
      render: (f) => <StarRating value={f.rating} size="h-4 w-4" />,
    },
    {
      key: "message",
      label: t("feedbackMessages.col_message"),
      render: (f) => <span className="line-clamp-1 text-sm text-slate-600">{f.message}</span>,
    },
    {
      key: "status",
      label: t("feedbackMessages.col_status"),
      render: (f) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[f.status] ?? "bg-slate-100 text-slate-500"}`}>
          {STATUS_LABEL[f.status] ?? f.status}
        </span>
      ),
    },
    {
      key: "created_at",
      label: t("feedbackMessages.col_submitted"),
      render: (f) => <span className="text-sm text-slate-500">{fmtDate(f.created_at)}</span>,
    },
    {
      key: "actions",
      label: t("feedbackMessages.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (f) => (
        <div className="flex items-center justify-end gap-0.5">
          {f.status === "pending" && (
            <RowIconButton icon={<MdCheckCircle className="h-4 w-4" />} title={t("feedbackMessages.approve")} onClick={() => handleQuickApprove(f)} variant="primary" />
          )}
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("feedbackMessages.view")}   onClick={() => navigate(`${base}/feedback/${f.id}`)} variant="primary" />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("feedbackMessages.delete")} onClick={() => setToDelete(f)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdRateReview className="h-5 w-5" />}
        title={t("feedbackMessages.title")}
        subtitle={t("feedbackMessages.subtitle")}
      />

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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("feedbackMessages.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdSchedule className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("feedbackMessages.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={feedbacks}
        loading={loading}
        error={error}
        onRowClick={(f) => navigate(`${base}/feedback/${f.id}`)}
        pageSize={8}
        emptyIcon={<MdRateReview />}
        emptyTitle={t("feedbackMessages.no_feedback")}
        emptyDesc={hasFilters ? t("feedbackMessages.adjust_filters") : t("feedbackMessages.none_yet")}
      />

      <FeedbackDeleteModal
        open={!!toDelete}
        feedback={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
