import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const WhatsAppFloatButton = ({ phone = "601156563044", message = "Hi PFM, I'd like to know more about your work!" }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      style={{ animation: "fadeUp 0.5s 1s ease both" }}
    >

      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="flex items-start gap-2 rounded-2xl bg-white p-3.5 pr-4 shadow-xl ring-1 ring-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green text-white">
            <FaWhatsapp size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900">{t("home.chat_with_pfm")}</p>
            <p className="text-[11px] text-slate-400">{t("home.whatsapp_reply")}</p>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="ml-1 shrink-0 text-slate-300 transition-colors hover:text-slate-500"
          >
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Float button */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg shadow-green/40 transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-green/50 active:scale-[0.95]"
      >
        <FaWhatsapp size={26} />
        {/* Pulse ring */}
        <span className="absolute h-14 w-14 animate-ping rounded-full bg-green opacity-20" />
      </a>
    </div>
  );
};

export default WhatsAppFloatButton;
