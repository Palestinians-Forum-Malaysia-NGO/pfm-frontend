import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdArticle, MdStar, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdPublic, MdPublicOff,
} from "react-icons/md";
import { useBlogList } from "components/features/blogs/hooks";
import BlogDeleteModal from "./BlogDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import useLayoutBase from "hooks/useLayoutBase";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    blogs, loading, error,
    stats,
    search,        setSearch,
    publishFilter, setPublishFilter,
    toDelete,      setToDelete,
    deleteLoading,
    publishLoading,
    handleDeleteConfirm,
    handleTogglePublish,
  } = useBlogList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const PUBLISH_OPTIONS = [
    { value: "all",         label: t("blogs.publish_all") },
    { value: "published",   label: t("blogs.publish_published") },
    { value: "unpublished", label: t("blogs.publish_unpublished") },
    { value: "featured",    label: t("blogs.publish_featured") },
  ];

  const statCards = [
    {
      key: "total", label: t("blogs.stat_total"), value: stats.total,
      icon: <MdArticle className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: publishFilter === "all",
      onClick: () => setPublishFilter("all"),
    },
    {
      key: "published", label: t("blogs.stat_published"), value: stats.published,
      icon: <MdPublic className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: publishFilter === "published",
      onClick: () => setPublishFilter((p) => p === "published" ? "all" : "published"),
    },
    {
      key: "featured", label: t("blogs.stat_featured"), value: stats.featured,
      icon: <MdStar className="h-5 w-5" />, color: "text-amber-500", bgColor: "bg-amber-50",
      active: publishFilter === "featured",
      onClick: () => setPublishFilter((p) => p === "featured" ? "all" : "featured"),
    },
    {
      key: "draft", label: t("blogs.stat_draft"), value: stats.draft,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: publishFilter === "unpublished",
      onClick: () => setPublishFilter((p) => p === "unpublished" ? "all" : "unpublished"),
    },
  ];

  const columns = [
    {
      key: "blog",
      label: t("blogs.col_blog"),
      icon: <MdArticle className="h-3.5 w-3.5" />,
      render: (b) => {
        const catName = (b.category?.name_ar && i18n.language === "ar") ? b.category.name_ar : b.category?.name;
        return (
          <div className="min-w-0 max-w-[260px]">
            <p className="truncate font-semibold text-slate-900">{b.title}</p>
            {b.title_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{b.title_ar}</p>}
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
      key: "published",
      label: t("blogs.col_published"),
      render: (b) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${b.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${b.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {b.is_published ? t("blogs.live") : t("blogs.draft")}
        </span>
      ),
    },
    {
      key: "featured",
      label: t("blogs.col_featured"),
      render: (b) => b.is_featured ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
          <MdStar className="h-3.5 w-3.5" /> {t("blogs.featured")}
        </span>
      ) : <span className="text-slate-300">—</span>,
    },
    {
      key: "created",
      label: t("blogs.col_created"),
      render: (b) => <span className="text-xs text-slate-500">{fmtDate(b.created_at)}</span>,
    },
    {
      key: "actions",
      label: t("blogs.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (b) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("blogs.view")} onClick={() => navigate(`${base}/blogs/${b.id}`)} variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title={t("blogs.edit")} onClick={() => navigate(`${base}/blogs/${b.id}/edit`)} />
          {isAdmin && (
            <RowIconButton
              icon={b.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
              title={b.is_published ? t("blogs.unpublish") : t("blogs.publish")}
              onClick={() => handleTogglePublish(b)}
              disabled={publishLoading}
            />
          )}
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("blogs.delete")} onClick={() => setToDelete(b)} variant="danger" />
          )}
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || publishFilter !== "all";

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdArticle className="h-5 w-5" />}
        title={t("blogs.title")}
        subtitle={t("blogs.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("blogs.new_blog")} onClick={() => navigate(`${base}/blogs/create`)} />
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("blogs.search_placeholder")} className="flex-1" />
        <FilterSelect value={publishFilter} onChange={setPublishFilter} options={PUBLISH_OPTIONS} icon={<MdPublic className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("blogs.clear")}
            onClick={() => { setSearch(""); setPublishFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        loading={loading}
        error={error}
        onRowClick={(b) => navigate(`${base}/blogs/${b.id}`)}
        pageSize={8}
        emptyIcon={<MdArticle />}
        emptyTitle={t("blogs.no_blogs")}
        emptyDesc={hasFilters ? t("blogs.adjust_filters") : t("blogs.create_first")}
        emptyAction={!hasFilters ? { label: t("blogs.new_blog"), onClick: () => navigate(`${base}/blogs/create`) } : undefined}
      />

      <BlogDeleteModal
        open={!!toDelete}
        blog={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
