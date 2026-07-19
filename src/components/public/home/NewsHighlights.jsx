import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetNewsArticles } from "components/features/news/hooks";
import StorageImage from "components/ui/StorageImage";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : null;

const NewsHighlights = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const navigate = useNavigate();
  const { articles: allArticles, loading } = useGetNewsArticles();

  const latest = [...allArticles]
    .sort((a, b) => new Date(b.published_at ?? b.created_at ?? 0) - new Date(a.published_at ?? a.created_at ?? 0))
    .slice(0, 3);

  if (!loading && latest.length === 0) return null;

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.latest")}</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{t("home.news_updates")}</h2>
          </div>
          <Link to="/news" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("home.all_news")} <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : latest).map((n, i) => (
            <article
              key={n?.id ?? i}
              onClick={n ? () => navigate(`/news/${n.slug}`) : undefined}
              className={`group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-in-out ${n ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl" : ""}`}
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, box-shadow 0.3s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                {n?.cover_image && (
                  <StorageImage fileKey={n.cover_image} alt={n.title} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                )}
                {n?.category?.name && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur-sm">
                    {n.category.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-5">
                {n?.published_at && <p className="text-[11px] font-semibold text-slate-400">{fmtDate(n.published_at)}</p>}
                <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-green transition-colors duration-200">{n ? n.title : "—"}</h3>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-green">
                  {t("home.read_more")} <MdArrowForward className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsHighlights;
