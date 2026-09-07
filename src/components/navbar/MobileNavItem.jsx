import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdArrowForward } from "react-icons/md";

/**
 * Mobile nav item — simple link or click-to-expand accordion.
 * Uses CSS grid-rows trick for perfectly smooth height animation.
 */
const MobileNavItem = ({ link, isActive, onClose }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!link.children?.length;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* ── Simple link ── */
  if (!hasChildren) {
    return (
      <Link
        to={link.to}
        onClick={onClose}
        className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${
          isActive(link.to)
            ? "bg-green/10 text-green"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {link.label}
      </Link>
    );
  }

  /* ── Accordion ── */
  return (
    <div>
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${
          isActive(link.to)
            ? "bg-green/10 text-green"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        {link.label}
        <MdKeyboardArrowDown
          className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-in-out ${
            open ? "rotate-180 text-green" : "text-slate-400"
          }`}
        />
      </button>

      {/* ── Grid-rows accordion — smoothest height transition ── */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pb-2 pl-3 pt-0.5">
            {link.children.map((child, i) => (
              <Link
                key={child.label}
                to={child.to}
                onClick={onClose}
                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-all duration-200 ease-in-out hover:bg-slate-50"
                style={{
                  transitionDelay: open ? `${i * 40}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(-6px)",
                  transition: `opacity 250ms ease-in-out ${i * 40}ms, transform 250ms ease-in-out ${i * 40}ms, background-color 150ms ease-in-out`,
                }}
              >
                {/* Icon */}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ease-in-out group-hover:scale-110 ${child.bg}`}>
                  {child.icon}
                </div>

                {/* Title + desc */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800 transition-colors duration-150 ease-in-out group-hover:text-green">
                    {child.label}
                  </p>
                  <p className="truncate text-[11px] text-slate-400">{child.desc}</p>
                </div>

                {/* Arrow */}
                <span className="inline-flex shrink-0 rtl:rotate-180">
                  <MdArrowForward className="h-3.5 w-3.5 text-slate-300 transition-all duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:text-green rtl:group-hover:-translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavItem;
