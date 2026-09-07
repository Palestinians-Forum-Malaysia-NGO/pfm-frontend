import React from "react";
import { useTranslation } from "react-i18next";
import useInView from "hooks/useInView";
import FAQAccordion from "components/ui/FAQAccordion";

const FAQSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();

  const FAQS = [
    { q: t("donate.faq_q1"), a: t("donate.faq_a1") },
    { q: t("donate.faq_q2"), a: t("donate.faq_a2") },
    { q: t("donate.faq_q3"), a: t("donate.faq_a3") },
    { q: t("donate.faq_q4"), a: t("donate.faq_a4") },
    { q: t("donate.faq_q5"), a: t("donate.faq_a5") },
  ];

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div
          className="mb-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("donate.faq_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("donate.faq_title")}</h2>
        </div>

        <div
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out", transitionDelay: "120ms" }}
        >
          <FAQAccordion items={FAQS} />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
