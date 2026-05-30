import React from "react";
import { MdArrowBack } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

/**
 * Full-page "Coming Soon" — use as the root component for an unbuilt route/section.
 *
 * Props:
 *   title       – section/feature name          (default "Coming Soon")
 *   description – supporting line               (default generic)
 *   icon        – ReactNode to replace rocket
 *   backPath    – route string for back button  (default goes back in history)
 *   showBack    – show the back button          (default true)
 */
const ComingSoonPage = ({
  title       = "Coming Soon",
  description = "This section is currently under development. We'll notify you when it's ready.",
  icon,
  backPath,
  showBack = true,
}) => {
  const navigate = useNavigate();
  const handleBack = () => (backPath ? navigate(backPath) : navigate(-1));

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">

      {/* ── Decorative background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-green/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-green/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green/[0.03] blur-3xl" />
      </div>

      {/* ── Dotted grid overlay ── */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Icon ── */}
      <div className="relative mb-8">
        <span className="absolute inset-0 animate-ping rounded-3xl bg-green/15 [animation-duration:2.5s]" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-lg shadow-green/10 ring-1 ring-green/20 text-green">
          {icon ?? <FaHandHoldingHeart className="h-11 w-11" />}
        </div>
      </div>

      {/* ── Badge ── */}
      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-green/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
        Coming Soon
      </span>

      {/* ── Heading ── */}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>

      {/* ── Description ── */}
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
        {description}
      </p>

      {/* ── Divider dots ── */}
      <div className="my-8 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-green/40" />
        <span className="h-1.5 w-6 rounded-full bg-green/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-green/40" />
      </div>

      {/* ── Back button ── */}
      {showBack && (
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 ease-in-out hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97]"
        >
          <MdArrowBack className="h-4 w-4" />
          Go Back
        </button>
      )}

    </div>
  );
};

export default ComingSoonPage;
