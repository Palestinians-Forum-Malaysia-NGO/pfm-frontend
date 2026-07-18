import React from "react";
import { useTranslation } from "react-i18next";
import { MdEmail, MdCheckCircle, MdCancel, MdClose } from "react-icons/md";
import { useSubscriberList } from "components/features/newsletter/hooks";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import Button from "components/ui/buttons/Button";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function SubscribersList() {
  const { t } = useTranslation();
  const {
    subscribers, loading, error, stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
  } = useSubscriberList();

  const STATUS_OPTIONS = [
    { value: "all",          label: t("newsletter.status_all") },
    { value: "active",       label: t("newsletter.status_active") },
    { value: "unsubscribed", label: t("newsletter.status_unsubscribed") },
  ];

  const statCards = [
    {
      key: "total", label: t("newsletter.stat_total"), value: stats.total,
      icon: <MdEmail className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("newsletter.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "unsubscribed", label: t("newsletter.status_unsubscribed"), value: stats.unsubscribed,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "unsubscribed",
      onClick: () => setStatusFilter((s) => s === "unsubscribed" ? "all" : "unsubscribed"),
    },
  ];

  const columns = [
    {
      key: "email",
      label: t("newsletter.col_email"),
      icon: <MdEmail className="h-3.5 w-3.5" />,
      render: (s) => <span className="font-medium text-slate-900">{s.email}</span>,
    },
    {
      key: "status",
      label: t("newsletter.col_status"),
      render: (s) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {s.is_active ? t("newsletter.status_active") : t("newsletter.status_unsubscribed")}
        </span>
      ),
    },
    {
      key: "created_at",
      label: t("newsletter.col_subscribed_at"),
      render: (s) => <span className="text-sm text-slate-500">{fmtDate(s.created_at)}</span>,
    },
    {
      key: "unsubscribed_at",
      label: t("newsletter.col_unsubscribed_at"),
      render: (s) => <span className="text-sm text-slate-500">{s.unsubscribed_at ? fmtDate(s.unsubscribed_at) : "—"}</span>,
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdEmail className="h-5 w-5" />}
        title={t("newsletter.subscribers_title")}
        subtitle={t("newsletter.subscribers_subtitle")}
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {statCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{loading ? "—" : card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("newsletter.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdEmail className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("newsletter.clear")}
            onClick={() => { setSearch(""); setStatusFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        loading={loading}
        error={error}
        pageSize={10}
        emptyIcon={<MdEmail />}
        emptyTitle={t("newsletter.no_subscribers")}
        emptyDesc={hasFilters ? t("newsletter.adjust_filters") : t("newsletter.no_subscribers_yet")}
      />
    </div>
  );
}
