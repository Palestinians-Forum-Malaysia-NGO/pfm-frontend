import React from "react";
import { MdPeople, MdCampaign, MdSchool, MdLocalHospital, MdHandshake, MdGroups } from "react-icons/md";
import useInView from "hooks/useInView";

const OBJECTIVES = [
  { num: "01", icon: <MdPeople className="h-5 w-5" />,       title: "Build a Unified Community",    desc: "Create a strong, connected network of Palestinians and supporters across all Malaysian states." },
  { num: "02", icon: <MdCampaign className="h-5 w-5" />,     title: "Advocate for Palestinian Rights", desc: "Raise the Palestinian cause in Malaysian public, political, and academic spheres." },
  { num: "03", icon: <MdLocalHospital className="h-5 w-5" />,title: "Deliver Humanitarian Aid",     desc: "Coordinate and dispatch medical, food, and financial aid to Palestinians in need." },
  { num: "04", icon: <MdSchool className="h-5 w-5" />,       title: "Support Education",            desc: "Fund scholarships and mentorship programmes for Palestinian students in Malaysia." },
  { num: "05", icon: <MdHandshake className="h-5 w-5" />,    title: "Foster Strategic Partnerships",desc: "Build alliances with Malaysian NGOs, institutions, and international organisations." },
  { num: "06", icon: <MdGroups className="h-5 w-5" />,       title: "Empower Youth Leadership",     desc: "Develop the next generation of Palestinian-Malaysian advocates and community leaders." },
];

const Objectives = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">What We Aim To Do</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Our Objectives</h2>
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
