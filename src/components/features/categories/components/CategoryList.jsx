import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdAdd, MdCategory, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdApps,
} from "react-icons/md";
import { useCategoryList } from "components/features/categories/hooks";
import CategoryDeleteModal from "./CategoryDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

export default function CategoryList() {
  const { t } = useTranslation();
  const MODULE_LABELS = {
    projects: t("categories.module_projects"),
    posts:    t("categories.module_posts"),
    events:   t("categories.module_events"),
  };
  const MODULE_FILTER_OPTIONS = [
    { value: "all",      label: t("categories.module_all") },
    { value: "projects", label: MODULE_LABELS.projects },
    { value: "posts",    label: MODULE_LABELS.posts },
    { value: "events",   label: MODULE_LABELS.events },
  ];
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    categories, loading, error,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    moduleFilter, setModuleFilter,
    toDelete,     setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useCategoryList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const STATUS_OPTIONS = [
    { value: "all",      label: t("categories.status_all") },
    { value: "active",   label: t("categories.status_active") },
    { value: "inactive", label: t("categories.status_inactive") },
  ];

  const statCards = [
    {
      key: "total", label: t("categories.total"), value: stats.total,
      icon: <MdCategory className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("categories.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "inactive", label: t("categories.status_inactive"), value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const columns = [
    {
      key: "name",
      label: t("categories.col_category"),
      icon: <MdCategory className="h-3.5 w-3.5" />,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={
              c.hex_color
                ? { background: c.hex_color, color: c.text_color || "#ffffff" }
                : { background: "rgba(0,122,61,0.1)", color: "#007A3D" }
            }
          >
            <MdCategory className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{c.name}</p>
            {c.name_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{c.name_ar}</p>}
            <p className="truncate font-mono text-xs text-slate-400">{c.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "module",
      label: t("categories.col_module"),
      icon: <MdApps className="h-3.5 w-3.5" />,
      render: (c) => c.module
        ? <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 capitalize">{MODULE_LABELS[c.module] ?? c.module}</span>
        : <span className="text-slate-300">—</span>,
    },
    {
      key: "description",
      label: t("categories.col_description"),
      render: (c) => (
        <span className="line-clamp-1 text-sm text-slate-600">
          {c.description || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "order",
      label: t("categories.col_order"),
      render: (c) => (
        <span className="text-sm text-slate-500">{c.order ?? <span className="text-slate-300">—</span>}</span>
      ),
    },
    {
      key: "status",
      label: t("categories.col_status"),
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (c) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          c.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${c.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {c.is_active ? t("categories.status_active") : t("categories.status_inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("categories.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (c) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("categories.actions")} onClick={() => navigate(`${base}/categories/${c.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("categories.edit_category")}   onClick={() => navigate(`${base}/categories/${c.id}/edit`)} />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("categories.delete_category")} onClick={() => setToDelete(c)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || moduleFilter !== "all";

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdCategory className="h-5 w-5" />}
        title={t("categories.title")}
        subtitle={t("categories.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("categories.add_category")} onClick={() => navigate(`${base}/categories/create`)} />
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
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("categories.search_placeholder")} className="flex-1" />
        <FilterSelect value={moduleFilter} onChange={setModuleFilter} options={MODULE_FILTER_OPTIONS} icon={<MdApps className="h-3.5 w-3.5" />} />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS}        icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("categories.clear")}
            onClick={() => { setSearch(""); setStatusFilter("all"); setModuleFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        error={error}
        onRowClick={(c) => navigate(`${base}/categories/${c.id}`)}
        selectable
        pageSize={10}
        emptyIcon={<MdCategory />}
        emptyTitle={t("categories.no_categories")}
        emptyDesc={hasFilters ? t("categories.adjust_filters") : t("categories.add_first")}
        emptyAction={!hasFilters ? { label: t("categories.add_category"), onClick: () => navigate(`${base}/categories/create`) } : undefined}
      />

      <CategoryDeleteModal
        open={!!toDelete}
        category={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
