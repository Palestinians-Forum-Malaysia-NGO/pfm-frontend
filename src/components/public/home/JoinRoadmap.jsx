import React from "react";
import { Link } from "react-router-dom";
import { MdHowToReg, MdVerified, MdGroups, MdArrowForward } from "react-icons/md";
import useInView from "hooks/useInView";

const STEPS = [
  { step: "01", icon: <MdHowToReg className="h-6 w-6" />,  title: "Register Online",   desc: "Fill in the simple membership form with your details. Takes less than 5 minutes." },
  { step: "02", icon: <MdVerified className="h-6 w-6" />,  title: "Get Verified",      desc: "Our team reviews your application and approves your membership within 48 hours." },
  { step: "03", icon: <MdGroups className="h-6 w-6" />,    title: "Join the Community",desc: "Access events, campaigns, and connect with the PFM community across Malaysia." },
];

const JoinRoadmap = () => {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className="py-20 text-white"
      style={{ background: "linear-gradient(135deg, #004d26 0%, #007A3D 60%, #005a2c 100%)" }}
    >
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="mb-12 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">Get Started</span>
          <h2 className="mt-3 text-4xl font-extrabold text-white">How to Join PFM</h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">Becoming a member is simple. Here's how to get started.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.step}
              className="flex flex-col gap-4 rounded-3xl bg-white/10 p-7 backdrop-blur-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:bg-white/15"
              style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: "all 0.7s ease-in-out", transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-white/20">{s.step}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                  {s.icon}
                </div>
              </div>
              <h3 className="font-bold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/65">{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)", transition: "all 0.7s ease-in-out", transitionDelay: "300ms" }}
        >
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
            style={{ color: "#007A3D" }}
          >
            Apply for Membership <MdArrowForward className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinRoadmap;
