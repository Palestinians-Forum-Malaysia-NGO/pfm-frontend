import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAssignment } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";

const NewRequest = () => {
  const { t } = useTranslation();
  const AID_TYPES = [
    { value: "Medical Aid",       label: t("beneficiary_dashboard.aid_type_medical") },
    { value: "Food Assistance",   label: t("beneficiary_dashboard.aid_type_food") },
    { value: "Financial Support", label: t("beneficiary_dashboard.aid_type_financial") },
    { value: "Education",         label: t("beneficiary_dashboard.aid_type_education") },
    { value: "Emergency Relief",  label: t("beneficiary_dashboard.aid_type_emergency") },
  ];
  const [type, setType]         = useState("");
  const [desc, setDesc]         = useState("");
  const [urgent, setUrgent]     = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isReady = type && desc.trim().length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReady) setSubmitted(true);
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-navy-800 p-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green/20">
          <FaHandHoldingHeart className="h-4 w-4 text-green" />
        </div>
        <h3 className="font-bold text-white">{t("beneficiary_dashboard.new_request_title")}</h3>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/20">
            <MdAssignment className="h-6 w-6 text-green" />
          </div>
          <p className="font-bold text-white">{t("beneficiary_dashboard.request_submitted_title")}</p>
          <p className="text-xs text-gray-400">{t("beneficiary_dashboard.request_submitted_body")}</p>
          <button
            onClick={() => { setSubmitted(false); setType(""); setDesc(""); setUrgent(false); }}
            className="mt-1 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            {t("beneficiary_dashboard.new_request_btn")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Aid type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">{t("beneficiary_dashboard.aid_type_label")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-green/75 focus:bg-white/15"
            >
              <option value="" className="text-navy-700">{t("beneficiary_dashboard.select_aid_type_placeholder")}</option>
              {AID_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-navy-700">{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">{t("beneficiary_dashboard.description_label")}</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder={t("beneficiary_dashboard.description_placeholder")}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-green/75 focus:bg-white/15"
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* Urgent toggle */}
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-green"
            />
            <span className="text-xs leading-relaxed text-gray-400">
              {t("beneficiary_dashboard.urgent_label")}
            </span>
          </label>

          <button
            type="submit"
            disabled={!isReady}
            className={`w-full rounded-xl py-3.5 text-sm font-black tracking-wider transition ${
              isReady
                ? "bg-green text-white hover:bg-[#006833] active:bg-[#005629]"
                : "cursor-not-allowed bg-white/10 text-gray-500"
            }`}
          >
            {t("beneficiary_dashboard.submit_request_btn")}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewRequest;
