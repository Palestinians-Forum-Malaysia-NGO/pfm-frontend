import React from "react";
import { useTranslation } from "react-i18next";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import ContactForm from "components/public/contact/ContactForm";

import heroBg from "assets/img/gallery/gallery-2.jpg";

const SOCIALS = [
  { icon: <FaFacebook size={18} />,  href: "https://facebook.com/pfm",   label: "Facebook" },
  { icon: <FaInstagram size={18} />, href: "https://instagram.com/pfm",  label: "Instagram" },
  { icon: <FaWhatsapp size={18} />,  href: "https://wa.me/60123456789",  label: "WhatsApp" },
  { icon: <MdEmail size={18} />,     href: "mailto:info@pfm.org.my",     label: "Email" },
];

export default function Contact() {
  const { t } = useTranslation();

  const CONTACT_INFO = [
    { icon: <MdLocationOn className="h-5 w-5" />, label: t("contact.address"), value: "Kuala Lumpur, Malaysia", sub: "Wilayah Persekutuan" },
    { icon: <MdEmail className="h-5 w-5" />,      label: t("contact.email"),   value: "info@pfm.org.my",        href: "mailto:info@pfm.org.my" },
    { icon: <MdPhone className="h-5 w-5" />,      label: t("contact.phone"),   value: "+60 12-345 6789",        href: "tel:+60123456789" },
    { icon: <FaWhatsapp className="h-5 w-5" />,   label: t("contact.whatsapp"),value: "+60 12-345 6789",        href: "https://wa.me/60123456789" },
  ];

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
        <img src={heroBg} alt={t("contact.hero_alt")} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

        <div className="relative z-10 text-center text-white px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">{t("contact.how_to_reach")}</span>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">{t("contact.title")}</h1>
          <p className="mt-4 text-white/60 text-base">{t("contact.subtitle")}</p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* ── Left: Contact info ── */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-green">{t("contact.how_to_reach")}</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">{t("contact.how_to_reach")}</h2>
              <p className="mt-4 text-slate-500 leading-relaxed">{t("contact.description")}</p>

              <div className="mt-8 flex flex-col gap-4">
                {CONTACT_INFO.map((c) => (
                  <div key={c.label} className="flex items-start gap-4 rounded-2xl bg-slate-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                          className="text-sm font-semibold text-slate-800 transition-colors hover:text-green">
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold text-slate-800">{c.value}</p>
                      )}
                      {c.sub && <p className="text-xs text-slate-400">{c.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{t("contact.follow_us")}</p>
                <div className="flex items-center gap-2">
                  {SOCIALS.map(({ icon, href, label }) => (
                    <a key={label} href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer" title={label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-green/30 hover:bg-green/5 hover:text-green">
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Form ── */}
            <ContactForm />

          </div>
        </div>
      </section>

    </div>
  );
}
