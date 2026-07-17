import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdArticle, MdCalendarToday, MdCategory, MdShare, MdStar } from "react-icons/md";
import { useGetNewsArticle, useShareNews } from "components/features/news/hooks";
import StorageImage from "components/ui/StorageImage";
import Loading from "components/loading/Loading";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

export default function NewsPublicDetail() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate  = useNavigate();
  const { success } = useToast();

  const { article, execute: fetchArticle, loading, error } = useGetNewsArticle();
  const { execute: shareArticle } = useShareNews();
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => { fetchArticle(slug); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (article) setShareCount(article.share_count ?? 0); }, [article]);

  const handleShare = async () => {
    setShareCount((c) => c + 1);
    shareArticle(slug).catch(() => {});

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      success(t("newsPublic.link_copied"));
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  if (loading) return <Loading text={t("newsPublic.loading")} />;

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdArticle className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">{t("newsPublic.not_found_title")}</h2>
        <p className="mb-6 text-sm text-slate-400">{t("newsPublic.not_found_body")}</p>
        <button onClick={() => navigate("/news")} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> {t("newsPublic.back_to_news")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* ── Hero — plain full-bleed image, no overlay or text ── */}
      {article.cover_image && (
        <div className="h-72 w-full overflow-hidden sm:h-96 lg:h-[28rem]">
          <StorageImage fileKey={article.cover_image} alt={article.title} className="h-full w-full object-cover" />
        </div>
      )}

      {/* ── Header block ── */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/news")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-green"
        >
          <MdArrowBack className="h-4 w-4" /> {t("newsPublic.back_to_news")}
        </button>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          {article.category?.name && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
              <MdCategory className="h-3.5 w-3.5" /> {article.category.name}
            </span>
          )}
          {article.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
              <MdStar className="h-3.5 w-3.5" /> {t("newsPublic.featured")}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        <div className="mt-4 flex items-center justify-between">
          {article.published_at && (
            <p className="flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-slate-400">
              <MdCalendarToday className="h-3.5 w-3.5" /> {fmtDate(article.published_at)}
            </p>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-px hover:border-green/30 hover:bg-green/5 hover:text-green"
          >
            <MdShare className="h-3.5 w-3.5" /> {t("newsPublic.share")} {shareCount > 0 && <span className="text-slate-400">({shareCount})</span>}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {article.excerpt && (
          <p className="mb-8 text-lg font-medium leading-relaxed text-slate-600">{article.excerpt}</p>
        )}
        {article.content && (
          <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{article.content}</p>
        )}
      </div>
    </div>
  );
}
