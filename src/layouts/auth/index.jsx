import { Routes, Route, Navigate } from "react-router-dom";
import logo from "assets/brand/LOGO-wbg.png";
import routes from "routes.js";

export default function Auth() {
  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/auth" ? (
        <Route path={`/${route.path}`} element={route.component} key={key} />
      ) : null
    );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── Left — Brand panel ── */}
      <div className="relative hidden flex-col items-center justify-between bg-green px-10 py-14 lg:flex lg:w-[42%] rounded-br-[100px]">

        {/* Decorative layer — clipped separately so the panel curve isn't cut */}
        <div className="absolute inset-0 overflow-hidden rounded-br-[100px]">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow blobs */}
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-white/10 blur-[80px]" />
          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[#005629]/40 blur-[80px]" />
        </div>

        {/* Top — flag labels */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-widest text-white/70 uppercase">
            🇲🇾 Malaysia · Palestine 🇵🇸
          </span>
        </div>

        {/* Center — logo + identity */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-7 flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-4 shadow-2xl">
            <img src={logo} alt="PFM" className="h-full w-full object-contain" />
          </div>

          <p className="text-xl font-bold leading-snug text-white" dir="rtl">
            المنتدى الفلسطيني ماليزيا
          </p>
          <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
            Palestinian Forum Malaysia
          </p>

          <div className="my-6 h-px w-10 bg-white/30" />

          <p className="max-w-[260px] text-sm leading-relaxed text-white/80">
            Standing in solidarity with Palestine — for justice, dignity, and freedom.
          </p>
        </div>

        {/* Bottom — version badge */}
        <div className="relative z-10">
          <span className="text-xs text-white/40">PFM Portal v1.0</span>
        </div>
      </div>

      {/* ── Right — Form panel ── */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[58%]">

        {/* Mobile logo */}
        <div className="mb-8 flex flex-col items-center lg:hidden">
          <img src={logo} alt="PFM" className="h-20 w-20 object-contain" />
          <p className="mt-2 text-sm font-semibold text-navy-700">Palestinian Forum Malaysia</p>
        </div>

        <div className="w-full max-w-[420px]">
          <Routes>
            {getRoutes()}
            <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
          </Routes>
        </div>

      </div>

    </div>
  );
}
