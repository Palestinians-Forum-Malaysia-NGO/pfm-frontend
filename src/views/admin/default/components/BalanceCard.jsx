import { useNavigate } from "react-router-dom";
import {
  MdPeople, MdCheckCircle, MdHourglassTop,
  MdMale, MdFemale, MdArrowForward,
} from "react-icons/md";
import { useGetBeneficiaryStats } from "components/features/beneficiaries/hooks";

const Skel = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
);

const StatCard = ({ icon: Icon, label, value, pct, iconBg, iconColor, badgeColor, loading }) => (
  <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center justify-between">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      {pct !== null && (
        loading
          ? <Skel className="h-5 w-10 rounded-full" />
          : <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeColor}`}>
              {pct}%
            </span>
      )}
    </div>
    {loading
      ? <>
          <Skel className="h-7 w-16" />
          <Skel className="h-3 w-20" />
        </>
      : <>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold leading-none tracking-tight text-navy-700">
          {value.toLocaleString()}
          </span>
          <span className="pb-1 text-sm font-medium text-slate-500">
            {label}
            </span>
            </div>
            </>          
    }
  </div>
);

const BalanceCard = () => {
  const { stats, loading } = useGetBeneficiaryStats();
  const navigate = useNavigate();

  const total   = stats?.total              ?? 0;
  const active  = stats?.by_status?.active  ?? 0;
  const pending = stats?.by_status?.pending ?? 0;
  const male    = stats?.by_gender?.male    ?? 0;
  const female  = stats?.by_gender?.female  ?? 0;

  const pct = (n) => total > 0 ? Math.round((n / total) * 100) : 0;

  const CARDS = [
    {
      icon: MdPeople,      label: "Total Beneficiaries", value: total,
      pct: null,           iconBg: "bg-green/10",         iconColor: "text-green",
      badgeColor: "",
    },
    {
      icon: MdCheckCircle, label: "Active",               value: active,
      pct: pct(active),    iconBg: "bg-green/10",         iconColor: "text-green",
      badgeColor: "bg-green/10 text-green",
    },
    {
      icon: MdHourglassTop,label: "Pending",              value: pending,
      pct: pct(pending),   iconBg: "bg-amber-50",         iconColor: "text-amber-500",
      badgeColor: "bg-amber-50 text-amber-500",
    },
    {
      icon: MdMale,        label: "Male",                 value: male,
      pct: pct(male),      iconBg: "bg-blue-50",          iconColor: "text-blue-500",
      badgeColor: "bg-blue-50 text-blue-500",
    },
    {
      icon: MdFemale,      label: "Female",               value: female,
      pct: pct(female),    iconBg: "bg-pink-50",          iconColor: "text-pink-500",
      badgeColor: "bg-pink-50 text-pink-500",
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-bold text-navy-700">Beneficiary Summary</p>
        <button
          onClick={() => navigate("/admin/beneficiaries")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-green transition-colors duration-150 hover:text-green-600"
        >
          View all <MdArrowForward className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {CARDS.map((c) => (
          <StatCard key={c.label} {...c} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default BalanceCard;
