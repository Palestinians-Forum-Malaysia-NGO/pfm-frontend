import React from "react";
import useInView from "hooks/useInView";

const PARTNERS = [
  { name: "Islamic Relief Malaysia",  short: "IRM" },
  { name: "AMAN Palestine",           short: "AP" },
  { name: "MERCY Malaysia",           short: "MM" },
  { name: "UNRWA Malaysia",           short: "UN" },
  { name: "Palestinian Red Crescent", short: "PRC" },
  { name: "Majlis Agama Islam KL",    short: "MAIK" },
];

const PartnersCarousel = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">Together We're Stronger</span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900">Our Partners & Supporters</h2>
        </div>

        <div
          className="grid grid-cols-3 gap-4 sm:grid-cols-6"
          style={{ opacity: inView ? 1 : 0, transition: "all 0.7s ease-in-out", transitionDelay: "150ms" }}
        >
          {PARTNERS.map((p, i) => (
            <div
              key={p.name}
              title={p.name}
              className="flex flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-5 text-center transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:border-green/20 hover:shadow-sm"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sm font-black text-green shadow-sm">
                {p.short}
              </div>
              <p className="text-[10px] font-medium leading-tight text-slate-400">{p.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersCarousel;
