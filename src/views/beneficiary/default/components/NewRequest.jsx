import React, { useState } from "react";
import { MdAssignment } from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";

const AID_TYPES = ["Medical Aid", "Food Assistance", "Financial Support", "Education", "Emergency Relief"];

const NewRequest = () => {
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
        <h3 className="font-bold text-white">New Aid Request</h3>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/20">
            <MdAssignment className="h-6 w-6 text-green" />
          </div>
          <p className="font-bold text-white">Request Submitted!</p>
          <p className="text-xs text-gray-400">Our team will review your request within 48 hours.</p>
          <button
            onClick={() => { setSubmitted(false); setType(""); setDesc(""); setUrgent(false); }}
            className="mt-1 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            New Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Aid type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Aid Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-green/75 focus:bg-white/15"
            >
              <option value="" className="text-navy-700">Select aid type...</option>
              {AID_TYPES.map((t) => (
                <option key={t} value={t} className="text-navy-700">{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400">Brief Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Describe your need..."
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
              Mark as urgent — I confirm this request requires immediate attention.
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
            SUBMIT REQUEST
          </button>
        </form>
      )}
    </div>
  );
};

export default NewRequest;
