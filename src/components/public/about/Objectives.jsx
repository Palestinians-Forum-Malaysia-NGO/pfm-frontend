import React from "react";
import { useTranslation } from "react-i18next";
import { MdPeople, MdCampaign, MdSchool, MdLocalHospital, MdHandshake, MdGroups } from "react-icons/md";
import useInView from "hooks/useInView";

const Objectives = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const OBJECTIVES = [
    { num: "01", icon: <MdPeople className="h-5 w-5" />,        title: t("about.obj1_title"), desc: t("about.obj1_desc") },
    { num: "02", icon: <MdCampaign className="h-5 w-5" />,      title: t("about.obj2_title"), desc: t("about.obj2_desc") },
    { num: "03", icon: <MdLocalHospital className="h-5 w-5" />, title: t("about.obj3_title"), desc: t("about.obj3_desc") },
    { num: "04", icon: <MdSchool className="h-5 w-5" />,        title: t("about.obj4_title"), desc: t("about.obj4_desc") },
    { num: "05", icon: <MdHandshake className="h-5 w-5" />,     title: t("about.obj5_title"), desc: t("about.obj5_desc") },
    { num: "06", icon: <MdGroups className="h-5 w-5" />,        title: t("about.obj6_title"), desc: t("about.obj6_desc") },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.objectives_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.objectives_title")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OBJECTIVES.map((obj, i) => (
            <div
              key={obj.num}
              className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-green/20 hover:bg-green/[0.03] hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-green/20 transition-colors duration-200 group-hover:text-green/40">{obj.num}</span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green/10 text-green transition-transform duration-200 group-hover:scale-110">
                  {obj.icon}
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{obj.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{obj.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Objectives;
