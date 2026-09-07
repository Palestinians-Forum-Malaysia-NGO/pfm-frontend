import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdClose } from "react-icons/md";
import logo from "assets/brand/LOGO-wbg.png";

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "About",   to: "/about" },
  { label: "Events",  to: "/events" },
  { label: "Donate",  to: "/donate" },
  { label: "Contact", to: "/contact" },
];

const PublicNavbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-30 w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="PFM" className="h-10 w-10 object-contain" />
          <div className="leading-tight">
            <p className="text-sm font-bold text-navy-700">Palestinians Forum</p>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">Malaysia</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-green/10 text-green"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/auth/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/donate"
            className="rounded-lg bg-pfmRed-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-pfmRed-600"
          >
            Donate Now
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-green/10 text-green"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-2">
              <Link
                to="/auth/sign-in"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/donate"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-pfmRed-500 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-pfmRed-600"
              >
                Donate Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
