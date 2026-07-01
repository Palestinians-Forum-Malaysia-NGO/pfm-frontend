import React from "react";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import useInView from "hooks/useInView";
import storyImg from "assets/img/layout/ngo-bg-2.jpg";

const MissionVision = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const show = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.7s ease-in-out ${delay}ms, transform 0.7s ease-in-out ${delay}ms`,
  });

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">

        {/* Story split */}
        <div className="mb-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div style={show(0)}>
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img src={storyImg} alt="Our Story" className="h-[460px] w-full object-cover transition-transform duration-500 ease-in-out hover:scale-105" />
            </div>
          </div>
          <div style={show(150)}>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("about.our_story")}</span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900">
              {t("about.story_title")}<br />{t("about.story_title2")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">{t("about.story_body1")}</p>
            <p className="mt-4 text-base leading-relaxed text-slate-500">{t("about.story_body2")}</p>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div
            className="flex flex-col gap-4 rounded-3xl border border-green/20 bg-green/5 p-8"
            style={show(0)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/15 text-green">
              <FaHandHoldingHeart className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{t("about.mission_label")}</h3>
            <p className="leading-relaxed text-slate-500">{t("about.mission_body")}</p>
          </div>
          <div
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8"
            style={show(120)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10 text-green">
              <MdArrowForward className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{t("about.vision_label")}</h3>
            <p className="leading-relaxed text-slate-500">{t("about.vision_body")}</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
