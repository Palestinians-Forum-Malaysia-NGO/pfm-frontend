import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLocationOn, MdEmail, MdPhone, MdArrowForward } from "react-icons/md";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import logo from "assets/branding/LOGO-wbg.png";

const SOCIALS = [
  { icon: <FaFacebook size={15} />,  label: "Facebook",  href: "https://facebook.com/PalestinianForumMalaysia" },
  { icon: <FaInstagram size={15} />, label: "Instagram", href: "https://instagram.com/pfm_malaysia" },
  { icon: <FaWhatsapp size={15} />,  label: "WhatsApp",  href: "https://wa.me/601156563044" },
];

const Footer = () => {
  const { t } = useTranslation();

  const NAV_COLS = [
    {
      heading: t("footer.org"),
      links: [
        { label: t("footer.about"),    to: "/about" },
        { label: t("footer.team"),     to: "/about#team" },
        { label: t("footer.partners"), to: "/about#partners" },
        { label: t("footer.contact"),  to: "/contact" },
      ],
    },
    {
      heading: t("footer.get_involved"),
      links: [
        { label: t("footer.donate"),     to: "/donate" },
        { label: t("footer.volunteer"),  to: "/contact" },
        { label: t("footer.membership"), to: "/contact" },
        { label: t("footer.events"),     to: "/events" },
        { label: t("footer.campaigns"),  to: "/projects" },
      ],
    },
    {
      heading: t("footer.projects"),
      links: [
        { label: t("footer.all_projects"), to: "/projects" },
        { label: t("footer.medical"),      to: "/projects?category=medical" },
        { label: t("footer.education"),    to: "/projects?category=education" },
        { label: t("footer.food"),         to: "/projects?category=food" },
        { label: t("footer.community"),    to: "/projects?category=community" },
      ],
    },
    {
      heading: t("footer.resources"),
      links: [
        { label: t("footer.news"),      to: "/news" },
        { label: t("footer.gallery"),   to: "/gallery" },
        { label: t("footer.privacy"),   to: "/privacy" },
        { label: t("footer.terms"),     to: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-green">

      {/* Dot texture */}
      <div className="pointer-events-none absolute inset-0 bg-dot-white bg-[size:32px_32px] opacity-[0.04]" />

      {/* Glow blob */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />

      {/* ── Main grid ── */}
      <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.9fr_repeat(4,1fr)]">

          {/* Brand column */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white p-2 shadow-lg shadow-black/10">
                <img src={logo} alt="PFM" className="h-full w-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-extrabold leading-tight text-white">Palestinian Forum</p>
                <p className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Malaysia</p>
              </div>
            </Link>

            <p className="max-w-[230px] text-sm leading-relaxed text-white/55">
              {t("footer.tagline")}
            </p>

            <ul className="flex flex-col gap-3 text-sm text-white/55">
              <li className="flex items-start gap-2.5">
                <MdLocationOn className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                {t("footer.address")}
              </li>
              <li className="flex items-center gap-2.5">
                <MdEmail className="h-4 w-4 shrink-0 text-white/40" />
                {t("footer.email")}
              </li>
              <li className="flex items-center gap-2.5">
                <MdPhone className="h-4 w-4 shrink-0 text-white/40" />
                {t("footer.phone")}
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-white/50 transition-all duration-150 hover:-translate-y-px hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-sm text-white/55 transition-colors duration-150 hover:text-white"
                    >
                      <MdArrowForward className="-translate-x-1 h-3 w-3 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-start">
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Palestinian Forum Malaysia. {t("footer.rights")}
          </p>
          <p className="text-xs font-semibold text-white/60">
            {t("footer.standing")} 🇵🇸
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
