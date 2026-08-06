import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdAdd, MdAssignment, MdCheckCircle,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdPublic, MdPublicOff, MdFlag,
} from "react-icons/md";
import { useProjectList } from "components/features/projects/hooks";
import ProjectDeleteModal from "./ProjectDeleteModal";
import { PROJECT_STATUS_BADGE } from "components/features/projects/constants/projects";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function ProjectList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    projects, loading, error,
    stats,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    publishFilter, setPublishFilter,
    toDelete,      setToDelete,
    deleteLoading,
    publishLoading,
    handleDeleteConfirm,
    handleTogglePublish,
  } = useProjectList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const STATUS_OPTIONS = [
    { value: "all",       label: t("projects.status_all") },
    { value: "active",    label: t("projects.status_active") },
    { value: "completed", label: t("projects.status_completed") },
    { value: "on_hold",   label: t("projects.status_on_hold") },
    { value: "cancelled", label: t("projects.status_cancelled") },
  ];

  const PUBLISH_OPTIONS = [
    { value: "all",         label: t("projects.publish_all") },
    { value: "published",   label: t("projects.publish_published") },
    { value: "unpublished", label: t("projects.publish_unpublished") },
  ];

  const statCards = [
    {
      key: "total", label: t("projects.stat_total"), value: stats.total,
      icon: <MdAssignment className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all" && publishFilter === "all",
      onClick: () => { setStatusFilter("all"); setPublishFilter("all"); },
    },
    {
      key: "active", label: t("projects.stat_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "published", label: t("projects.stat_published"), value: stats.published,
      icon: <MdPublic className="h-5 w-5" />, color: "text-blue-600", bgColor: "bg-blue-50",
      active: publishFilter === "published",
      onClick: () => setPublishFilter((p) => p === "published" ? "all" : "published"),
    },
    {
      key: "completed", label: t("projects.stat_completed"), value: stats.completed,
      icon: <MdFlag className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "completed",
      onClick: () => setStatusFilter((s) => s === "completed" ? "all" : "completed"),
    },
  ];

  const columns = [
    {
      key: "project",
      label: t("projects.col_project"),
      icon: <MdAssignment className="h-3.5 w-3.5" />,
      render: (p) => {
        const catName = (p.category?.name_ar && i18n.language === "ar") ? p.category.name_ar : p.category?.name;
        return (
          <div className="min-w-0 max-w-[260px]">
            <p className="truncate font-semibold text-slate-900">{p.title}</p>
            {p.title_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{p.title_ar}</p>}
            {catName && (
              <span className="mt-0.5 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {catName}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      label: t("projects.col_status"),
      render: (p) => (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${PROJECT_STATUS_BADGE[p.status] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
          {t(`projects.status_${p.status}`, { defaultValue: p.status ?? "—" })}
        </span>
      ),
    },
    {
      key: "published",
      label: t("projects.col_published"),
      render: (p) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${p.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${p.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {p.is_published ? t("projects.live") : t("projects.draft")}
        </span>
      ),
    },
    {
      key: "dates",
      label: t("projects.col_dates"),
      render: (p) => (
        <div className="text-xs text-slate-500">
          <p>{fmtDate(p.start_date)}</p>
          {p.end_date && <p className="text-slate-400">{i18n.language === "ar" ? "←" : "→"} {fmtDate(p.end_date)}</p>}
        </div>
      ),
    },
    {
      key: "actions",
      label: t("projects.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (p) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("projects.actions")}   onClick={() => navigate(`${base}/projects/${p.id}`)} variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title={t("projects.edit_project")} onClick={() => navigate(`${base}/projects/${p.id}/edit`)} />
          <RowIconButton
            icon={p.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
            title={p.is_published ? t("projects.unpublish") : t("projects.publish")}
            onClick={() => handleTogglePublish(p)}
            disabled={publishLoading}
          />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("projects.delete_project")} onClick={() => setToDelete(p)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || publishFilter !== "all";

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdAssignment className="h-5 w-5" />}
        title={t("projects.title")}
        subtitle={t("projects.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("projects.new_project")} onClick={() => navigate(`${base}/projects/create`)} />
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
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("projects.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter}  onChange={setStatusFilter}  options={STATUS_OPTIONS}  icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        <FilterSelect value={publishFilter} onChange={setPublishFilter} options={PUBLISH_OPTIONS} icon={<MdPublic className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("projects.clear")}
            onClick={() => { setSearch(""); setStatusFilter("all"); setPublishFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={projects}
        loading={loading}
        error={error}
        onRowClick={(p) => navigate(`${base}/projects/${p.id}`)}
        selectable
        pageSize={8}
        emptyIcon={<MdAssignment />}
        emptyTitle={t("projects.no_projects")}
        emptyDesc={hasFilters ? t("projects.adjust_filters") : t("projects.create_first")}
        emptyAction={!hasFilters ? { label: t("projects.new_project"), onClick: () => navigate(`${base}/projects/create`) } : undefined}
      />

      <ProjectDeleteModal
        open={!!toDelete}
        project={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
