import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdArticle, MdCalendarToday, MdCategory, MdStar } from "react-icons/md";
import { useGetBlog } from "components/features/blogs/hooks";
import StorageImage from "components/ui/StorageImage";
import Loading from "components/loading/Loading";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

export default function BlogPublicDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate  = useNavigate();

  const { blog, execute: fetchBlog, loading, error } = useGetBlog();

  useEffect(() => { fetchBlog(slug).catch(() => {}); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text={t("blogsPublic.loading")} />;

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdArticle className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">{t("blogsPublic.not_found_title")}</h2>
        <p className="mb-6 text-sm text-slate-400">{t("blogsPublic.not_found_body")}</p>
        <button onClick={() => navigate("/blogs")} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> {t("blogsPublic.back_to_blogs")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Hero — plain full-bleed image, no overlay or text ── */}
      {blog.cover_image && (
        <div className="h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
          <StorageImage fileKey={blog.cover_image} alt={blog.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* ── Header block ── */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/blogs")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-green"
        >
          <MdArrowBack className="h-4 w-4" /> {t("blogsPublic.back_to_blogs")}
        </button>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {blog.category?.name && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
              <MdCategory className="h-3.5 w-3.5" /> {blog.category.name}
            </span>
          )}
          {blog.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
              <MdStar className="h-3.5 w-3.5" /> {t("blogsPublic.featured")}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {blog.title}
        </h1>

        {blog.created_at && (
          <p className="mt-4 flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-slate-400">
            <MdCalendarToday className="h-3.5 w-3.5" /> {fmtDate(blog.created_at)}
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {blog.summary && (
          <p className="mb-8 text-lg font-medium leading-relaxed text-slate-600">{blog.summary}</p>
        )}
        {blog.content && (
          <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{blog.content}</p>
        )}
      </div>
    </div>
  );
}
