import React from "react";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";
import img1 from "assets/img/layout/ngo-bg-4.jpg";
import img2 from "assets/img/layout/ngo-bg-5.jpg";
import img3 from "assets/img/layout/ngo-bg-6.jpg";

const PROJECTS = [
  {
    img: img1,
    tag: "Medical Aid",
    title: "Gaza Medical Relief Fund",
    desc: "Funding critical medical supplies and equipment for hospitals in Gaza.",
    raised: "RM 145,000",
    goal: "RM 200,000",
    progress: 72,
  },
  {
    img: img2,
    tag: "Education",
    title: "Palestine Scholarship Program",
    desc: "Supporting Palestinian students in Malaysia with scholarships and mentorship.",
    raised: "RM 62,000",
    goal: "RM 100,000",
    progress: 62,
  },
  {
    img: img3,
    tag: "Food Aid",
    title: "Ramadan Food Baskets",
    desc: "Distributing essential food parcels to displaced families during Ramadan.",
    raised: "RM 38,500",
    goal: "RM 50,000",
    progress: 77,
  },
];

const FeaturedProjects = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">

        <div
          className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">Our Work</span>
            <h2 className="mt-2 text-4xl font-extrabold text-slate-900">Featured Projects</h2>
          </div>
          <Link to="/donate" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green transition-colors hover:text-[#005a2c]">
            View all <MdArrowForward className="h-4 w-4" />
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
                    <span>Raised: <span className="font-bold text-slate-800">{p.raised}</span></span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-green transition-all duration-1000 ease-out"
                      style={{ width: inView ? `${p.progress}%` : "0%", transitionDelay: `${i * 100 + 400}ms` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-[11px] text-slate-400">Goal: {p.goal}</p>
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
