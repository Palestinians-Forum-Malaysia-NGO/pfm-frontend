import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAccountBalance, MdContentCopy, MdCheck } from "react-icons/md";
import useInView from "hooks/useInView";

const BankDetailsSection = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const [copied, setCopied] = useState(false);

  const accountNumber = t("donate.account_number_value");

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s/g, "")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const ROWS = [
    { label: t("donate.bank_name_label"),    value: t("donate.bank_name_value") },
    { label: t("donate.account_name_label"), value: t("donate.account_name_value") },
    { label: t("donate.account_number_label"), value: accountNumber, copyable: true },
    { label: t("donate.swift_label"),        value: t("donate.swift_value") },
  ];

  return (
    <section ref={ref} className="bg-slate-50 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div
          className="mb-10 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: "all 0.7s ease-in-out" }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-green">{t("donate.bank_label")}</span>
          <h2 className="mt-3 text-4xl font-extrabold text-slate-900">{t("donate.bank_title")}</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-500">{t("donate.bank_desc")}</p>
        </div>

        <div
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out", transitionDelay: "120ms" }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
              <MdAccountBalance className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t("donate.bank_title")}</h3>
          </div>

          <div className="flex flex-col divide-y divide-slate-100">
            {ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{row.label}</p>
                  <p className="truncate text-sm font-semibold text-slate-800">{row.value}</p>
                </div>
                {row.copyable && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                      copied
                        ? "border-green/30 bg-green/10 text-green"
                        : "border-slate-200 bg-white text-slate-600 hover:border-green/75 hover:text-green"
                    }`}
                  >
                    {copied ? <MdCheck className="h-3.5 w-3.5" /> : <MdContentCopy className="h-3.5 w-3.5" />}
                    {copied ? t("donate.copied") : t("donate.copy")}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankDetailsSection;
