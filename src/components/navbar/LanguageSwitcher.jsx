import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdExpandMore } from "react-icons/md";

const LANGUAGES = [
  { code: "en", label: "English language" },
  { code: "ar", label: "اللغة العربية" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  const switchTo = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.dir  = code === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = code;
    setOpen(false);
  };

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
      >
        <span className="text-xs font-semibold uppercase tracking-wide">{current.code}</span>
        <MdExpandMore className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <div className={`absolute end-0 top-full z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 transition-all duration-200 ${
        open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
      }`}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchTo(lang.code)}
            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150 ${
              lang.code === current.code
                ? "bg-green/5 font-semibold text-green"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span className="truncate">{lang.label}</span>
            {lang.code === current.code && (
              <span className="ms-auto h-1.5 w-1.5 rounded-full bg-green" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
