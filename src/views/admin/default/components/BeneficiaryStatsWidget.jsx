import React from "react";
import { useNavigate } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { MdPeople, MdArrowForward } from "react-icons/md";
import { useGetBeneficiaryStats } from "components/features/beneficiaries/hooks";

/* ── Tailwind palette values (used only in ApexCharts configs) ── */
const TW_GREEN      = "#007A3D"; // green DEFAULT
const TW_GREEN_400  = "#33BB7C"; // green-400
const TW_GREEN_300  = "#66CC9E"; // green-300
const TW_GREEN_200  = "#99DCBC"; // green-200
const TW_GREEN_100  = "#C2EAD7"; // green-100
const TW_BLUE_500   = "#3b82f6"; // blue-500  (male)
const TW_PINK_400   = "#f472b6"; // pink-400  (female)
const TW_SLATE_400  = "#94a3b8"; // slate-400

/* ── Data config ── */
const STATUS = [
  { key: "active",    label: "Active",    bar: "bg-green" },
  { key: "pending",   label: "Pending",   bar: "bg-amber-400" },
  { key: "suspended", label: "Suspended", bar: "bg-orange-500" },
  { key: "rejected",  label: "Rejected",  bar: "bg-red-500" },
];

const GENDER = [
  { key: "male",   label: "Male",   dot: "bg-blue-500",  hex: TW_BLUE_500 },
  { key: "female", label: "Female", dot: "bg-pink-400",  hex: TW_PINK_400 },
];

/* ── ApexCharts options ── */
const genderDonutOpts = {
  chart:       { type: "donut", toolbar: { show: false } },
  labels:      GENDER.map((g) => g.label),
  colors:      GENDER.map((g) => g.hex),
  legend:      { show: false },
  dataLabels:  { enabled: false },
  stroke:      { width: 0 },
  plotOptions: { pie: { donut: { size: "70%", labels: { show: false } }, expandOnClick: false } },
  tooltip:     { theme: "dark" },
};

const cityBarOpts = (categories) => ({
  chart:       { type: "bar", toolbar: { show: false }, background: "transparent" },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: "52%", distributed: true } },
  colors:      [TW_GREEN, TW_GREEN_400, TW_GREEN_300, TW_GREEN_200, TW_GREEN_100],
  dataLabels:  { enabled: false },
  legend:      { show: false },
  grid:        { show: false },
  xaxis: {
    categories,
    labels:     { style: { colors: TW_SLATE_400, fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks:  { show: false },
  },
  yaxis: { labels: { style: { colors: TW_SLATE_400, fontSize: "11px", fontWeight: 500 } } },
  tooltip: { theme: "dark" },
});

/* ── Sub-components ── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
);

export default function BeneficiaryStatsWidget() {
  const { stats, loading } = useGetBeneficiaryStats();
  const navigate = useNavigate();

  const total      = stats?.total     ?? 0;
  const byStatus   = stats?.by_status ?? {};
  const byGender   = stats?.by_gender ?? {};
  const byCity     = (stats?.by_city  ?? []).slice(0, 5);

  const genderSeries = GENDER.map((g) => byGender[g.key] ?? 0);
  const genderTotal  = genderSeries.reduce((a, b) => a + b, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6">

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/[0.025]" />
      <div className="pointer-events-none absolute -bottom-14 -right-6  h-64 w-64 rounded-full bg-white/[0.025]" />

      {/* ── Header ── */}
      <div className="relative mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/15 text-green">
            <MdPeople className="h-5 w-5" />
          </div>
          <p className="text-sm font-bold text-white">Beneficiary Overview</p>
        </div>
        <button
          onClick={() => navigate("/admin/beneficiaries")}
          className="flex items-center gap-1 text-xs font-semibold text-green transition-colors duration-150 hover:text-green-400"
        >
          View all <MdArrowForward className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Total ── */}
      <div className="relative mb-5">
        {loading
          ? <Skeleton className="mt-3 h-12 w-28" />
          : <p className="mt-3 text-5xl font-extrabold tracking-tight text-green/80">{total.toLocaleString()}</p>
        }
        <p className="mt-1 text-xs text-gray-500">Total beneficiaries registered</p>
      </div>

      <div className="relative border-t border-white/10 pt-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* ── Gender donut ── */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-semibold text-gray-400">By Gender</p>
            {loading ? (
              <Skeleton className="mx-auto h-[100px] w-[100px] rounded-full" />
            ) : (
              <div className="flex items-center gap-3">
                <ReactApexChart
                  type="donut"
                  series={genderSeries}
                  options={genderDonutOpts}
                  height={100}
                  width={100}
                />
                <div className="flex flex-col gap-2.5">
                  {GENDER.map((g, i) => {
                    const pct = genderTotal > 0
                      ? Math.round((genderSeries[i] / genderTotal) * 100)
                      : 0;
                    return (
                      <div key={g.key} className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${g.dot}`} />
                        <span className="text-[11px] text-gray-400">{g.label}</span>
                        <span className="ml-auto text-[11px] font-bold text-white">{genderSeries[i]}</span>
                        <span className="w-7 text-right text-[10px] text-gray-500">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Status bars ── */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="mb-3 text-xs font-semibold text-gray-400">By Status</p>
            {loading ? (
              <div className="flex flex-col gap-3">
                {STATUS.map((s) => <Skeleton key={s.key} className="h-5 w-full" />)}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {STATUS.map((s) => {
                  const count = byStatus[s.key] ?? 0;
                  const pct   = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={s.key}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">{s.label}</span>
                        <span className="text-[11px] font-bold text-white">{count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${s.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Top cities ── */}
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:col-span-2 lg:col-span-1">
            <p className="mb-2 text-xs font-semibold text-gray-400">Top Cities</p>
            {loading ? (
              <div className="flex flex-col gap-3 pt-1">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
            ) : byCity.length === 0 ? (
              <p className="pt-4 text-xs text-gray-500">No data yet.</p>
            ) : (
              <ReactApexChart
                type="bar"
                series={[{ name: "Beneficiaries", data: byCity.map((c) => c.count) }]}
                options={cityBarOpts(byCity.map((c) => c.city))}
                height={byCity.length * 40 + 20}
              />
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
