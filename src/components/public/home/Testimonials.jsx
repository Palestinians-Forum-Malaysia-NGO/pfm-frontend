import React from "react";
import useInView from "hooks/useInView";

const TESTIMONIALS = [
  {
    name: "Ahmad Faris",
    role: "Lifetime Member, Kuala Lumpur",
    initials: "AF",
    color: "bg-green/10 text-green",
    quote: "PFM gave me a community where I truly belong. The work they do for Palestine is genuine, transparent, and deeply impactful.",
  },
  {
    name: "Nurul Huda",
    role: "Volunteer, Selangor",
    initials: "NH",
    color: "bg-blue-50 text-blue-600",
    quote: "Being part of PFM changed my perspective. I went from passive supporter to active volunteer — and every event leaves me proud of what we've built.",
  },
  {
    name: "Yusuf Al-Khalidi",
    role: "Palestinian Community Member",
    initials: "YK",
    color: "bg-amber-50 text-amber-600",
    quote: "As a Palestinian living in Malaysia, PFM made me feel seen and heard. They don't just raise funds — they fight for dignity.",
  },
];

const Testimonials = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">Community Voices</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">What Our Members Say</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="flex flex-col gap-5 rounded-3xl bg-white p-7 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              {/* Quote mark */}
              <span className="text-5xl font-black leading-none text-green/15">"</span>
              <p className="text-sm leading-relaxed text-slate-600 -mt-6">{t.quote}</p>
              <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
