import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";
import { MdPeople, MdArrowForward } from "react-icons/md";
import { useGetBeneficiaryStats } from "components/features/beneficiaries/hooks";
import { donutOpts, barOpts, GENDER_COLORS } from "components/charts/apexConfig";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

const STATUS_COLORS  = ["#007A3D", "#F59E0B", "#F97316", "#EF4444"];
const STATUS_KEYS    = ["active", "pending", "suspended", "rejected"];

const GENDER_KEYS    = ["male", "female",];

export default function BeneficiaryStatsWidget() {
  const { t } = useTranslation();
  const STATUS_LABELS = [
    t("beneficiaries.stat_active"), t("beneficiaries.stat_pending"),
    t("beneficiaries.stat_suspended"), t("beneficiaries.stat_rejected"),
  ];
  const GENDER_LABELS = [t("beneficiaries.gender_male"), t("beneficiaries.gender_female")];
  const { stats, loading } = useGetBeneficiaryStats();
  const navigate = useNavigate();

  const total     = stats?.total     ?? 0;
  const byStatus  = stats?.by_status ?? {};
  const byGender  = stats?.by_gender ?? {};
  const byCity    = (stats?.by_city  ?? []).slice(0, 5);

  const statusSeries = STATUS_KEYS.map((k) => byStatus[k] ?? 0);
  const genderSeries = GENDER_KEYS.map((k) => byGender[k] ?? 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green/10 text-green">
            <MdPeople className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{t("admin_dashboard.beneficiary_overview_title")}</p>
            {loading
              ? <Skeleton className="mt-1 h-3 w-20" />
              : <p className="text-xs text-slate-400">{t("admin_dashboard.total_registered", { count: total.toLocaleString() })}</p>
            }
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/beneficiaries")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-green transition-colors hover:text-[#005a2c]"
        >
          {t("home.view_all")} <MdArrowForward className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* ── Status donut ── */}
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 self-start text-xs font-semibold text-slate-500">{t("admin_dashboard.by_status_label")}</p>
          {loading ? (
            <Skeleton className="h-40 w-40 rounded-full" />
          ) : (
            <ReactApexChart
              type="donut"
              series={statusSeries}
              options={donutOpts(STATUS_LABELS, STATUS_COLORS)}
              height={160}
            />
          )}
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 self-start w-full">
            {STATUS_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[i] }} />
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className="ml-auto text-[11px] font-bold text-slate-700">{statusSeries[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Gender donut ── */}
        <div className="flex flex-col items-center rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 self-start text-xs font-semibold text-slate-500">{t("admin_dashboard.by_gender_label")}</p>
          {loading ? (
            <Skeleton className="h-40 w-40 rounded-full" />
          ) : (
            <ReactApexChart
              type="donut"
              series={genderSeries}
              options={donutOpts(GENDER_LABELS, GENDER_COLORS)}
              height={160}
            />
          )}
          <div className="mt-3 flex flex-col gap-1.5 self-start w-full">
            {GENDER_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: GENDER_COLORS[i] }} />
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className="ml-auto text-[11px] font-bold text-slate-700">{genderSeries[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top cities bar ── */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="mb-1 text-xs font-semibold text-slate-500">{t("admin_dashboard.top_cities_label")}</p>
          {loading ? (
            <div className="flex flex-col gap-3 pt-2">
              {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
            </div>
          ) : byCity.length === 0 ? (
            <p className="pt-4 text-xs text-slate-400">{t("admin_dashboard.no_data_yet")}</p>
          ) : (
            <ReactApexChart
              type="bar"
              series={[{ name: t("beneficiaries.title"), data: byCity.map((c) => c.count) }]}
              options={barOpts(byCity.map((c) => c.city))}
              height={byCity.length * 44 + 20}
            />
          )}
        </div>

      </div>
    </div>
  );
}
