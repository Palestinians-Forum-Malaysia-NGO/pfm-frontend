import React from "react";
import { useTranslation } from "react-i18next";
import AlertBanner from "components/ui/AlertBanner";
import DonateHero from "components/public/donate/DonateHero";
import QRCodeSection from "components/public/donate/QRCodeSection";
import BankDetailsSection from "components/public/donate/BankDetailsSection";
import FAQSection from "components/public/donate/FAQSection";

export default function Donate() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <DonateHero />
      <div className="mx-auto w-full max-w-3xl px-6 pt-10" style={{ animation: "fadeUp 0.7s 0.3s ease both" }}>
        <AlertBanner variant="warning" message={t("donate.placeholder_notice")} />
      </div>
      <QRCodeSection />
      <BankDetailsSection />
      <FAQSection />
    </div>
  );
}
