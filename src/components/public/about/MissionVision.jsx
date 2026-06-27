import React from "react";
import { MdArrowForward } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import useInView from "hooks/useInView";
import storyImg from "assets/img/layout/ngo-bg-2.jpg";

const MissionVision = () => {
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
            <span className="text-xs font-bold uppercase tracking-widest text-green">Our Story</span>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-slate-900">
              Born from Solidarity,<br />Driven by Purpose
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-500">
              Palestinian Forum Malaysia was founded by Palestinians and Malaysian supporters who needed an organized, credible voice for Palestine in Malaysia.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-500">
              What started as informal gatherings has grown into a structured organization running campaigns, hosting events, and channelling aid directly to Palestinians in need.
            </p>
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
            <h3 className="text-2xl font-black text-slate-900">Our Mission</h3>
            <p className="leading-relaxed text-slate-500">
              To unite Palestinians and supporters in Malaysia, advocate for Palestinian rights, deliver humanitarian aid, and raise awareness through community action.
            </p>
          </div>
          <div
            className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8"
            style={show(120)}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10 text-green">
              <MdArrowForward className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Our Vision</h3>
            <p className="leading-relaxed text-slate-500">
              A free, just Palestine — and a Malaysian community that stands proudly with the Palestinian people, informed, organized, and ready to act with compassion and strength.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;
