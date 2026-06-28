import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn, MdEmail, MdPhone, MdArrowForward } from "react-icons/md";
import {
  FaFacebook, FaInstagram, FaYoutube, FaWhatsapp, FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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
  { icon: <FaFacebook size={16} />,  label: "Facebook",    href: "https://facebook.com/pfmalaysia" },
  { icon: <FaXTwitter size={15} />,  label: "X / Twitter", href: "https://x.com/pfmalaysia" },
  { icon: <FaInstagram size={16} />, label: "Instagram",   href: "https://instagram.com/pfmalaysia" },
  { icon: <FaYoutube size={16} />,   label: "YouTube",     href: "https://youtube.com/@pfmalaysia" },
  { icon: <FaTelegram size={16} />,  label: "Telegram",    href: "https://t.me/pfmalaysia" },
  { icon: <FaWhatsapp size={16} />,  label: "WhatsApp",    href: "https://wa.me/60123456789" },
];

const Footer = () => (
  <footer className="border-t border-slate-100 bg-white">

    {/* ── Main grid ── */}
    <div className="mx-auto max-w-7xl px-6 pt-14 pb-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_repeat(4,1fr)]">

        {/* Brand column */}
        <div className="flex flex-col gap-5">
          {/* Logo + name */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green text-xs font-black text-white"
            >
              PFM
            </div>
            <span className="text-sm font-extrabold leading-tight text-slate-900">
              Palestinian Forum<br />Malaysia
            </span>
          </div>

          <p className="text-sm leading-relaxed text-slate-400 max-w-[240px]">
            Uniting Palestinians and supporters across Malaysia through community, advocacy, and humanitarian action.
          </p>

          {/* Contact */}
          <ul className="flex flex-col gap-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <MdLocationOn className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />
              Kuala Lumpur, Malaysia
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="h-3.5 w-3.5 shrink-0 text-green" />
              info@pfmalaysia.org
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="h-3.5 w-3.5 shrink-0 text-green" />
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-all duration-150 ease-in-out hover:border-green/30 hover:bg-green/5 hover:text-green hover:-translate-y-px"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Nav columns */}
        {NAV_COLS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              {col.heading}
            </p>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-150 hover:text-green"
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
    <div className="border-t border-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-1.5 px-6 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Palestinian Forum Malaysia. All Rights Reserved.
        </p>
        <p className="text-xs font-semibold text-green">
          Standing with Palestine 🇵🇸
        </p>
      </div>
    </div>

  </footer>
);

export default Footer;
