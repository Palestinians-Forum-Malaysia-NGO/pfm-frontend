import React from "react";
import { useTranslation } from "react-i18next";

const PublicEvents = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-navy-700" style={{ animation: "fadeUp 0.7s ease both" }}>{t("nav.events")}</h1>
      <p className="mt-4 text-slate-500" style={{ animation: "fadeUp 0.7s 0.1s ease both" }}>{t("nav.events_page_desc")}</p>
    </div>
  );
};

export default PublicEvents;
