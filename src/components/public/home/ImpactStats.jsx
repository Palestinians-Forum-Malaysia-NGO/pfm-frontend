import React from "react";
import { useTranslation } from "react-i18next";
import { MdFavorite, MdPeople, MdCampaign, MdEvent } from "react-icons/md";
import useInView from "hooks/useInView";

const ImpactStats = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const STATS = [
    { icon: <MdPeople className="h-6 w-6" />,   value: "500+",   label: t("home.stat_members") },
    { icon: <MdFavorite className="h-6 w-6" />, value: "RM 1M+", label: t("home.stat_donations") },
    { icon: <MdCampaign className="h-6 w-6" />, value: "30+",    label: t("home.stat_campaigns") },
    { icon: <MdEvent className="h-6 w-6" />,    value: "120+",   label: t("home.stat_events") },
  ];

  return (
    <section ref={ref} className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 text-center transition-all duration-700 ease-in-out"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10 text-green">
                {s.icon}
              </div>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
