import React from "react";
import { MdFavorite } from "react-icons/md";

const PRESET_AMOUNTS = [50, 100, 200, 500];

const QuickDonate = ({ campaigns, beneficiaries }) => {
  const [campaign, setCampaign] = React.useState("");
  const [beneficiary, setBeneficiary] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);

  const isReady = confirmed && (campaign || beneficiary) && amount > 0;

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-navy-800 p-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pfmRed-500/20">
          <MdFavorite className="h-4 w-4 text-pfmRed-400" />
        </div>
        <h3 className="font-bold text-white">Quick Donate</h3>
      </div>

      {/* Campaign select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Select Campaign
        </label>
        <select
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-green/75 focus:bg-white/15"
        >
          <option value="" className="text-navy-700">
            Select from favorites...
          </option>
          {campaigns.map((c) => (
            <option key={c} value={c} className="text-navy-700">
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-gray-500">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Beneficiary select */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">
          Select Beneficiary
        </label>
        <select
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-green/75 focus:bg-white/15"
        >
          <option value="" className="text-navy-700">
            Select beneficiary...
          </option>
          {beneficiaries.map((b) => (
            <option key={b} value={b} className="text-navy-700">
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* Preset amounts */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400">Amount (RM)</label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((p) => (
            <button
              key={p}
              onClick={() => setAmount(String(p))}
              className={`rounded-xl py-2 text-xs font-bold transition ${
                amount === String(p)
                  ? "bg-green text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          type="number"
          placeholder="Or enter amount..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-green/75 focus:bg-white/15"
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10" />

      {/* Confirmation */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 accent-green"
        />
        <span className="text-xs leading-relaxed text-gray-400">
          I confirm that this donation is for charitable purposes only. I will
          not benefit directly or indirectly from this donation.
        </span>
      </label>

      {/* Donate button */}
      <button
        disabled={!isReady}
        className={`w-full rounded-xl py-3.5 text-sm font-black tracking-wider transition ${
          isReady
            ? "bg-green text-white hover:bg-[#006833] active:bg-[#005629]"
            : "cursor-not-allowed bg-white/10 text-gray-500"
        }`}
      >
        DONATE NOW
      </button>
    </div>
  );
};

export default QuickDonate;
