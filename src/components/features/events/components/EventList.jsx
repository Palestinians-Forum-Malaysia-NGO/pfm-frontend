import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdEvent, MdCheckCircle, MdCancel, MdGroups,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdToggleOn, MdToggleOff, MdLocationOn,
} from "react-icons/md";
import { useEventList } from "components/features/events/hooks";
import EventDeleteModal from "./EventDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import useLayoutBase from "hooks/useLayoutBase";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";
const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function EventList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    events, loading, error,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    toDelete,     setToDelete,
    deleteLoading,
    toggleLoading,
    handleDeleteConfirm,
    handleToggleActive,
  } = useEventList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const STATUS_OPTIONS = [
    { value: "all",      label: t("events.status_all") },
    { value: "active",   label: t("events.status_active") },
    { value: "inactive", label: t("events.status_inactive") },
    { value: "full",     label: t("events.status_full") },
  ];

  const statCards = [
    {
      key: "total", label: t("events.stat_total"), value: stats.total,
      icon: <MdEvent className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("events.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "full", label: t("events.status_full"), value: stats.full,
      icon: <MdGroups className="h-5 w-5" />, color: "text-amber-600", bgColor: "bg-amber-50",
      active: statusFilter === "full",
      onClick: () => setStatusFilter((s) => s === "full" ? "all" : "full"),
    },
    {
      key: "inactive", label: t("events.status_inactive"), value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const columns = [
    {
      key: "event",
      label: t("events.col_event"),
      icon: <MdEvent className="h-3.5 w-3.5" />,
      render: (e) => (
        <div className="min-w-0 max-w-[240px]">
          <p className="truncate font-semibold text-slate-900">{e.title}</p>
          {e.location && (
            <p className="truncate text-xs text-slate-400 flex items-center gap-1">
              <MdLocationOn className="h-3 w-3" /> {e.location}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "datetime",
      label: t("events.col_datetime"),
      render: (e) => (
        <div className="text-xs text-slate-500">
          <p>{fmtDate(e.event_date)}</p>
          {(e.start_time || e.end_time) && (
            <p className="text-slate-400">{fmtTime(e.start_time)}{e.end_time ? ` – ${fmtTime(e.end_time)}` : ""}</p>
          )}
        </div>
      ),
    },
    {
      key: "capacity",
      label: t("events.col_capacity"),
      render: (e) => (
        <div className="text-sm text-slate-600">
          <span>{e.registered_count ?? 0}{e.capacity ? ` / ${e.capacity}` : ""}</span>
          {e.is_full && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">{t("events.status_full")}</span>
          )}
        </div>
      ),
    },
    {
      key: "active",
      label: t("events.col_active"),
      render: (e) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${e.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${e.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {e.is_active ? t("events.active") : t("events.inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("events.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (e) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("events.view")} onClick={() => navigate(`${base}/events/${e.id}`)} variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title={t("events.edit")} onClick={() => navigate(`${base}/events/${e.id}/edit`)} />
          <RowIconButton
            icon={e.is_active ? <MdToggleOff className="h-4 w-4" /> : <MdToggleOn className="h-4 w-4" />}
            title={e.is_active ? t("events.deactivate") : t("events.activate")}
            onClick={() => handleToggleActive(e)}
            disabled={toggleLoading}
          />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("events.delete")} onClick={() => setToDelete(e)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdEvent className="h-5 w-5" />}
        title={t("events.title")}
        subtitle={t("events.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("events.new_event")} onClick={() => navigate(`${base}/events/create`)} />
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("events.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdEvent className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("events.clear")}
            onClick={() => { setSearch(""); setStatusFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        error={error}
        onRowClick={(e) => navigate(`${base}/events/${e.id}`)}
        pageSize={8}
        emptyIcon={<MdEvent />}
        emptyTitle={t("events.no_events")}
        emptyDesc={hasFilters ? t("events.adjust_filters") : t("events.create_first")}
        emptyAction={!hasFilters ? { label: t("events.new_event"), onClick: () => navigate(`${base}/events/create`) } : undefined}
      />

      <EventDeleteModal
        open={!!toDelete}
        event={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
