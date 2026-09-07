import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdArticle,
  MdCalendarToday, MdPublic, MdPublicOff, MdPerson,
  MdCategory, MdInfoOutline, MdUpdate, MdStar,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import DropdownButton from "components/ui/buttons/DropdownButton";
import StorageImage from "components/ui/StorageImage";
import BlogDeleteModal from "./BlogDeleteModal";
import { useGetBlog, useDeleteBlog, usePublishBlog, useUnpublishBlog } from "components/features/blogs/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function BlogDetailView() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { blog, execute: fetchBlog, loading, error } = useGetBlog();
  const { execute: deleteBlog, loading: deleteLoading } = useDeleteBlog();
  const { execute: publishBlog, loading: publishing }   = usePublishBlog();
  const { execute: unpublishBlog }                      = useUnpublishBlog();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => { fetchBlog(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteBlog(id);
      success(t("blogs.toast_deleted"), `"${blog?.title}" ${t("blogs.toast_deleted_sub")}`);
      navigate(`${base}/blogs`);
    } catch (err) {
      toastError(t("blogs.toast_delete_failed"), err?.message);
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (blog.is_published) {
        await unpublishBlog(id);
        success(t("blogs.toast_unpublished"), `"${blog.title}" ${t("blogs.toast_unpublished_sub")}`);
      } else {
        await publishBlog(id);
        success(t("blogs.toast_published"), `"${blog.title}" ${t("blogs.toast_published_sub")}`);
      }
      fetchBlog(id);
    } catch (err) {
      toastError(t("blogs.toast_publish_failed"), err?.message);
    }
  };

  if (loading) return <Loading text={t("blogs.loading")} />;
  if (error)   return <AlertBanner message={error} />;
  if (!blog)   return null;

  const categoryName = (blog.category?.name_ar && i18n.language === "ar")
    ? blog.category.name_ar
    : blog.category?.name;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdArticle className="h-5 w-5" />}
        title={blog.title}
        subtitle={t("blogs.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("blogs.back")} onClick={() => navigate(`${base}/blogs`)} />
            <DropdownButton
              label={t("blogs.actions")}
              items={[
                { label: t("blogs.edit"), icon: <MdEdit className="h-4 w-4" />, onClick: () => navigate(`${base}/blogs/${id}/edit`) },
                ...(isAdmin ? [
                  {
                    label: blog.is_published ? t("blogs.unpublish") : t("blogs.publish"),
                    icon: blog.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />,
                    onClick: handleTogglePublish,
                  },
                  { divider: true },
                  { label: t("blogs.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
                ] : []),
              ]}
            />
          </>
        }
      />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {blog.cover_image ? (
          <StorageImage fileKey={blog.cover_image} alt={blog.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
            <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
          </div>
        )}
        <div className="px-6 pb-6 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{blog.title}</h2>
            {blog.title_ar && (
              <p className="mt-0.5 text-base font-semibold text-slate-500" dir="rtl">{blog.title_ar}</p>
            )}
            {blog.summary && <p className="mt-1 text-sm text-slate-500">{blog.summary}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${blog.is_published ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${blog.is_published ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {blog.is_published ? t("blogs.live") : t("blogs.draft")}
              </span>
              {blog.is_featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  <MdStar className="h-3.5 w-3.5" /> {t("blogs.featured")}
                </span>
              )}
              {categoryName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                  <MdCategory className="h-3 w-3" /> {categoryName}
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <Button
              variant={blog.is_published ? "ghost" : "primary"}
              icon={blog.is_published ? <MdPublicOff className="h-4 w-4" /> : <MdPublic className="h-4 w-4" />}
              text={blog.is_published ? t("blogs.unpublish") : t("blogs.publish")}
              loading={publishing}
              onClick={handleTogglePublish}
            />
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {(blog.content || blog.content_ar) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("blogs.section_content")} subtitle={t("blogs.section_content_sub")} />
          {blog.content && (
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{blog.content}</p>
          )}
          {blog.content_ar && (
            <p className="mt-4 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap border-t border-slate-100 pt-4" dir="rtl">{blog.content_ar}</p>
          )}
        </div>
      )}

      {/* ── Blog Info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title={t("blogs.blog_info")} subtitle={t("blogs.blog_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("blogs.created_by_info")}   value={blog.created_by || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("blogs.created_at_info")}   value={fmtDate(blog.created_at)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("blogs.last_updated_info")} value={fmtDate(blog.updated_at)} />
        </div>
      </div>

      <BlogDeleteModal
        open={deleteOpen}
        blog={blog}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
