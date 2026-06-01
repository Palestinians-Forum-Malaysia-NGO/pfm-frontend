import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdMenu, MdClose, MdKeyboardArrowDown, MdArrowForward,
  MdPeople, MdEvent, MdCalendarToday, MdHistory,
  MdFavorite, MdCampaign, MdVolunteerActivism, MdMail,
} from "react-icons/md";
import logo from "assets/brand/LOGO-wbg.png";

/* ── Default nav links (can be overridden via props) ── */
const DEFAULT_NAV_LINKS = [
  { label: "Home", to: "/" },
  {
    label: "Events", to: "/events",
    children: [
      { label: "All Events",  to: "/events", desc: "Browse every PFM event",          icon: <MdEvent className="h-4 w-4" />,         bg: "bg-amber-50 text-amber-500" },
      { label: "Upcoming",    to: "/events", desc: "What's happening near you soon",  icon: <MdCalendarToday className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: "Past Events", to: "/events", desc: "Relive our community highlights", icon: <MdHistory className="h-4 w-4" />,       bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: "Donate", to: "/donate",
    children: [
      { label: "Donate Now",   to: "/donate",    desc: "Every ringgit makes a difference", icon: <MdFavorite className="h-4 w-4" />,         bg: "bg-red-50 text-red-500" },
      { label: "Campaigns",    to: "/campaigns", desc: "Active fundraising campaigns",      icon: <MdCampaign className="h-4 w-4" />,         bg: "bg-green/10 text-green" },
      { label: "Aid Projects", to: "/donate",    desc: "Direct aid to those in need",       icon: <MdVolunteerActivism className="h-4 w-4" />, bg: "bg-blue-50 text-blue-500" },
    ],
  },
  {
    label: "Contact", to: "/contact",
    children: [
      { label: "Get in Touch", to: "/contact", desc: "Send us a message anytime",    icon: <MdMail className="h-4 w-4" />,   bg: "bg-green/10 text-green" },
      { label: "Volunteer",    to: "/contact", desc: "Give your time to the cause",  icon: <MdPeople className="h-4 w-4" />, bg: "bg-purple-50 text-purple-500" },
    ],
  },
  { label: "About", to: "/about" },
];

/* ─────────────────────────────────────────────────────────────
   Desktop dropdown item
───────────────────────────────────────────────────────────── */
const NavItem = ({ link, isActive }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const hasChildren = !!link.children?.length;

  // Close on click-outside OR Escape
  useEffect(() => {
    const onMouse = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey   = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  /* Simple link */
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

  /* Dropdown link */
  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Trigger */}
      <button
        className={`relative inline-flex items-center gap-0.5 px-3 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out ${
          isActive(link.to) ? "text-green" : "text-slate-600 hover:text-slate-900"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {link.label}
        <MdKeyboardArrowDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        />
        {isActive(link.to) && (
          <span className="absolute bottom-0 left-3 h-0.5 w-4 rounded-full bg-green" />
        )}
      </button>

      {/* Dropdown panel — no inline styles, pure Tailwind */}
      <div
        role="menu"
        className={`absolute left-1/2 top-[calc(100%+10px)] z-50 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-2xl shadow-slate-300/30 backdrop-blur-xl transition-all duration-200 ease-in-out ${
          open
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        {/* Arrow pointer */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l border-t border-slate-100 bg-white" />

        {link.children.map((child) => (
          <Link
            key={child.label}
            to={child.to}
            role="menuitem"
            className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-150 ease-in-out hover:bg-slate-50"
          >
            {/* Left icon */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 ease-in-out group-hover:scale-110 ${child.bg}`}>
              {child.icon}
            </div>

            {/* Title + description */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 transition-colors duration-150 group-hover:text-green">
                {child.label}
              </p>
              <p className="truncate text-xs text-slate-400">{child.desc}</p>
            </div>

            {/* Right arrow */}
            <MdArrowForward className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 ease-in-out group-hover:translate-x-0.5 group-hover:text-green" />
          </Link>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Mobile accordion item
───────────────────────────────────────────────────────────── */
const MobileNavItem = ({ link, isActive, onClose }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!link.children?.length;

  // Escape closes accordion
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!hasChildren) {
    return (
      <Link
        to={link.to}
        onClick={onClose}
        className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
          isActive(link.to) ? "bg-green/10 text-green" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
          isActive(link.to) ? "bg-green/10 text-green" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        {link.label}
        <MdKeyboardArrowDown
          className={`h-4 w-4 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Accordion body — max-h trick, no inline styles */}
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l-2 border-slate-100 pb-1 pl-3">
          {link.children.map((child) => (
            <Link
              key={child.label}
              to={child.to}
              onClick={onClose}
              className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors duration-150 hover:bg-slate-50"
            >
              {/* Left icon */}
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${child.bg}`}>
                {child.icon}
              </div>

              {/* Title + description */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 group-hover:text-green transition-colors duration-150">
                  {child.label}
                </p>
                <p className="truncate text-[11px] text-slate-400">{child.desc}</p>
              </div>

              {/* Right arrow */}
              <MdArrowForward className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-green" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main navbar — accepts navLinks as prop
───────────────────────────────────────────────────────────── */
const PublicNavbar = ({ navLinks = DEFAULT_NAV_LINKS }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!isHome) { setScrolled(false); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close mobile menu on route change or Escape
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const transparent = isHome && !scrolled;

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className={`left-0 right-0 top-0 z-30 w-full transition-all duration-300 ease-in-out ${isHome ? "fixed" : "sticky"}`}>

      {/* Floating pill */}
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-300 ease-in-out ${transparent ? "py-4" : "py-2"}`}>
        <div className={`flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ease-in-out ${
          transparent
            ? "bg-white/60 shadow-sm ring-1 ring-slate-200/40 backdrop-blur-md"
            : "bg-white/95 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/60 backdrop-blur-xl"
        }`}>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src={logo} alt="PFM" className="h-9 w-9 object-contain" />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold text-slate-900">Palestinians Forum</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">Malaysia</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavItem key={link.to + link.label} link={link} isActive={isActive} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <Link
              to="/auth/sign-in"
              className="px-4 py-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
            >
              Sign In
            </Link>
            <Link
              to="/donate"
              className="rounded-full bg-pfmRed-500 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-pfmRed-500/30 transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-pfmRed-600 active:scale-[0.98]"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>

        {/* Mobile menu — inside pill */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-[600px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
          <div className="rounded-2xl border border-slate-100 bg-white/95 px-4 pb-4 pt-2 shadow-lg backdrop-blur-xl">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <MobileNavItem
                  key={link.to + link.label}
                  link={link}
                  isActive={isActive}
                  onClose={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Link
                to="/auth/sign-in"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl bg-pfmRed-500 px-3 py-2.5 text-center text-sm font-bold text-white hover:bg-pfmRed-600"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default PublicNavbar;
