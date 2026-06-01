import React from "react";
import { MdPeople, MdCampaign, MdSchool, MdLocalHospital } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import useInView from "hooks/useInView";

const CATEGORIES = [
  { icon: <MdPeople className="h-7 w-7" />,          color: "bg-blue-50 text-blue-600",    title: "Community Building",  count: "50+ programs" },
  { icon: <MdCampaign className="h-7 w-7" />,        color: "bg-green/10 text-green",      title: "Advocacy",            count: "30+ campaigns" },
  { icon: <FaHandHoldingHeart className="h-7 w-7" />,color: "bg-red-50 text-red-500",      title: "Humanitarian Aid",    count: "RM 1M+ raised" },
  { icon: <MdSchool className="h-7 w-7" />,          color: "bg-purple-50 text-purple-600",title: "Education Support",   count: "100+ students" },
  { icon: <MdLocalHospital className="h-7 w-7" />,   color: "bg-amber-50 text-amber-600",  title: "Medical Relief",      count: "5+ hospitals" },
];

const ProjectCategories = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">What We Do</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Our Focus Areas</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <div
              key={c.title}
              className="flex flex-col items-center gap-3 rounded-2xl bg-white p-5 text-center shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 70}ms` }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.color}`}>
                {c.icon}
              </div>
              <p className="text-sm font-bold text-slate-800 leading-tight">{c.title}</p>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCategories;
