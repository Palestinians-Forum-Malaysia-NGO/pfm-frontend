import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdArticle,
  MdCalendarToday, MdPublic, MdPublicOff, MdPerson,
  MdCategory, MdInfoOutline, MdUpdate, MdShare, MdStar,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import DropdownButton from "components/ui/buttons/DropdownButton";
import StorageImage from "components/ui/StorageImage";
import NewsDeleteModal from "./NewsDeleteModal";
import { useGetNewsArticle, useDeleteNews, useUpdateNews } from "components/features/news/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function NewsDetailView() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { article, execute: fetchArticle, loading, error } = useGetNewsArticle();
  const { execute: deleteNews, loading: deleteLoading } = useDeleteNews();
  const { execute: updateNews, loading: publishing }    = useUpdateNews();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => { fetchArticle(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteNews(id);
      success(t("news.toast_deleted"), `"${article?.title}" ${t("news.toast_deleted_sub")}`);
      navigate(`${base}/news`);
    } catch (err) {
      toastError(t("news.toast_delete_failed"), err?.message);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updateNews(id, { is_published: !article.is_published });
      success(
        article.is_published ? t("news.toast_unpublished") : t("news.toast_published"),
        `"${article.title}" ${article.is_published ? t("news.toast_unpublished_sub") : t("news.toast_published_sub")}`
      );
      fetchArticle(id);
    } catch (err) {
      toastError(t("news.toast_publish_failed"), err?.message);
    }
  };

  if (loading)  return <Loading text={t("news.loading")} />;
  if (error)    return <AlertBanner message={error} />;
  if (!article) return null;

  const categoryName = (article.category?.name_ar && i18n.language === "ar")
    ? article.category.name_ar
    : article.category?.name;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdArticle className="h-5 w-5" />}
        title={article.title}
        subtitle={t("news.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("news.back")} onClick={() => navigate(`${base}/news`)} />
            <DropdownButton
              label={t("news.actions")}
              items={[
                { label: t("news.edit"), icon: <MdEdit className="h-4 w-4" />, onClick: () => navigate(`${base}/news/${id}/edit`) },
                {
                  label: article.is_published ? t("news.unpublish") : t("news.publish"),
                  icon: article.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />,
                  onClick: handleTogglePublish,
                },
                ...(isAdmin ? [
                  { divider: true },
                  { label: t("news.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
                ] : []),
              ]}
            />
          </>
        }
      />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {article.cover_image ? (
          <StorageImage fileKey={article.cover_image} alt={article.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
            <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
          </div>
        )}
        <div className="px-6 pb-6 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{article.title}</h2>
            {article.title_ar && (
              <p className="mt-0.5 text-base font-semibold text-slate-500" dir="rtl">{article.title_ar}</p>
            )}
            {article.excerpt && <p className="mt-1 text-sm text-slate-500">{article.excerpt}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${article.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${article.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {article.is_published ? t("news.live") : t("news.draft")}
              </span>
              {article.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  <MdStar className="h-3.5 w-3.5" /> {t("news.featured")}
                </span>
              )}
              {categoryName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  <MdCategory className="h-3 w-3" /> {categoryName}
                </span>
              )}
            </div>
          </div>
          <Button
            variant={article.is_published ? "ghost" : "primary"}
            icon={article.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
            text={article.is_published ? t("news.unpublish") : t("news.publish")}
            loading={publishing}
            onClick={handleTogglePublish}
          />
        </div>
      </div>

      {/* ── Content ── */}
      {(article.content || article.content_ar) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("news.section_content")} subtitle={t("news.section_content_sub")} />
          {article.content && (
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{article.content}</p>
          )}
          {article.content_ar && (
            <p className="mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap border-t border-slate-100 pt-4" dir="rtl">{article.content_ar}</p>
          )}
        </div>
      )}

      {/* ── Article Info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title={t("news.article_info")} subtitle={t("news.article_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("news.published_at_info")} value={fmtDate(article.published_at)} />
          <InfoRow icon={<MdShare className="h-4 w-4" />}         label={t("news.share_count_info")}  value={article.share_count ?? 0} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("news.created_by_info")}   value={article.created_by || "—"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("news.last_updated_info")} value={fmtDate(article.updated_at)} />
        </div>
      </div>

      <NewsDeleteModal
        open={deleteOpen}
        article={article}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
