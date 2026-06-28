import { useNavigate } from "react-router-dom";
import { MdArrowForward, MdPeople, MdHourglassTop } from "react-icons/md";
import { useGetBeneficiaryStats } from "components/features/beneficiaries/hooks";

const Skel = ({ className }) => (
  <div className={`animate-pulse rounded-md bg-white/5 ${className}`} />
);

const today = new Date().toLocaleDateString("en-MY", {
  day: "numeric", month: "long", year: "numeric",
});

const BalanceCard = () => {
  const { stats, loading } = useGetBeneficiaryStats();
  const navigate = useNavigate();

  const total     = stats?.total              ?? 0;
  const active    = stats?.by_status?.active  ?? 0;
  const pending   = stats?.by_status?.pending ?? 0;
  const male      = stats?.by_gender?.male    ?? 0;
  const female    = stats?.by_gender?.female  ?? 0;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/[0.03]" />
      <div className="pointer-events-none absolute -bottom-12 -right-4 h-56 w-56 rounded-full bg-white/[0.03]" />

      {/* Label */}
      <p className="text-sm font-semibold text-gray-400">Total Beneficiaries</p>
      <p className="mt-0.5 text-xs text-gray-500">As of {today}</p>

      {/* Big number */}
      {loading
        ? <Skel className="mt-4 h-12 w-28" />
        : <p className="mt-4 text-5xl font-extrabold tracking-tight text-green/75">
            {total.toLocaleString()}
          </p>
      }

      {/* Gender split */}
      {loading ? (
        <Skel className="mt-3 h-3 w-36" />
      ) : (
        <p className="mt-2 text-xs text-gray-500">
          <span className="text-blue-400">{male.toLocaleString()} male</span>
          <span className="mx-1.5 text-gray-600">·</span>
          <span className="text-pink-400">{female.toLocaleString()} female</span>
        </p>
      )}

      {/* Divider row */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex items-center gap-4">

          {/* Active */}
          <div className="flex items-center gap-1.5">
            <MdPeople className="h-3.5 w-3.5 text-green/70" />
            {loading
              ? <Skel className="h-3 w-10" />
              : <span className="text-xs text-gray-400">
                  Active <span className="font-bold text-white">{active.toLocaleString()}</span>
                </span>
            }
          </div>

          {/* Pending */}
          <div className="flex items-center gap-1.5">
            <MdHourglassTop className="h-3.5 w-3.5 text-amber-400/70" />
            {loading
              ? <Skel className="h-3 w-10" />
              : <span className="text-xs text-gray-400">
                  Pending{" "}
                  <span className={`font-bold ${pending > 0 ? "text-amber-400" : "text-white"}`}>
                    {pending.toLocaleString()}
                  </span>
                </span>
            }
          </div>

        </div>

        <button
          onClick={() => navigate("/admin/beneficiaries")}
          className="flex items-center gap-1 text-xs font-semibold text-green transition-colors duration-150 hover:text-green-400"
        >
          View all <MdArrowForward className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
