import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";
import qrCode from "assets/qrcode/pfm-qr-code.png";

const QRCodeSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div
          className="flex flex-col items-center gap-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-green">{t("donate.qr_label")}</span>
            <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("donate.qr_title")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-slate-500">{t("donate.qr_desc")}</p>
          </div>

          <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img src={qrCode} alt={t("donate.qr_title")} className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSection;
