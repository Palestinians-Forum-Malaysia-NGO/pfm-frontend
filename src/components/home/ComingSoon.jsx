import { useState } from "react";
import { MdEmail, MdPeople, MdVolunteerActivism, MdCampaign } from "react-icons/md";
import { FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import logo from "assets/brand/LOGO-wbg.png";

const PILLARS = [
  {
    icon: <MdPeople className="h-5 w-5" />,
    title: "Community",
    desc:  "Connecting Palestinians and supporters across Malaysia",
  },
  {
    icon: <MdCampaign className="h-5 w-5" />,
    title: "Advocacy",
    desc:  "Raising awareness and championing justice for Palestine",
  },
  {
    icon: <MdVolunteerActivism className="h-5 w-5" />,
    title: "Humanitarian Aid",
    desc:  "Coordinating donations, relief, and on-ground support",
  },
];

const ComingSoon = () => {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.8s cubic-bezier(.22,.68,0,1.1) forwards;
        }
        .pulse-dot { animation: subtlePulse 2s ease-in-out infinite; }
      `}</style>

      <section className="min-h-screen bg-white p-3 sm:p-5">
        <div
          className="relative flex min-h-[calc(100vh-40px)] flex-col overflow-hidden rounded-3xl bg-white"
          style={{ border: "1px solid #007A3D1A", boxShadow: "0 4px 40px #007A3D08" }}
        >

          {/* ── Background elements ── */}
          {/* Top glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2"
            style={{ background: "radial-gradient(ellipse at top, #007A3D0E 0%, transparent 70%)" }} />
          {/* Bottom-left glow */}
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full"
            style={{ background: "radial-gradient(circle, #007A3D08 0%, transparent 70%)" }} />
          {/* Dot grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "radial-gradient(circle, #007A3D 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />
          {/* Watermark */}
          <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none overflow-hidden"
            style={{ opacity: 0.03 }}>
            <span className="text-[220px] font-black text-green-700 leading-none">PFM</span>
          </div>

          {/* ── Header ── */}
          <header className="relative z-10 fade-up flex items-center justify-between px-6 py-5 sm:px-10"
            style={{ animationDelay: "0.05s" }}>
            <div className="flex items-center gap-3">
              <img src={logo} alt="PFM" className="h-11 w-auto" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-tight">Palestinian Forum Malaysia</p>
                <p className="text-[10px] font-medium tracking-wide" style={{ color: "#007A3D" }}>
                  منتدى فلسطين ماليزيا
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border px-3.5 py-1.5"
              style={{ borderColor: "#007A3D30", background: "#007A3D08" }}>
              <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: "#007A3D" }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: "#007A3D" }}>
                Coming Soon
              </span>
            </div>
          </header>

          {/* ── Main ── */}
          <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">

            {/* Org label */}
            <div className="fade-up mb-6 flex items-center gap-3" style={{ animationDelay: "0.1s" }}>
              <span className="h-px w-8 rounded" style={{ background: "#007A3D40" }} />
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Official Member Portal
              </p>
              <span className="h-px w-8 rounded" style={{ background: "#007A3D40" }} />
            </div>

            {/* Heading */}
            <h1 className="fade-up mb-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl"
              style={{ animationDelay: "0.2s" }}>
              Serving Our Community,
              <br />
              <span style={{ color: "#007A3D" }}>Together.</span>
            </h1>

            {/* Mission */}
            <p className="fade-up mb-2 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg"
              style={{ animationDelay: "0.3s" }}>
              A unified platform for the Palestinian community in Malaysia — bringing members, events, advocacy, and humanitarian aid under one roof.
            </p>

            {/* Quote */}
            <p className="fade-up mb-10 max-w-sm text-sm italic text-slate-400"
              style={{ animationDelay: "0.38s" }}>
              "Stand for justice. Build community. Serve with purpose."
            </p>

            {/* Pillars */}
            <div className="fade-up mb-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
              style={{ animationDelay: "0.46s" }}>
              {PILLARS.map((p) => (
                <div key={p.title}
                  className="flex flex-col items-center gap-2 rounded-2xl border px-5 py-4 text-center"
                  style={{ borderColor: "#007A3D18", background: "#007A3D05" }}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ background: "#007A3D12", color: "#007A3D" }}>
                    {p.icon}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{p.title}</p>
                  <p className="text-xs leading-relaxed text-slate-400">{p.desc}</p>
                </div>
              ))}
            </div>

           
          </main>

          {/* ── Footer ── */}
          <footer className="relative z-10 fade-up flex flex-col items-center gap-3 px-6 py-5 sm:flex-row sm:justify-between sm:px-10"
            style={{ animationDelay: "0.7s", borderTop: "1px solid #007A3D10" }}>

            <p className="text-xs text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} Palestinian Forum Malaysia (PFM). All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              {[
                { href: "",   icon: <FaWhatsapp size={14} />,   label: "WhatsApp" },
                { href: "",   icon: <FaInstagram size={14} />,  label: "Instagram" },
                { href: "",   icon: <FaFacebook size={14} />,   label: "Facebook" },
                { href: "",   icon: <MdEmail size={15} />,      label: "Email" },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer" title={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ borderColor: "#007A3D25", background: "#007A3D08", color: "#007A3D" }}>
                  {icon}
                </a>
              ))}
            </div>

          </footer>

        </div>
      </section>
    </>
  );
};

export default ComingSoon;
