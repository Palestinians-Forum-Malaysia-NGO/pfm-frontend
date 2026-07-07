import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdMenu, MdClose, MdPerson, MdLogout, MdHome, MdAssignment, MdSettings } from "react-icons/md";
import logo from "assets/brand/LOGO-wbg.png";

const BeneficiaryNavbar = ({ brandText }) => {
  const { t } = useTranslation();
  const resolvedBrandText = brandText ?? t("navbar.dashboard");
  const NAV_LINKS = [
    { label: t("navbar.dashboard"),    to: "/beneficiary/default",  icon: <MdHome className="h-4 w-4" /> },
    { label: t("navbar.my_requests"),  to: "/beneficiary/requests", icon: <MdAssignment className="h-4 w-4" /> },
    { label: t("navbar.profile"),      to: "/beneficiary/profile",  icon: <MdPerson className="h-4 w-4" /> },
  ];
  const navigate    = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen,  setUserOpen]  = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">

        {/* Logo + brand text */}
        <div className="flex items-center gap-3">
          <Link to="/beneficiary/default" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="PFM" className="h-9 w-9 object-contain" />
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-bold text-slate-900">{t("navbar.pfm_portal")}</p>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">{t("navbar.beneficiary_role")}</p>
            </div>
          </Link>
          <div className="hidden h-5 w-px bg-slate-200 sm:block" />
          <h1 className="hidden text-sm font-semibold text-slate-600 sm:block">{resolvedBrandText}</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-all duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — user menu */}
        <div className="flex items-center gap-2">
          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-all duration-200 ease-in-out hover:bg-slate-100"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green/10 text-green text-xs font-bold">
                B
              </div>
              <span className="hidden sm:block">{t("navbar.beneficiary_role")}</span>
            </button>

            {userOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl">
                <Link to="/beneficiary/profile" onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <MdPerson className="h-4 w-4 text-slate-400" /> {t("navbar.my_profile")}
                </Link>
                <Link to="/beneficiary/settings" onClick={() => setUserOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                  <MdSettings className="h-4 w-4 text-slate-400" /> {t("navbar.settings")}
                </Link>
                <div className="my-1 mx-3 border-t border-slate-100" />
                <button
                  onClick={() => navigate("/auth/sign-in")}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <MdLogout className="h-4 w-4" /> {t("navbar.sign_out")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="relative h-9 w-9 rounded-xl text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <MdMenu size={20} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out ${menuOpen ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
            <MdClose size={20} className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-in-out ${menuOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`grid transition-all duration-300 ease-in-out md:hidden ${menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-slate-100 px-4 pb-4 pt-2">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BeneficiaryNavbar;
