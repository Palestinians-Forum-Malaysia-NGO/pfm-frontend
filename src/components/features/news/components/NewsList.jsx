import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdArticle, MdStar, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdPublic, MdPublicOff, MdShare,
} from "react-icons/md";
import { useNewsList } from "components/features/news/hooks";
import NewsDeleteModal from "./NewsDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import useLayoutBase from "hooks/useLayoutBase";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function NewsList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const {
    articles, loading, error,
    stats,
    search,        setSearch,
    publishFilter, setPublishFilter,
    toDelete,      setToDelete,
    deleteLoading,
    publishLoading,
    handleDeleteConfirm,
    handleTogglePublish,
  } = useNewsList();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const PUBLISH_OPTIONS = [
    { value: "all",         label: t("news.publish_all") },
    { value: "published",   label: t("news.publish_published") },
    { value: "unpublished", label: t("news.publish_unpublished") },
    { value: "featured",    label: t("news.publish_featured") },
  ];

  const statCards = [
    {
      key: "total", label: t("news.stat_total"), value: stats.total,
      icon: <MdArticle className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: publishFilter === "all",
      onClick: () => setPublishFilter("all"),
    },
    {
      key: "published", label: t("news.stat_published"), value: stats.published,
      icon: <MdPublic className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: publishFilter === "published",
      onClick: () => setPublishFilter((p) => p === "published" ? "all" : "published"),
    },
    {
      key: "featured", label: t("news.stat_featured"), value: stats.featured,
      icon: <MdStar className="h-5 w-5" />, color: "text-amber-500", bgColor: "bg-amber-50",
      active: publishFilter === "featured",
      onClick: () => setPublishFilter((p) => p === "featured" ? "all" : "featured"),
    },
    {
      key: "draft", label: t("news.stat_draft"), value: stats.draft,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: publishFilter === "unpublished",
      onClick: () => setPublishFilter((p) => p === "unpublished" ? "all" : "unpublished"),
    },
  ];

  const columns = [
    {
      key: "article",
      label: t("news.col_article"),
      icon: <MdArticle className="h-3.5 w-3.5" />,
      render: (a) => {
        const catName = (a.category?.name_ar && i18n.language === "ar") ? a.category.name_ar : a.category?.name;
        return (
          <div className="min-w-0 max-w-[260px]">
            <p className="truncate font-semibold text-slate-900">{a.title}</p>
            {a.title_ar && <p className="truncate text-xs text-slate-400" dir="rtl">{a.title_ar}</p>}
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
      label: t("news.col_published"),
      render: (a) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${a.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {a.is_published ? t("news.live") : t("news.draft")}
        </span>
      ),
    },
    {
      key: "featured",
      label: t("news.col_featured"),
      render: (a) => a.is_featured ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
          <MdStar className="h-3.5 w-3.5" /> {t("news.featured")}
        </span>
      ) : <span className="text-slate-300">—</span>,
    },
    {
      key: "shares",
      label: t("news.col_shares"),
      render: (a) => (
        <span className="inline-flex items-center gap-1 text-sm text-slate-500">
          <MdShare className="h-3.5 w-3.5 text-slate-400" /> {a.share_count ?? 0}
        </span>
      ),
    },
    {
      key: "created",
      label: t("news.col_created"),
      render: (a) => <span className="text-xs text-slate-500">{fmtDate(a.created_at)}</span>,
    },
    {
      key: "actions",
      label: t("news.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (a) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title={t("news.view")} onClick={() => navigate(`${base}/news/${a.id}`)} variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title={t("news.edit")} onClick={() => navigate(`${base}/news/${a.id}/edit`)} />
          <RowIconButton
            icon={a.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
            title={a.is_published ? t("news.unpublish") : t("news.publish")}
            onClick={() => handleTogglePublish(a)}
            disabled={publishLoading}
          />
          {isAdmin && (
            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("news.delete")} onClick={() => setToDelete(a)} variant="danger" />
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
        title={t("news.title")}
        subtitle={t("news.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("news.new_article")} onClick={() => navigate(`${base}/news/create`)} />
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("news.search_placeholder")} className="flex-1" />
        <FilterSelect value={publishFilter} onChange={setPublishFilter} options={PUBLISH_OPTIONS} icon={<MdPublic className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("news.clear")}
            onClick={() => { setSearch(""); setPublishFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={articles}
        loading={loading}
        error={error}
        onRowClick={(a) => navigate(`${base}/news/${a.id}`)}
        pageSize={8}
        emptyIcon={<MdArticle />}
        emptyTitle={t("news.no_articles")}
        emptyDesc={hasFilters ? t("news.adjust_filters") : t("news.create_first")}
        emptyAction={!hasFilters ? { label: t("news.new_article"), onClick: () => navigate(`${base}/news/create`) } : undefined}
      />

      <NewsDeleteModal
        open={!!toDelete}
        article={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
