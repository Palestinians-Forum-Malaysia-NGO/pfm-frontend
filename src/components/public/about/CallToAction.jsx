import React from "react";
import { Link } from "react-router-dom";
import { MdFavorite, MdPeople, MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";

const CallToAction = () => {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div
        className="mx-auto max-w-3xl px-6 text-center"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out" }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-green">Take Action</span>
        <h2 className="mt-3 text-4xl font-black leading-tight text-slate-900">
          Be Part of Something<br />
          <span style={{ color: "#007A3D" }}>That Matters.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-400">
          Whether you donate, volunteer, or simply spread the word — every action strengthens our community and amplifies the Palestinian cause.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
            style={{ background: "#007A3D", boxShadow: "0 4px 20px #007A3D30" }}
          >
            <MdPeople className="h-4 w-4" /> Become a Member
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
            style={{ background: "#CE1126", boxShadow: "0 4px 20px #CE112630" }}
          >
            <MdFavorite className="h-4 w-4" /> Donate Now
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
          >
            Volunteer <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
