import React from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetOpportunities } from "components/features/opportunities/hooks";
import Loading from "components/loading/Loading";
import OpportunityApplicationForm from "./OpportunityApplicationForm";

export default function OpportunityApplyPage() {
  const { t } = useTranslation();
  const { opportunities, loading } = useGetOpportunities();

  if (loading) return <Loading text={t("opportunityApply.loading")} />;
  if (opportunities.length === 0) return <Navigate to="/" replace />;

  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-green to-green-700">
        <div className="absolute inset-0 bg-dot-white bg-[size:28px_28px] opacity-10" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{t("opportunityApply.hero_title")}</h1>
          <p className="mt-4 text-base text-white/75 sm:text-lg leading-relaxed">{t("opportunityApply.hero_subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 border border-slate-200">
        <OpportunityApplicationForm opportunities={opportunities} />
      </div>
    </div>
  );
}
