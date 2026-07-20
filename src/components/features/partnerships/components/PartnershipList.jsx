import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdHandshake, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose, MdRestore, MdLink,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { usePartnershipList } from "components/features/partnerships/hooks";
import { PARTNERSHIP_TYPES } from "components/features/partnerships/constants/partnershipTypes";
import { isSafeUrl } from "utils/url";
import PartnershipDeleteModal from "./PartnershipDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import FilterSelect   from "components/ui/FilterSelect";
import DataTable      from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

export default function PartnershipList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    partnerships, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    restoreLoading,
    handleRestore,
  } = usePartnershipList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const TYPE_LABEL = Object.fromEntries(PARTNERSHIP_TYPES.map((v) => [v, t(`partnerships.type_${v}`)]));

  const STATUS_OPTIONS = [
    { value: "all",      label: t("partnerships.status_all") },
    { value: "active",   label: t("partnerships.status_active") },
    { value: "inactive", label: t("partnerships.status_inactive") },
  ];

  const TYPE_OPTIONS = [
    { value: "all", label: t("partnerships.type_all") },
    ...PARTNERSHIP_TYPES.map((v) => ({ value: v, label: TYPE_LABEL[v] })),
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || typeFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); };

  const statCards = [
    {
      key: "total", label: t("partnerships.total"), value: stats.total,
      icon: <MdHandshake className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("partnerships.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "inactive", label: t("partnerships.status_inactive"), value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const columns = [
    {
      key: "name",
      label: t("partnerships.col_name"),
      icon: <MdHandshake className="h-3.5 w-3.5" />,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
            {p.logo?.public_url
              ? <img src={p.logo.public_url} alt={p.name} className="h-full w-full object-cover" />
              : <MdHandshake className="h-4 w-4 text-slate-400" />
            }
          </div>
          <div className="min-w-0 max-w-[220px] flex-1">
            <p className="truncate font-semibold text-slate-900">{p.name}</p>
            <p className="truncate text-xs text-slate-400">{TYPE_LABEL[p.partnership_type] ?? p.partnership_type}</p>
          </div>
        </div>
      ),
    },
    {
      key: "website",
      label: t("partnerships.col_website"),
      render: (p) => isSafeUrl(p.website_url) ? (
        <a href={p.website_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-green">
          <MdLink className="h-3.5 w-3.5" /> {t("partnerships.visit_link")}
        </a>
      ) : <span className="text-slate-300">—</span>,
    },
    {
      key: "order",
      label: t("partnerships.col_order"),
      render: (p) => <span className="text-sm text-slate-500">{p.order ?? "—"}</span>,
    },
    {
      key: "status",
      label: t("partnerships.col_status"),
      render: (p) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          p.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {p.is_active ? t("partnerships.status_active") : t("partnerships.status_inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("partnerships.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (p) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("partnerships.view")}   onClick={() => navigate(`${base}/partnerships/${p.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("partnerships.edit")}   onClick={() => navigate(`${base}/partnerships/${p.id}/edit`)} />
          {p.is_active ? (
            isAdmin && (
              <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("partnerships.delete")} onClick={() => setToDelete(p)} variant="danger" />
            )
          ) : (
            <RowIconButton icon={<MdRestore className="h-4 w-4" />} title={t("partnerships.restore")} onClick={() => handleRestore(p)} disabled={restoreLoading} />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdHandshake className="h-5 w-5" />}
        title={t("partnerships.title")}
        subtitle={t("partnerships.subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdCancel className="h-4 w-4" />} text={t("partnerships.inactive_title")} onClick={() => navigate(`${base}/partnerships/inactive`)} />
            <Button icon={<MdAdd className="h-4 w-4" />} text={t("partnerships.add_partnership")} onClick={() => navigate(`${base}/partnerships/create`)} />
          </>
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("partnerships.search_placeholder")} className="flex-1" />
        <FilterSelect value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} icon={<MdHandshake className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("partnerships.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={partnerships}
        loading={loading}
        error={error}
        onRowClick={(p) => navigate(`${base}/partnerships/${p.id}`)}
        pageSize={8}
        emptyIcon={<MdHandshake />}
        emptyTitle={t("partnerships.no_partnerships")}
        emptyDesc={hasFilters ? t("partnerships.adjust_filters") : t("partnerships.add_first")}
        emptyAction={!hasFilters ? { label: t("partnerships.add_partnership"), onClick: () => navigate(`${base}/partnerships/create`) } : undefined}
      />

      <PartnershipDeleteModal
        open={!!toDelete}
        partnership={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
