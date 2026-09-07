import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetNewsArticles } from "./useGetNewsArticles";
import { useDeleteNews } from "./useDeleteNews";
import { useUpdateNews } from "./useUpdateNews";
import { useToast } from "components/ui/toast/ToastContext";

export function useNewsList() {
  const { t } = useTranslation();
  const { articles, loading, error, refetch } = useGetNewsArticles();
  const { execute: deleteNews, loading: deleteLoading } = useDeleteNews();
  const { execute: updateNews, loading: publishLoading } = useUpdateNews();
  const { success, error: toastError } = useToast();

  const [search, setSearch]           = useState("");
  const [publishFilter, setPublishFilter] = useState("all");
  const [toDelete, setToDelete]       = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter((a) => {
      const matchSearch = !q
        || a.title?.toLowerCase().includes(q)
        || (a.title_ar ?? "").toLowerCase().includes(q)
        || (a.excerpt ?? "").toLowerCase().includes(q)
        || a.category?.name?.toLowerCase().includes(q);
      const matchPublish = publishFilter === "all"
        || (publishFilter === "published"   &&  a.is_published)
        || (publishFilter === "unpublished" && !a.is_published)
        || (publishFilter === "featured"    &&  a.is_featured);
      return matchSearch && matchPublish;
    });
  }, [articles, search, publishFilter]);

  const stats = useMemo(() => ({
    total:     articles.length,
    published: articles.filter((a) => a.is_published).length,
    featured:  articles.filter((a) => a.is_featured).length,
    draft:     articles.filter((a) => !a.is_published).length,
  }), [articles]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteNews(toDelete.id);
      success(t("news.toast_deleted"), `"${toDelete.title}" ${t("news.toast_deleted_sub")}`);
      refetch();
    } catch {
      toastError(t("news.toast_delete_failed"));
    } finally {
      setToDelete(null);
    }
  };

  const handleTogglePublish = async (article) => {
    try {
      await updateNews(article.id, { is_published: !article.is_published });
      success(
        article.is_published ? t("news.toast_unpublished") : t("news.toast_published"),
        `"${article.title}" ${article.is_published ? t("news.toast_unpublished_sub") : t("news.toast_published_sub")}`
      );
      refetch();
    } catch {
      toastError(t("news.toast_publish_failed"));
    }
  };

  return {
    articles: filtered,
    loading,
    error,
    refetch,
    stats,
    search,        setSearch,
    publishFilter, setPublishFilter,
    toDelete,      setToDelete,
    deleteLoading,
    publishLoading,
    handleDeleteConfirm,
    handleTogglePublish,
  };
}
