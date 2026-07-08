import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import img1 from "assets/img/gallery/gallery-1.jpg";
import img2 from "assets/img/gallery/gallery-8.jpg";
import img3 from "assets/img/gallery/gallery-12.jpg";

const FeaturedProjects = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const PROJECTS = [
    { img: img1, tag: t("home.proj1_tag"), title: "Gaza Medical Relief Fund",     desc: t("home.proj1_desc"), raised: "RM 145,000", goal: "RM 200,000", progress: 72 },
    { img: img2, tag: t("home.proj2_tag"), title: "Palestine Scholarship Program", desc: t("home.proj2_desc"), raised: "RM 62,000", goal: "RM 100,000", progress: 62 },
    { img: img3, tag: t("home.proj3_tag"), title: "Ramadan Food Baskets",         desc: t("home.proj3_desc"), raised: "RM 38,500", goal: "RM 50,000", progress: 77 },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">

        <div
          className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("home.our_work")}</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">{t("home.featured_projects")}</h2>
          </div>
          <Link to="/donate" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            {t("home.view_all")} <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <div
              key={p.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out, box-shadow 0.3s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-green/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {p.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-bold text-slate-900">{p.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{p.desc}</p>
                <div className="mt-auto">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>{t("home.raised")}: <span className="font-bold text-slate-800">{p.raised}</span></span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green transition-all duration-1000 ease-out"
                      style={{ width: inView ? `${p.progress}%` : "0%", transitionDelay: `${i * 100 + 400}ms` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-400">{t("home.goal")}: {p.goal}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProjects;
