import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdArrowForward } from "react-icons/md";

/**
 * Desktop nav item — simple link or hover dropdown.
 * Props: link { label, to, children? }, isActive(to) => boolean
 */
const NavItem = ({ link, isActive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasChildren = !!link.children?.length;

  useEffect(() => {
    const onMouse = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey   = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown",   onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown",   onKey);
    };
  }, []);

  /* ── Simple link ── */
  if (!hasChildren) {
    return (
      <Link
        to={link.to}
        className={`relative px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
          isActive(link.to) ? "text-green" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {link.label}
        {isActive(link.to) && (
          <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-green" />
        )}
      </Link>
    );
  }

  /* ── Dropdown ── */
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOpen(false); }}
    >
      <Link
        to={link.to}
        onClick={() => setOpen(false)}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative inline-flex items-center gap-0.5 px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
          isActive(link.to) ? "text-green" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        {link.label}
        <MdKeyboardArrowDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        />
        {isActive(link.to) && (
          <span className="absolute bottom-0 left-3 h-0.5 w-4 rounded-full bg-green" />
        )}
      </Link>

      {/* Hover bridge — keeps the hit area continuous from trigger to panel,
          so crossing the visual gap doesn't fire mouseleave and close the menu. */}
      <div
        className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2.5 transition-opacity duration-200 ease-in-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Arrow pointer — sibling of the panel so its own overflow-hidden doesn't clip it */}
        <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-100 bg-white" />

        {/* Dropdown panel */}
        <div
          role="menu"
          className={`relative w-full overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-2xl shadow-slate-300/30 backdrop-blur-xl transition-transform duration-200 ease-in-out ${
            open ? "scale-100 translate-y-0" : "scale-95 -translate-y-2"
          }`}
        >
          {link.children.map((child) => (
            <Link
              key={child.label}
              to={child.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-150 ease-in-out hover:bg-slate-50"
            >
              {/* Icon */}
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 ease-in-out group-hover:scale-110 ${child.bg}`}>
                {child.icon}
              </div>
              {/* Title + desc */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 transition-colors duration-150 group-hover:text-green">
                  {child.label}
                </p>
                <p className="truncate text-xs text-slate-400">{child.desc}</p>
              </div>
              {/* Arrow */}
              <span className="inline-flex shrink-0 rtl:rotate-180">
                <MdArrowForward className="h-4 w-4 text-slate-300 transition-all duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:text-green rtl:group-hover:-translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavItem;
