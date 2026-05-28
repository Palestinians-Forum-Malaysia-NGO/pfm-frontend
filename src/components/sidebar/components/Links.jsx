/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";

const SECTION_ORDER = ["MAIN", "COMMUNITY", "SYSTEM", "ACCOUNT"];

// ── Single nav item (with or without children) ─────────────────────────────────
function NavItem({ route }) {
  const location = useLocation();

  const isPathActive = (path) => location.pathname.includes(path);

  const hasChildren = Array.isArray(route.children) && route.children.length > 0;

  // Auto-open accordion if any child is currently active
  const childIsActive = hasChildren && route.children.some((c) => isPathActive(c.path));
  const [open, setOpen] = React.useState(childIsActive);

  // Keep open state in sync when navigating via URL directly
  React.useEffect(() => {
    if (childIsActive) setOpen(true);
  }, [location.pathname]);

  const parentActive = hasChildren ? childIsActive : isPathActive(route.path);

  // ── Parent with children (accordion) ────────────────────────────────────────
  if (hasChildren) {
    return (
      <div className="mb-0.5">
        {/* Accordion trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
            parentActive ? "bg-green/10" : "hover:bg-gray-100"
          }`}
        >
          <span
            className={`flex-shrink-0 transition-colors ${
              parentActive
                ? "text-green"
                : "text-gray-400 group-hover:text-green"
            }`}
          >
            {route.icon}
          </span>
          <span
            className={`flex-1 text-left text-sm font-medium transition-colors ${
              parentActive ? "text-green" : "text-navy-700"
            }`}
          >
            {route.name}
          </span>
          <MdChevronRight
            className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
              open ? "rotate-90" : ""
            }`}
          />
        </button>

        {/* Children — animated with max-height */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-4 mt-0.5 flex flex-col border-l-2 border-gray-100 pl-3">
            {route.children.map((child, i) => {
              const active = isPathActive(child.path);
              return (
                <Link key={i} to={`${route.layout}/${child.path}`}>
                  <div
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-all duration-150 ${
                      active
                        ? "font-semibold text-green"
                        : "font-medium text-gray-500 hover:text-navy-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
                        active ? "bg-green" : "bg-gray-300"
                      }`}
                    />
                    {child.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Regular link (no children) ───────────────────────────────────────────────
  return (
    <Link to={route.layout + "/" + route.path}>
      <div
        className={`group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
          parentActive
            ? "border-l-4 border-green text-green bg-green/10"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`flex-shrink-0 transition-colors ${
            parentActive
              ? "text-green"
              : "text-gray-400 group-hover:text-green"
          }`}
        >
          {route.icon}
        </span>
        <span
          className={`flex-1 text-sm font-medium transition-colors ${
            parentActive ? "text-green" : "text-navy-700"
          }`}
        >
          {route.name}
        </span>
        {parentActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-green/60" />
        )}
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function SidebarLinks({ routes, layout = "/admin" }) {
  const grouped = SECTION_ORDER.reduce((acc, section) => {
    const items = routes.filter(
      (r) => r.layout === layout && r.section === section
    );
    if (items.length) acc[section] = items;
    return acc;
  }, {});

  return (
    <nav className="flex flex-col gap-1 px-4">
      {SECTION_ORDER.map((section) => {
        if (!grouped[section]) return null;
        return (
          <div key={section} className="mb-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {section}
            </p>
            {grouped[section].map((route, i) => (
              <NavItem key={i} route={route} />
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export default SidebarLinks;
