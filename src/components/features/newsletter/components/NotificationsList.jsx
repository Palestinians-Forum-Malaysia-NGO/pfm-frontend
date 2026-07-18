import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdCampaign, MdArticle, MdAssignment, MdEvent, MdOpenInNew } from "react-icons/md";
import { useNotificationList } from "components/features/newsletter/hooks";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import DataTable from "components/ui/DataTable";
import useLayoutBase from "hooks/useLayoutBase";

const SOURCE_BADGE = {
  news:    "bg-blue-50 text-blue-600",
  project: "bg-green/10 text-green",
  event:   "bg-amber-50 text-amber-600",
};

const SOURCE_ICON = {
  news:    MdArticle,
  project: MdAssignment,
  event:   MdEvent,
};

const fmtDateTime = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export default function NotificationsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    notifications, loading, error, stats,
    sourceFilter, setSourceFilter,
  } = useNotificationList();

  const SOURCE_LABEL = {
    news:    t("newsletter.source_news"),
    project: t("newsletter.source_project"),
    event:   t("newsletter.source_event"),
  };

  const SOURCE_OPTIONS = [
    { value: "all",     label: t("newsletter.source_all") },
    { value: "news",    label: t("newsletter.source_news") },
    { value: "project", label: t("newsletter.source_project") },
    { value: "event",   label: t("newsletter.source_event") },
  ];

  const statCards = [
    { key: "total",   label: t("newsletter.stat_total"),        value: stats.total,   color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "news",    label: t("newsletter.source_news"),       value: stats.news,    color: "text-blue-600",  bgColor: "bg-blue-50" },
    { key: "project", label: t("newsletter.source_project"),    value: stats.project, color: "text-green",     bgColor: "bg-green/10" },
    { key: "event",   label: t("newsletter.source_event"),      value: stats.event,   color: "text-amber-600", bgColor: "bg-amber-50" },
  ];

  const columns = [
    {
      key: "source",
      label: t("newsletter.col_source"),
      render: (n) => {
        const Icon = SOURCE_ICON[n.source] ?? MdCampaign;
        return (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${SOURCE_BADGE[n.source] ?? "bg-slate-100 text-slate-500"}`}>
            <Icon className="h-3.5 w-3.5" /> {SOURCE_LABEL[n.source] ?? n.source}
          </span>
        );
      },
    },
    {
      key: "title",
      label: t("newsletter.col_title"),
      render: (n) => <span className="line-clamp-1 text-sm font-medium text-slate-900">{n.source_title}</span>,
    },
    {
      key: "counts",
      label: t("newsletter.col_counts"),
      render: (n) => (
        <span className="text-xs text-slate-500">
          {t("newsletter.recipients_short", { count: n.recipients_count ?? 0 })} · {t("newsletter.sent_short", { count: n.sent_count ?? 0 })}
          {n.failed_count > 0 && <span className="text-red-500"> · {t("newsletter.failed_short", { count: n.failed_count })}</span>}
        </span>
      ),
    },
    {
      key: "sent_at",
      label: t("newsletter.col_sent_at"),
      render: (n) => <span className="text-sm text-slate-500">{fmtDateTime(n.sent_at)}</span>,
    },
    {
      key: "actions",
      label: t("newsletter.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (n) => (
        <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("newsletter.view")} onClick={() => navigate(`${base}/newsletter/notifications/${n.id}`)} variant="primary" />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdCampaign className="h-5 w-5" />}
        title={t("newsletter.notifications_title")}
        subtitle={t("newsletter.notifications_subtitle")}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>
              {card.key === "total" ? <MdCampaign className="h-5 w-5" /> : React.createElement(SOURCE_ICON[card.key], { className: "h-5 w-5" })}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold leading-none text-slate-900">{loading ? "—" : card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-end">
        <FilterSelect value={sourceFilter} onChange={setSourceFilter} options={SOURCE_OPTIONS} icon={<MdCampaign className="h-3.5 w-3.5" />} />
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        loading={loading}
        error={error}
        onRowClick={(n) => navigate(`${base}/newsletter/notifications/${n.id}`)}
        pageSize={10}
        emptyIcon={<MdCampaign />}
        emptyTitle={t("newsletter.no_notifications")}
        emptyDesc={t("newsletter.no_notifications_desc")}
      />
    </div>
  );
}
