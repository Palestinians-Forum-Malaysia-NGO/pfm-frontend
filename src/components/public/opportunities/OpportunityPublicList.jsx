import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdSearch, MdClose, MdWork, MdLocationOn, MdPeople } from "react-icons/md";
import { useGetOpportunities } from "components/features/opportunities/hooks";

function OpportunityCard({ opportunity, onClick }) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green/30 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex h-32 w-full shrink-0 items-center justify-center bg-gradient-to-br from-green/10 to-green-50">
        <MdWork className="h-10 w-10 text-green/30" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-semibold text-green">
          {t(`opportunities.type_${opportunity.type}`, { defaultValue: opportunity.type })}
        </span>
        <h3 className="mb-1.5 line-clamp-2 text-base font-bold text-slate-900 transition-colors duration-150 group-hover:text-green">
          {opportunity.title}
        </h3>
        <div className="mt-auto flex flex-col gap-1 text-xs text-slate-400">
          {opportunity.location && (
            <span className="flex items-center gap-1"><MdLocationOn className="h-3.5 w-3.5" /> {t(`opportunities.location_${opportunity.location}`, { defaultValue: opportunity.location })}</span>
          )}
          {opportunity.available_positions != null && (
            <span className="flex items-center gap-1"><MdPeople className="h-3.5 w-3.5" /> {t("opportunityApply.positions_available", { count: opportunity.available_positions })}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function OpportunityPublicList({ basePath = "/opportunities" }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { opportunities: allOpportunities, loading } = useGetOpportunities();

  const [search, setSearch] = useState("");

  const opportunities = useMemo(() => {
    if (!search.trim()) return allOpportunities;
    const q = search.toLowerCase();
    return allOpportunities.filter((o) =>
      o.title?.toLowerCase().includes(q) ||
      (o.description ?? "").toLowerCase().includes(q)
    );
  }, [allOpportunities, search]);

  const hasSearch = search !== "";

  return (
    <div>
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green to-green-700">
        <div className="absolute inset-0 bg-dot-white bg-[size:28px_28px] opacity-10" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl leading-tight">
              {t("opportunityApply.hero_title")}
            </h1>
            <p className="mt-4 text-base text-white/75 sm:text-lg leading-relaxed">
              {t("opportunityApply.hero_subtitle")}
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
              placeholder={t("opportunityApply.search_placeholder")}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 outline-none focus:border-green focus:ring-2 focus:ring-green/20 placeholder:text-slate-400"
            />
          </div>
          {hasSearch && (
            <button
              onClick={() => setSearch("")}
              className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <MdClose className="h-4 w-4" /> {t("opportunityApply.clear")}
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-slate-50 h-64" />
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <div className="py-20 text-center">
            <MdWork className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">{hasSearch ? t("opportunityApply.no_match") : t("opportunityApply.no_opportunities")}</p>
            {hasSearch && (
              <button onClick={() => setSearch("")} className="mt-4 text-sm font-medium text-green hover:underline">
                {t("opportunityApply.clear")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} onClick={() => navigate(`${basePath}/${o.id}`)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
