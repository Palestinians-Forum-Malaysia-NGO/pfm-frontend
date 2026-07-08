import React from "react";
import { useTranslation } from "react-i18next";

import heroBg from "assets/img/gallery/gallery-16.jpg";

const DonateHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
      <img src={heroBg} alt={t("donate.hero_alt")} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

      <div className="relative z-10 px-6 text-center text-white">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">{t("donate.hero_label")}</span>
        <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">{t("donate.hero_title")}</h1>
        <p className="mt-4 text-base text-white/60">{t("donate.hero_subtitle")}</p>
      </div>
    </section>
  );
};

export default DonateHero;
