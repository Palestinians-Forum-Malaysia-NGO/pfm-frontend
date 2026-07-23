import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetBlogs } from "./useGetBlogs";
import { useDeleteBlog } from "./useDeleteBlog";
import { usePublishBlog } from "./usePublishBlog";
import { useUnpublishBlog } from "./useUnpublishBlog";
import { useToast } from "components/ui/toast/ToastContext";

export function useBlogList() {
  const { t } = useTranslation();
  const { blogs, loading, error, refetch } = useGetBlogs();
  const { execute: deleteBlog,    loading: deleteLoading  } = useDeleteBlog();
  const { execute: publishBlog,   loading: publishLoading } = usePublishBlog();
  const { execute: unpublishBlog                          } = useUnpublishBlog();
  const { success, error: toastError } = useToast();

  const [search, setSearch]               = useState("");
  const [publishFilter, setPublishFilter] = useState("all");
  const [toDelete, setToDelete]           = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return blogs.filter((b) => {
      const matchSearch = !q
        || b.title?.toLowerCase().includes(q)
        || (b.title_ar ?? "").toLowerCase().includes(q)
        || (b.summary ?? "").toLowerCase().includes(q)
        || b.category?.name?.toLowerCase().includes(q);
      const matchPublish = publishFilter === "all"
        || (publishFilter === "published"   &&  b.is_published)
        || (publishFilter === "unpublished" && !b.is_published)
        || (publishFilter === "featured"    &&  b.is_featured);
      return matchSearch && matchPublish;
    });
  }, [blogs, search, publishFilter]);

  const stats = useMemo(() => ({
    total:     blogs.length,
    published: blogs.filter((b) => b.is_published).length,
    featured:  blogs.filter((b) => b.is_featured).length,
    draft:     blogs.filter((b) => !b.is_published).length,
  }), [blogs]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteBlog(toDelete.id);
      success(t("blogs.toast_deleted"), `"${toDelete.title}" ${t("blogs.toast_deleted_sub")}`);
      refetch();
    } catch {
      toastError(t("blogs.toast_delete_failed"));
    } finally {
      setToDelete(null);
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      if (blog.is_published) {
        await unpublishBlog(blog.id);
        success(t("blogs.toast_unpublished"), `"${blog.title}" ${t("blogs.toast_unpublished_sub")}`);
      } else {
        await publishBlog(blog.id);
        success(t("blogs.toast_published"), `"${blog.title}" ${t("blogs.toast_published_sub")}`);
      }
      refetch();
    } catch {
      toastError(t("blogs.toast_publish_failed"));
    }
  };

  return {
    blogs: filtered,
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
