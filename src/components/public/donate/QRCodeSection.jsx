import React from "react";
import { useTranslation } from "react-i18next";
import { MdQrCode2 } from "react-icons/md";
import useInView from "hooks/useInView";

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

          <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
            <MdQrCode2 className="h-16 w-16 text-slate-300" />
            <p className="text-xs font-medium text-slate-400">{t("donate.qr_placeholder")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QRCodeSection;
