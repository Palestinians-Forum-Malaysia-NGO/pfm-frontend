import React from "react";
import { useTranslation } from "react-i18next";
import heroBg from "assets/img/layout/ngo-bg-1.jpg";

const AboutHero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative flex h-[65vh] items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt="About PFM"
        className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[8000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

      {/* Flag strip */}
      <div className="absolute left-0 top-0 flex h-1 w-full">
        <div className="flex-1 bg-black" />
        <div className="flex-1 bg-white/80" />
        <div className="flex-1 bg-white/20" />
        <div className="flex-1 bg-pfmRed-500" />
      </div>

      <div className="relative z-10 px-6 text-center text-white">
        <span
          className="text-xs font-bold uppercase tracking-[0.25em] text-white/60"
          style={{ animation: "fadeUp 0.8s ease both" }}
        >
          {t("about.hero_badge")}
        </span>
        <h1
          className="mt-3 text-5xl font-black tracking-tight sm:text-6xl"
          style={{ animation: "fadeUp 0.8s 0.1s ease both" }}
        >
          {t("about.hero_title")}
        </h1>
        <p
          className="mt-4 text-base text-white/60"
          style={{ animation: "fadeUp 0.8s 0.2s ease both" }}
        >
          {t("about.hero_subtitle")}
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
