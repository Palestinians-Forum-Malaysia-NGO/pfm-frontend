import React from "react";
import { useTranslation } from "react-i18next";
import { MdArticle, MdCalendarToday, MdCategory, MdShare } from "react-icons/md";
import StorageImage from "components/ui/StorageImage";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : null;

export default function NewsCard({ article, onClick }) {
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
