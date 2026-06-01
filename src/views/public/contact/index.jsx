import React, { useState } from "react";
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdCheckCircle } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";

import heroBg from "assets/img/layout/ngo-bg-2.jpg";

const CONTACT_INFO = [
  {
    icon: <MdLocationOn className="h-5 w-5" />,
    label: "Address",
    value: "Kuala Lumpur, Malaysia",
    sub: "Wilayah Persekutuan",
  },
  {
    icon: <MdEmail className="h-5 w-5" />,
    label: "Email",
    value: "info@pfm.org.my",
    href: "mailto:info@pfm.org.my",
  },
  {
    icon: <MdPhone className="h-5 w-5" />,
    label: "Phone",
    value: "+60 12-345 6789",
    href: "tel:+60123456789",
  },
  {
    icon: <FaWhatsapp className="h-5 w-5" />,
    label: "WhatsApp",
    value: "+60 12-345 6789",
    href: "https://wa.me/60123456789",
  },
];

const SOCIALS = [
  { icon: <FaFacebook size={18} />,  href: "https://facebook.com/pfm",   label: "Facebook" },
  { icon: <FaInstagram size={18} />, href: "https://instagram.com/pfm",  label: "Instagram" },
  { icon: <FaWhatsapp size={18} />,  href: "https://wa.me/60123456789",  label: "WhatsApp" },
  { icon: <MdEmail size={18} />,     href: "mailto:info@pfm.org.my",     label: "Email" },
];

export default function Contact() {
  const [form, setForm]         = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]   = useState(false);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setSending(false);
  };

  const inputCls = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 ease-in-out focus:border-green focus:bg-white placeholder:text-slate-400";

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Contact PFM" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

        {/* Flag strip */}
        <div className="absolute left-0 top-0 flex h-1 w-full">
          <div className="flex-1 bg-black" />
          <div className="flex-1 bg-white/80" />
          <div className="flex-1 bg-white/20" />
          <div className="flex-1" style={{ background: "#CE1126" }} />
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">Get In Touch</span>
          <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Contact Us</h1>
          <p className="mt-4 text-white/60 text-base">We'd love to hear from you — reach out anytime.</p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* ── Left: Contact info ── */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-green">Contact Information</span>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-900">How to Reach Us</h2>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Have a question, want to volunteer, or need help with a donation? Our team is here for you. Reach out through any of the channels below.
              </p>

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
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Follow Us</p>
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
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
                    <MdCheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Message Sent!</h3>
                  <p className="max-w-xs text-sm text-slate-400">
                    Thank you for reaching out. Our team will get back to you within 24–48 hours.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-slate-900">Send a Message</h3>
                  <p className="mt-1 text-sm text-slate-400">We'll respond within 24–48 hours.</p>

                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name</label>
                        <input value={form.name} onChange={set("name")} required placeholder="Ahmad Faris" className={inputCls} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email Address</label>
                        <input value={form.email} onChange={set("email")} type="email" required placeholder="ahmad@email.com" className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">Subject</label>
                      <input value={form.subject} onChange={set("subject")} required placeholder="How can we help?" className={inputCls} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">Message</label>
                      <textarea value={form.message} onChange={set("message")} required rows={5} placeholder="Write your message here..." className={`${inputCls} resize-none`} />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-bold text-white transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ background: "#007A3D" }}
                    >
                      {sending ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <MdSend className="h-4 w-4" />
                      )}
                      {sending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
