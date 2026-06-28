import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdEmail, MdPhone, MdArrowForward } from "react-icons/md";
import {
  FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "assets/brand/LOGO-wbg.png";

const NAV_COLS = [
  {
    heading: "Organisation",
    links: [
      { label: "About PFM",      to: "/about" },
      { label: "Our Team",       to: "/about#team" },
      { label: "Our Partners",   to: "/about#partners" },
      { label: "Annual Reports", to: "/about#reports" },
      { label: "Contact Us",     to: "/contact" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "Donate Now",  to: "/donate" },
      { label: "Volunteer",   to: "/contact" },
      { label: "Membership",  to: "/contact" },
      { label: "Events",      to: "/events" },
      { label: "Campaigns",   to: "/projects" },
    ],
  },
  {
    heading: "Projects",
    links: [
      { label: "All Projects",       to: "/projects" },
      { label: "Medical Aid",        to: "/projects?category=medical" },
      { label: "Education Support",  to: "/projects?category=education" },
      { label: "Food Aid",           to: "/projects?category=food" },
      { label: "Community Building", to: "/projects?category=community" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "News & Blog",    to: "/news" },
      { label: "Gallery",        to: "/gallery" },
      { label: "Downloads",      to: "/about#reports" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Use",   to: "/terms" },
    ],
  },
];

const SOCIALS = [
  { icon: <FaFacebook size={15} />,  label: "Facebook",    href: "https://facebook.com/pfmalaysia" },
  { icon: <FaXTwitter size={14} />,  label: "X / Twitter", href: "https://x.com/pfmalaysia" },
  { icon: <FaInstagram size={15} />, label: "Instagram",   href: "https://instagram.com/pfmalaysia" },
  { icon: <FaYoutube size={15} />,   label: "YouTube",     href: "https://youtube.com/@pfmalaysia" },
  { icon: <FaTelegram size={15} />,  label: "Telegram",    href: "https://t.me/pfmalaysia" },
  { icon: <FaWhatsapp size={15} />,  label: "WhatsApp",    href: "https://wa.me/60123456789" },
];

const Footer = () => (
  <footer className="relative overflow-hidden bg-green">

    {/* Dot texture */}
    <div className="pointer-events-none absolute inset-0 bg-dot-white bg-[size:32px_32px] opacity-[0.04]" />

    {/* Glow blob */}
    <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-green-400/20 blur-3xl" />

    {/* Palestinian flag strip */}
    <div className="relative flex h-1 w-full">
      <div className="flex-1 bg-black" />
      <div className="flex-1 bg-white/80" />
      <div className="flex-1 bg-white/20" />
      <div className="flex-1 bg-pfmRed-500" />
    </div>

    {/* ── Main grid ── */}
    <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-14">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.9fr_repeat(4,1fr)]">

        {/* Brand column */}
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-lg shadow-black/10">
              <img src={logo} alt="PFM" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-white">Palestinian Forum</p>
              <p className="text-[11px] font-medium text-white/50 uppercase tracking-widest">Malaysia</p>
            </div>
          </div>

          <p className="max-w-[230px] text-sm leading-relaxed text-white/55">
            Uniting Palestinians and supporters across Malaysia through community, advocacy, and humanitarian action.
          </p>

          {/* Contact */}
          <ul className="flex flex-col gap-3 text-sm text-white/55">
            <li className="flex items-start gap-2.5">
              <MdLocationOn className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
              Kuala Lumpur, Malaysia
            </li>
            <li className="flex items-center gap-2.5">
              <MdEmail className="h-4 w-4 shrink-0 text-white/40" />
              info@pfmalaysia.org
            </li>
            <li className="flex items-center gap-2.5">
              <MdPhone className="h-4 w-4 shrink-0 text-white/40" />
              +60 12-345 6789
            </li>
          </ul>

          {/* Social icons */}
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
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-white/35">
          © {new Date().getFullYear()} Palestinian Forum Malaysia. All Rights Reserved.
        </p>
        <p className="text-xs font-semibold text-white/60">
          Standing with Palestine 🇵🇸
        </p>
      </div>
    </div>

  </footer>
);

export default Footer;
