import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdWork, MdLocationOn, MdPeople } from "react-icons/md";
import { useGetOpportunity, useGetOpportunities } from "components/features/opportunities/hooks";
import Loading from "components/loading/Loading";
import OpportunityApplicationForm from "./OpportunityApplicationForm";

export default function OpportunityPublicDetail({ basePath = "/opportunities" }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { opportunity, execute: fetchOpportunity, loading, error } = useGetOpportunity();
  const { opportunities: allOpportunities } = useGetOpportunities();

  useEffect(() => { fetchOpportunity(id).catch(() => {}); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <Loading text={t("opportunityApply.loading_one")} />;

  if (error || !opportunity) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <MdWork className="mx-auto mb-4 h-16 w-16 text-slate-200" />
        <h2 className="mb-2 text-xl font-bold text-slate-700">{t("opportunityApply.not_found_title")}</h2>
        <p className="mb-6 text-sm text-slate-400">{t("opportunityApply.not_found_body")}</p>
        <button onClick={() => navigate(basePath)} className="inline-flex items-center gap-2 rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90">
          <MdArrowBack className="h-4 w-4" /> {t("opportunityApply.back_to_opportunities")}
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {/* ── Header block ── */}
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(basePath)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-150 hover:text-green"
        >
          <MdArrowBack className="h-4 w-4" /> {t("opportunityApply.back_to_opportunities")}
        </button>

        <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-green/10 px-2.5 py-0.5 text-xs font-semibold text-green">
          {t(`opportunities.type_${opportunity.type}`, { defaultValue: opportunity.type })}
        </span>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          {opportunity.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium uppercase tracking-wide text-slate-400">
          {opportunity.location && (
            <span className="flex items-center gap-1.5"><MdLocationOn className="h-3.5 w-3.5" /> {t(`opportunities.location_${opportunity.location}`, { defaultValue: opportunity.location })}</span>
          )}
          {opportunity.available_positions != null && (
            <span className="flex items-center gap-1.5"><MdPeople className="h-3.5 w-3.5" /> {t("opportunityApply.positions_available", { count: opportunity.available_positions })}</span>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {opportunity.description && (
          <p className="mb-10 text-[15px] leading-relaxed text-slate-700 whitespace-pre-wrap">{opportunity.description}</p>
        )}

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
          <OpportunityApplicationForm opportunityId={opportunity.id} opportunities={allOpportunities} />
        </div>
      </div>

      
    </div>
  );
}
