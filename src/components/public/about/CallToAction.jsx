import React from "react";
import { Link } from "react-router-dom";
import { MdFavorite, MdPeople, MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";

const CallToAction = () => {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className="py-20 text-white"
      style={{ background: "linear-gradient(135deg, #004d26 0%, #007A3D 60%, #005a2c 100%)" }}
    >
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div
        className="relative mx-auto max-w-3xl px-6 text-center"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out" }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Take Action</span>
        <h2 className="mt-3 text-4xl font-black leading-tight">
          Be Part of Something<br />
          <span style={{ color: "#a8f0c6" }}>That Matters.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/65">
          Whether you donate, volunteer, or simply spread the word — every action strengthens our community and amplifies the Palestinian cause.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
            style={{ color: "#007A3D" }}
          >
            <MdPeople className="h-4 w-4" /> Become a Member
          </Link>
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
            style={{ background: "#CE1126", boxShadow: "0 4px 20px #CE112640" }}
          >
            <MdFavorite className="h-4 w-4" /> Donate Now
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-white/20 active:scale-[0.98]"
          >
            Volunteer <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
