import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdWork, MdPublic, MdLock,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose, MdLocationOn, MdPeople,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useOpportunityList } from "components/features/opportunities/hooks";
import { OPPORTUNITY_TYPES } from "components/features/opportunities/constants/opportunityTypes";
import OpportunityDeleteModal from "./OpportunityDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import FilterSelect   from "components/ui/FilterSelect";
import DataTable      from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

export default function OpportunityList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    opportunities, loading, error, stats,
    search, setSearch,
    typeFilter, setTypeFilter,
    visibilityFilter, setVisibilityFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useOpportunityList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const TYPE_LABEL = Object.fromEntries(OPPORTUNITY_TYPES.map((v) => [v, t(`opportunities.type_${v}`)]));

  const TYPE_OPTIONS = [
    { value: "all", label: t("opportunities.type_all") },
    ...OPPORTUNITY_TYPES.map((v) => ({ value: v, label: TYPE_LABEL[v] })),
  ];

  const hasFilters = search !== "" || typeFilter !== "all" || visibilityFilter !== "all";
  const clearFilters = () => { setSearch(""); setTypeFilter("all"); setVisibilityFilter("all"); };

  const statCards = [
    {
      key: "total", label: t("opportunities.total"), value: stats.total,
      icon: <MdWork className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: visibilityFilter === "all",
      onClick: () => setVisibilityFilter("all"),
    },
    {
      key: "public", label: t("opportunities.visibility_public"), value: stats.public,
      icon: <MdPublic className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: visibilityFilter === "public",
      onClick: () => setVisibilityFilter((s) => s === "public" ? "all" : "public"),
    },
    {
      key: "private", label: t("opportunities.visibility_private"), value: stats.private,
      icon: <MdLock className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: visibilityFilter === "private",
      onClick: () => setVisibilityFilter((s) => s === "private" ? "all" : "private"),
    },
  ];

  const columns = [
    {
      key: "title",
      label: t("opportunities.col_title"),
      icon: <MdWork className="h-3.5 w-3.5" />,
      render: (o) => (
        <div className="min-w-0 max-w-[220px]">
          <p className="truncate font-semibold text-slate-900">{o.title}</p>
          <p className="truncate text-xs text-slate-400">{TYPE_LABEL[o.type] ?? o.type}</p>
        </div>
      ),
    },
    {
      key: "location",
      label: t("opportunities.col_location"),
      render: (o) => (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
          <MdLocationOn className="h-3.5 w-3.5 text-slate-400" /> {t(`opportunities.location_${o.location}`, { defaultValue: o.location })}
        </span>
      ),
    },
    {
      key: "positions",
      label: t("opportunities.col_positions"),
      render: (o) => (
        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
          <MdPeople className="h-3.5 w-3.5 text-slate-400" /> {o.available_positions}
        </span>
      ),
    },
    {
      key: "applications",
      label: t("opportunities.col_applications"),
      render: (o) => <span className="text-sm text-slate-500">{o.applications_count ?? 0}</span>,
    },
    {
      key: "visibility",
      label: t("opportunities.col_visibility"),
      render: (o) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          o.for_public ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          {o.for_public ? <MdPublic className="h-3.5 w-3.5" /> : <MdLock className="h-3.5 w-3.5" />}
          {o.for_public ? t("opportunities.visibility_public") : t("opportunities.visibility_private")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("opportunities.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (o) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("opportunities.view")}   onClick={() => navigate(`${base}/opportunities/${o.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("opportunities.edit")}   onClick={() => navigate(`${base}/opportunities/${o.id}/edit`)} />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("opportunities.delete")} onClick={() => setToDelete(o)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdWork className="h-5 w-5" />}
        title={t("opportunities.title")}
        subtitle={t("opportunities.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("opportunities.add_opportunity")} onClick={() => navigate(`${base}/opportunities/create`)} />
        }
      />

      <div className="mb-5 grid grid-cols-3 gap-3">
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("opportunities.search_placeholder")} className="flex-1" />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} icon={<MdWork className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("opportunities.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={opportunities}
        loading={loading}
        error={error}
        onRowClick={(o) => navigate(`${base}/opportunities/${o.id}`)}
        pageSize={8}
        emptyIcon={<MdWork />}
        emptyTitle={t("opportunities.no_opportunities")}
        emptyDesc={hasFilters ? t("opportunities.adjust_filters") : t("opportunities.add_first")}
        emptyAction={!hasFilters ? { label: t("opportunities.add_opportunity"), onClick: () => navigate(`${base}/opportunities/create`) } : undefined}
      />

      <OpportunityDeleteModal
        open={!!toDelete}
        opportunity={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
