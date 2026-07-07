import React from "react";
import { useTranslation } from "react-i18next";
import { MdLocationOn } from "react-icons/md";
import useInView from "hooks/useInView";

const LOCATIONS = [
  { city: "Kuala Lumpur",  state: "Federal Territory", members: "180+", primary: true },
  { city: "Selangor",      state: "Selangor",          members: "95+" },
  { city: "Penang",        state: "Pulau Pinang",      members: "60+" },
  { city: "Johor Bahru",   state: "Johor",             members: "45+" },
  { city: "Kota Kinabalu", state: "Sabah",             members: "30+" },
  { city: "Kuching",       state: "Sarawak",           members: "25+" },
];

const CoverageMap = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center transition-all duration-700 ease-in-out"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.coverage_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("about.coverage_title")}</h2>
          <p className="mx-auto mt-3 max-w-md text-base text-slate-400">
            {t("about.coverage_desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {LOCATIONS.map((loc, i) => (
            <div
              key={loc.city}
              className={`flex flex-col gap-3 rounded-2xl p-5 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md transition-[opacity,transform] duration-700 ease-in-out ${
                loc.primary
                  ? "border-2 border-green/20 bg-green/5"
                  : "border border-slate-200 bg-white"
              }`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 70}ms`,
              }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${loc.primary ? "bg-green text-white" : "bg-green/10 text-green"}`}>
                <MdLocationOn className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900">{loc.city}</p>
                <p className="text-xs text-slate-400">{loc.state}</p>
              </div>
              <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${loc.primary ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                {loc.members} {t("about.members_suffix")}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoverageMap;
