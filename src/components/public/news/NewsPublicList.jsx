import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch, MdClose, MdArticle, MdCalendarToday, MdCategory, MdShare } from "react-icons/md";
import { useGetNewsArticles } from "components/features/news/hooks";
import StorageImage from "components/ui/StorageImage";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : null;

function NewsCard({ article, onClick }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-md active:scale-[0.99]"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-100">
        {article.cover_image ? (
          <StorageImage
            fileKey={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green/10 to-green-50">
            <MdArticle className="h-12 w-12 text-green/30" />
          </div>
        )}
        {article.is_featured && (
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50/95 px-2.5 py-0.5 text-xs font-semibold text-amber-600 backdrop-blur-sm">
              {t("newsPublic.featured")}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {article.category?.name && (
          <span className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-green">
            <MdCategory className="h-3.5 w-3.5" /> {article.category.name}
          </span>
        )}
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold text-slate-900 transition-colors duration-150 group-hover:text-green">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-500">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
          {article.published_at && (
            <span className="flex items-center gap-1"><MdCalendarToday className="h-3.5 w-3.5" /> {fmtDate(article.published_at)}</span>
          )}
          <span className="flex items-center gap-1"><MdShare className="h-3.5 w-3.5" /> {article.share_count ?? 0}</span>
        </div>
      </div>
    </button>
  );
}

export default function NewsPublicList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { articles: allArticles, loading } = useGetNewsArticles();

  const [search, setSearch] = useState("");

  const articles = useMemo(() => {
    if (!search.trim()) return allArticles;
    const q = search.toLowerCase();
    return allArticles.filter((a) =>
      a.title?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.category?.name?.toLowerCase().includes(q)
    );
  }, [allArticles, search]);

  const hasSearch = search !== "";

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green to-green-700">
        <div className="absolute inset-0 bg-dot-white bg-[size:28px_28px] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("newsPublic.hero_title")}
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg leading-relaxed">
              {t("newsPublic.hero_subtitle")}
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Search */}
        <div className="mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("newsPublic.search_placeholder")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder:text-slate-400"
            />
          </div>
          {hasSearch && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MdClose className="h-4 w-4" /> {t("newsPublic.clear")}
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 h-80" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <MdArticle className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">{hasSearch ? t("newsPublic.no_match") : t("newsPublic.no_articles")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} onClick={() => navigate(`/news/${a.slug}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
