import React from "react";
import DonateHero from "components/public/donate/DonateHero";
import QRCodeSection from "components/public/donate/QRCodeSection";
import BankDetailsSection from "components/public/donate/BankDetailsSection";
import FAQSection from "components/public/donate/FAQSection";

export default function Donate() {
  return (
    <div className="flex flex-col">
      <DonateHero />
      <QRCodeSection />
      <BankDetailsSection />
      <FAQSection />
    </div>
  );
}
