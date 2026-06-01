import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import logo       from "assets/brand/LOGO-wbg.png";
import navLinks   from "./navLinks";
import NavItem    from "./NavItem";
import MobileNavItem from "./MobileNavItem";

const PublicNavbar = ({ links = navLinks }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === "/";

  /* Scroll detection — home page only */
  useEffect(() => {
    if (!isHome) { setScrolled(false); return; }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  /* Close on route change or Escape */
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
    <header
      className={`left-0 right-0 top-0 z-30 w-full transition-all duration-300 ease-in-out ${
        isHome ? "fixed" : "sticky"
      }`}
    >
      {/* ── Floating pill ── */}
      <div className={`mx-auto max-w-6xl px-4 transition-all duration-300 ease-in-out ${
        transparent ? "py-4" : "py-2"
      }`}>
        <div className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-300 ease-in-out ${
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
            {links.map((link) => (
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
            className="relative h-9 w-9 rounded-xl text-slate-500 transition-all duration-200 ease-in-out hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <MdMenu
              size={20}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out ${
                menuOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <MdClose
              size={20}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out ${
                menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
              }`}
            />
          </button>
        </div>

        {/* ── Mobile menu — grid-rows for smooth height ── */}
        <div className={`grid transition-all duration-300 ease-in-out ${
          menuOpen ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}>
        <div className="overflow-hidden">
          <div className="rounded-2xl border border-slate-100 bg-white/95 px-4 pb-4 pt-2 shadow-lg backdrop-blur-xl">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile navigation">
              {links.map((link) => (
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

      </div>
    </header>
  );
};

export default PublicNavbar;
