import React from "react";
import { useTranslation } from "react-i18next";

const Donate = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-navy-700">{t("nav.donate")}</h1>
      <p className="mt-4 text-slate-500">{t("nav.donate_page_desc")}</p>
    </div>
  );
};

export default Donate;
