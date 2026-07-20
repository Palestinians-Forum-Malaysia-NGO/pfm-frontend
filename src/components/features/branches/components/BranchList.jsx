import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdBusiness, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import { useBranchList } from "components/features/branches/hooks";
import BranchDeleteModal from "./BranchDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import RowIconButton  from "components/ui/buttons/RowIconButton";
import SearchInput    from "components/form/SearchInput";
import DataTable      from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

export default function BranchList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    branches, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useBranchList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const hasFilters = search !== "" || statusFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const statCards = [
    {
      key: "total", label: t("branches.total"), value: stats.total,
      icon: <MdBusiness className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("branches.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "inactive", label: t("branches.status_inactive"), value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const columns = [
    {
      key: "name",
      label: t("branches.col_name"),
      icon: <MdBusiness className="h-3.5 w-3.5" />,
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdBusiness className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{b.name}</p>
            {b.name_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{b.name_ar}</p>}
          </div>
        </div>
      ),
    },
    {
      key: "branch_uid",
      label: t("branches.col_uid"),
      render: (b) => <span className="font-mono text-xs text-slate-500">{b.branch_uid}</span>,
    },
    {
      key: "status",
      label: t("branches.col_status"),
      render: (b) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          b.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${b.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {b.is_active ? t("branches.status_active") : t("branches.status_inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("branches.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (b) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("branches.view")}   onClick={() => navigate(`${base}/branches/${b.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("branches.edit")}   onClick={() => navigate(`${base}/branches/${b.id}/edit`)} />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("branches.delete")} onClick={() => setToDelete(b)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdBusiness className="h-5 w-5" />}
        title={t("branches.title")}
        subtitle={t("branches.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("branches.add_branch")} onClick={() => navigate(`${base}/branches/create`)} />
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("branches.search_placeholder")} className="flex-1" />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("branches.clear")} onClick={clearFilters} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={branches}
        loading={loading}
        error={error}
        onRowClick={(b) => navigate(`${base}/branches/${b.id}`)}
        pageSize={8}
        emptyIcon={<MdBusiness />}
        emptyTitle={t("branches.no_branches")}
        emptyDesc={hasFilters ? t("branches.adjust_filters") : t("branches.add_first")}
        emptyAction={!hasFilters ? { label: t("branches.add_branch"), onClick: () => navigate(`${base}/branches/create`) } : undefined}
      />

      <BranchDeleteModal
        open={!!toDelete}
        branch={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
