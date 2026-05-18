import { MdArrowForward } from "react-icons/md";

const BalanceCard = ({ total, available, asOf }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6">
      {/* decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/[0.03]" />
      <div className="pointer-events-none absolute -bottom-12 -right-4 h-56 w-56 rounded-full bg-white/[0.03]" />

      <p className="text-sm font-semibold text-gray-400">Total Balance</p>
      <p className="mt-0.5 text-xs text-gray-500">{asOf}</p>

      <p className="mt-4 text-5xl font-extrabold tracking-tight text-brand-400">
        {total}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-sm text-gray-400">
          Available:{" "}
          <span className="font-bold text-white">{available}</span>
        </p>
        <button className="flex items-center gap-1 text-sm font-semibold text-pfmRed-400 transition hover:text-pfmRed-300">
          More <MdArrowForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
