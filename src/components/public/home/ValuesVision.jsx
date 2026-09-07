import React from "react";
import { useTranslation } from "react-i18next";
import { FaHandHoldingHeart } from "react-icons/fa";
import { MdPeople, MdCampaign } from "react-icons/md";
import useInView from "hooks/useInView";

const ValuesVision = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const PILLARS = [
    { icon: <MdPeople className="h-7 w-7" />,          title: t("home.pillar_community"),   desc: t("home.pillar_community_desc") },
    { icon: <MdCampaign className="h-7 w-7" />,        title: t("home.pillar_advocacy"),    desc: t("home.pillar_advocacy_desc") },
    { icon: <FaHandHoldingHeart className="h-7 w-7" />,title: t("home.pillar_humanitarian"),desc: t("home.pillar_humanitarian_desc") },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.our_mission")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("home.what_we_stand_for")}</h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-slate-400">
            {t("home.values_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div
              key={p.title}
              className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-7 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green/10 text-green">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesVision;
