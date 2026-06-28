import React from "react";
import { Link } from "react-router-dom";
import { MdFavorite, MdArrowForward, MdPeople, MdCampaign } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import img1 from "assets/img/layout/ngo-bg-4.jpg";
import img2 from "assets/img/layout/ngo-bg-5.jpg";

const PARTNERS = ["Islamic Relief", "MERCY Malaysia", "AMAN Palestine", "UNRWA"];

const STATS = [
  { value: "500+",   label: "Members",   icon: <MdPeople className="h-4 w-4" />,           color: "bg-green text-white",      delay: "0.5s" },
  { value: "RM 1M+", label: "Raised",   icon: <FaHandHoldingHeart className="h-4 w-4" />,  color: "bg-white text-slate-900",  delay: "0.65s" },
  { value: "30+",    label: "Campaigns", icon: <MdCampaign className="h-4 w-4" />,          color: "bg-red-500 text-white",     delay: "0.8s" },
];

const HeroSection = () => (
  <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-green-50 to-white pt-16">
    {/* Subtle dot grid */}
    <div className="pointer-events-none absolute inset-0 bg-dot-green bg-[size:32px_32px] opacity-40" />

    {/* Green blob top-right */}
    <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green opacity-20 blur-3xl" />

    <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">

        {/* ── LEFT ── */}
        <div>
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-green"
            style={{ animation: "fadeUp 0.7s ease both" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
            Palestinian Forum Malaysia
          </span>

          {/* Headline */}
          <h1
            className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.25rem]"
            style={{ animation: "fadeUp 0.7s 0.1s ease both" }}
          >
            Serving Our<br />
            <span className="text-green">Community.</span>
          </h1>

          {/* Description */}
          <p
            className="mt-5 max-w-md text-base leading-relaxed text-slate-500"
            style={{ animation: "fadeUp 0.7s 0.2s ease both" }}
          >
            Uniting Palestinians and supporters across Malaysia through community, advocacy, and humanitarian action.
          </p>

          {/* CTAs */}
          <div
            className="mt-8 flex flex-wrap items-center gap-3"
            style={{ animation: "fadeUp 0.7s 0.3s ease both" }}
          >
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
              className="bg-pfmRed-500 shadow-glow-red"
            >
              <MdFavorite className="h-4 w-4" /> Donate Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
            >
              Join Us <MdArrowForward className="h-4 w-4" />
            </Link>
          </div>

          {/* Partners */}
          <div
            className="mt-10 border-t border-slate-100 pt-7"
            style={{ animation: "fadeUp 0.7s 0.4s ease both" }}
          >
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">Supported by</p>
            <div className="flex flex-wrap items-center gap-4">
              {PARTNERS.map((p) => (
                <span key={p} className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT — Image collage ── */}
        <div className="relative hidden h-[520px] lg:block" style={{ animation: "fadeUp 0.7s 0.15s ease both" }}>

          {/* Main image — top right */}
          <div className="absolute right-0 top-0 h-[58%] w-[58%] overflow-hidden rounded-3xl shadow-2xl">
            <img src={img1} alt="PFM Community" className="h-full w-full object-cover" />
          </div>

          {/* Secondary image — bottom left */}
          <div className="absolute bottom-0 left-0 h-[52%] w-[65%] overflow-hidden rounded-3xl shadow-xl">
            <img src={img2} alt="PFM Action" className="h-full w-full object-cover" />
          </div>

          {/* Floating stat cards */}
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`absolute flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl ${s.color}`}
              style={{
                top: i === 0 ? "5%" : i === 1 ? "42%" : undefined,
                bottom: i === 2 ? "8%" : undefined,
                left: i === 0 ? "4%" : i === 2 ? "48%" : undefined,
                right: i === 1 ? "-4%" : undefined,
                animation: `fadeUp 0.7s ${s.delay} ease both`,
                backdropFilter: "blur(8px)",
                minWidth: "130px",
              }}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                s.color.includes("bg-green") ? "bg-white/20" :
                s.color.includes("bg-white") ? "bg-green/10 text-green" :
                "bg-white/15"
              }`}>
                {s.icon}
              </div>
              <div>
                <p className="text-lg font-black leading-none">{s.value}</p>
                <p className={`text-[11px] font-medium ${s.color.includes("text-white") ? "text-white/70" : "text-slate-500"}`}>{s.label}</p>
              </div>
            </div>
          ))}

          {/* Decorative ring */}
          <div
            className="absolute"
            className="border-2 border-dashed border-green/25"
            style={{ bottom: "28%", left: "57%", width: "72px", height: "72px", borderRadius: "50%", animation: "spin 20s linear infinite" }}
          />

        </div>
      </div>
    </div>

    {/* Scroll hint */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-300" style={{ animation: "fadeUp 1s 0.8s ease both" }}>
      <span className="text-[10px] uppercase tracking-widest">Scroll</span>
      <span className="h-5 w-px bg-slate-200" />
    </div>
  </section>
);

export default HeroSection;
