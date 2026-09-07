import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import aboutImg from "assets/img/gallery/gallery-2.jpg";

const AboutPFM = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const show = { opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out" };

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

          <div style={{ ...show, transitionDelay: "0ms" }}>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about_pfm.label")}</span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900">
              {t("about_pfm.title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              {t("about_pfm.body1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              {t("about_pfm.body2")}
            </p>
            <Link
              to="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-green bg-white px-6 py-2.5 text-sm font-semibold text-green transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-green/5 active:scale-[0.98]"
            >
              {t("about_pfm.cta")} <MdArrowForward className="h-4 w-4" />
            </Link>
          </div>

          <div style={{ ...show, transitionDelay: "150ms" }} className="overflow-hidden rounded-3xl shadow-xl">
            <img src={aboutImg} alt={t("hero.img_community_alt")} className="h-[420px] w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutPFM;
