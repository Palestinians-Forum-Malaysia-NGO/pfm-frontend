import React from "react";
import useInView from "hooks/useInView";

const VALUES = [
  { num: "01", title: "Justice",       desc: "We believe every human life has equal worth. Justice for Palestine is justice for all." },
  { num: "02", title: "Solidarity",    desc: "We stand together — Malaysian, Palestinian, and all who believe in a just world." },
  { num: "03", title: "Transparency",  desc: "Every donation is accounted for. We publish reports so you know where your help goes." },
  { num: "04", title: "Action",        desc: "We don't just raise awareness — we mobilize, fundraise, and act when it matters most." },
];

const CoreValues = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-5xl px-6">

        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">What Guides Us</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <div
              key={v.title}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: "all 0.7s ease-in-out",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Background number watermark */}
              <span className="pointer-events-none absolute -right-2 -top-2 select-none text-7xl font-black text-slate-100 transition-colors duration-200 group-hover:text-green/10">
                {v.num}
              </span>
              <span className="text-3xl font-black text-green/20">{v.num}</span>
              <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{v.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreValues;
