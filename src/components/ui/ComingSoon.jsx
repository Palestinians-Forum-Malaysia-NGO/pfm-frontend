import React from "react";
import { FaHandHoldingHeart } from "react-icons/fa";

/**
 * Full-section "Coming Soon" placeholder.
 *
 * Props:
 *   title       – feature name shown as the heading  (default "Coming Soon")
 *   description – supporting text                    (default generic message)
 *   icon        – ReactNode override for the centre icon
 *   action      – { label, onClick } optional CTA button
 */
const ComingSoon = ({
  title       = "Coming Soon",
  description = "We're actively building this feature. Check back soon.",
  icon,
  action,
}) => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center">

    {/* Icon with pulse rings */}
    <div className="relative mb-7">
      <span className="absolute inset-0 animate-ping rounded-2xl bg-green/20 [animation-duration:2s]" />
      <span className="absolute inset-0 rounded-2xl bg-green/10" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-green/10 text-green ring-1 ring-green/20">
        {icon ?? <FaHandHoldingHeart className="h-9 w-9" />}
      </div>
    </div>

    {/* Badge */}
    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-green">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
      Coming Soon
    </span>

    {/* Text */}
    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
      {description}
    </p>

    {/* Optional action */}
    {action && (
      <button
        onClick={action.onClick}
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97]"
      >
        {action.label}
      </button>
    )}

  </div>
);

export default ComingSoon;
