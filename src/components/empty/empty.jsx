import React from "react";

const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description,
  action,      // { label: string, onClick: fn } or { label: string, href: string }
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {/* Icon ring */}
    {icon && (
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 text-2xl ring-1 ring-slate-200">
        {icon}
      </div>
    )}

    {/* Text */}
    <p className="text-base font-semibold text-slate-700">{title}</p>
    {description && (
      <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-400">
        {description}
      </p>
    )}

    {/* Optional CTA */}
    {action && (
      <div className="mt-5">
        {action.href ? (
          <a
            href={action.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833]"
          >
            {action.label}
          </a>
        ) : (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833]"
          >
            {action.label}
          </button>
        )}
      </div>
    )}
  </div>
);

export default EmptyState;
