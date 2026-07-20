import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdMailOutline, MdMarkEmailUnread, MdSchedule, MdCheckCircle,
  MdOpenInNew, MdDeleteOutline, MdClose,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useContactMessageList } from "components/features/contact/hooks";
import ContactMessageDeleteModal from "./ContactMessageDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import FilterSelect   from "components/ui/FilterSelect";
import DataTable      from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

const STATUS_BADGE = {
  pending:   "bg-amber-50 text-amber-600 border border-amber-200",
  follow_up: "bg-blue-50 text-blue-600 border border-blue-200",
  closed:    "bg-slate-100 text-slate-500 border border-slate-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function ContactMessageList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    messages, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useContactMessageList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const STATUS_LABEL = {
    pending:   t("contactMessages.status_pending"),
    follow_up: t("contactMessages.status_follow_up"),
    closed:    t("contactMessages.status_closed"),
  };

  const STATUS_OPTIONS = [
    { value: "all",       label: t("contactMessages.status_all") },
    { value: "pending",   label: t("contactMessages.status_pending") },
    { value: "follow_up", label: t("contactMessages.status_follow_up") },
    { value: "closed",    label: t("contactMessages.status_closed") },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const statCards = [
    { key: "total",     label: t("contactMessages.total"),          value: stats.total,     icon: <MdMailOutline className="h-5 w-5" />,     color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",   label: t("contactMessages.status_pending"),   value: stats.pending,   icon: <MdMarkEmailUnread className="h-5 w-5" />, color: "text-amber-600",  bgColor: "bg-amber-50" },
    { key: "follow_up", label: t("contactMessages.status_follow_up"), value: stats.follow_up, icon: <MdSchedule className="h-5 w-5" />,        color: "text-blue-600",   bgColor: "bg-blue-50" },
    { key: "closed",    label: t("contactMessages.status_closed"),    value: stats.closed,    icon: <MdCheckCircle className="h-5 w-5" />,     color: "text-slate-500",  bgColor: "bg-slate-100" },
  ];

  const columns = [
    {
      key: "sender",
      label: t("contactMessages.col_sender"),
      icon: <MdMailOutline className="h-3.5 w-3.5" />,
      render: (m) => (
        <div className="min-w-0 max-w-[220px]">
          <p className="truncate font-semibold text-slate-900">{m.full_name}</p>
          <p className="truncate text-xs text-slate-400">{m.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      label: t("contactMessages.col_subject"),
      render: (m) => <span className="line-clamp-1 text-sm text-slate-600">{m.subject || "—"}</span>,
    },
    {
      key: "status",
      label: t("contactMessages.col_status"),
      render: (m) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_BADGE[m.status] ?? "bg-slate-100 text-slate-500"}`}>
          {STATUS_LABEL[m.status] ?? m.status}
        </span>
      ),
    },
    {
      key: "submitted_at",
      label: t("contactMessages.col_submitted"),
      render: (m) => <span className="text-sm text-slate-500">{fmtDate(m.submitted_at)}</span>,
    },
    {
      key: "actions",
      label: t("contactMessages.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (m) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("contactMessages.view")}   onClick={() => navigate(`${base}/contact-messages/${m.id}`)} variant="primary" />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("contactMessages.delete")} onClick={() => setToDelete(m)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdMailOutline className="h-5 w-5" />}
        title={t("contactMessages.title")}
        subtitle={t("contactMessages.subtitle")}
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("contactMessages.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdSchedule className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("contactMessages.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        error={error}
        onRowClick={(m) => navigate(`${base}/contact-messages/${m.id}`)}
        pageSize={8}
        emptyIcon={<MdMailOutline />}
        emptyTitle={t("contactMessages.no_messages")}
        emptyDesc={hasFilters ? t("contactMessages.adjust_filters") : t("contactMessages.none_yet")}
      />

      <ContactMessageDeleteModal
        open={!!toDelete}
        message={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
