import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPeople, MdCheckCircle, MdSchedule, MdBlock, MdCancel,
  MdMale, MdFemale, MdPerson, MdLocationOn, MdArrowForward,
} from "react-icons/md";
import { useGetBeneficiaryStats } from "components/features/beneficiaries/hooks";

const STATUS = [
  { key: "active",    label: "Active",    icon: MdCheckCircle, bg: "bg-green/10",    text: "text-green"       },
  { key: "pending",   label: "Pending",   icon: MdSchedule,    bg: "bg-amber-50",    text: "text-amber-500"   },
  { key: "suspended", label: "Suspended", icon: MdBlock,       bg: "bg-orange-50",   text: "text-orange-500"  },
  { key: "rejected",  label: "Rejected",  icon: MdCancel,      bg: "bg-red-50",      text: "text-red-500"     },
];

const GENDER = [
  { key: "male",        label: "Male",        icon: MdMale,   color: "bg-blue-400"  },
  { key: "female",      label: "Female",      icon: MdFemale, color: "bg-pink-400"  },
  { key: "unspecified", label: "Unspecified", icon: MdPerson, color: "bg-slate-300" },
];

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

export default function BeneficiaryStatsWidget() {
  const { stats, loading, error } = useGetBeneficiaryStats();
  const navigate = useNavigate();

  const total        = stats?.total        ?? 0;
  const byStatus     = stats?.by_status    ?? {};
  const byGender     = stats?.by_gender    ?? {};
  const byCity       = stats?.by_city      ?? [];
  const genderTotal  = Object.values(byGender).reduce((a, b) => a + b, 0) || 1;
  const topCities    = byCity.slice(0, 5);
  const maxCity      = topCities[0]?.count || 1;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdPeople className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">Beneficiaries</p>
            {loading
              ? <Skeleton className="mt-1 h-3 w-16" />
              : <p className="text-xs text-slate-400">{total} total registered</p>
            }
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/beneficiaries")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-green transition-colors hover:text-[#005a2c]"
        >
          View all <MdArrowForward className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STATUS.map(({ key, label, icon: Icon, bg, text }) => (
          <div key={key} className={`flex items-center gap-2.5 rounded-xl p-3 ${bg}`}>
            <Icon className={`h-4 w-4 shrink-0 ${text}`} />
            <div className="min-w-0">
              {loading
                ? <Skeleton className="h-4 w-8 mb-1" />
                : <p className={`text-base font-bold leading-none ${text}`}>{byStatus[key] ?? 0}</p>
              }
              <p className="mt-0.5 text-[10px] font-medium text-slate-500 capitalize">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Gender + Cities */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        {/* Gender */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold text-slate-500">By Gender</p>
          <div className="flex flex-col gap-2.5">
            {GENDER.map(({ key, label, icon: Icon, color }) => {
              const count = byGender[key] ?? 0;
              const pct   = Math.round((count / genderTotal) * 100);
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                    {loading
                      ? <Skeleton className="h-3 w-8" />
                      : <span className="text-xs font-semibold text-slate-700">{count}</span>
                    }
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
                      style={{ width: loading ? "0%" : `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top cities */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold text-slate-500">Top Cities</p>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-6 w-full" />)}
            </div>
          ) : topCities.length === 0 ? (
            <p className="text-xs text-slate-400">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {topCities.map(({ city, count }) => (
                <div key={city}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                      <MdLocationOn className="h-3.5 w-3.5 shrink-0 text-green" />
                      <span className="truncate">{city}</span>
                    </div>
                    <span className="ml-2 shrink-0 text-xs font-semibold text-slate-700">{count}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-green transition-all duration-700 ease-out"
                      style={{ width: `${Math.round((count / maxCity) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
