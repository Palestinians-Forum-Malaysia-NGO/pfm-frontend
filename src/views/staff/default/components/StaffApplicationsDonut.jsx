import React from "react";
import { useTranslation } from "react-i18next";
import ReactApexChart from "react-apexcharts";
import { MdFactCheck } from "react-icons/md";
import { donutOpts, APPLICATION_STATUS_COLORS } from "components/charts/apexConfig";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
);

const STATUS_KEYS = ["pending", "approved", "rejected"];

export default function StaffApplicationsDonut({ byStatus, loading }) {
  const { t } = useTranslation();
  const STATUS_LABELS = STATUS_KEYS.map((k) => t(`applications.status_${k}`));
  const colors = STATUS_KEYS.map((k) => APPLICATION_STATUS_COLORS[k]);
  const series = STATUS_KEYS.map((k) => byStatus?.[k] ?? 0);
  const total = series.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green/10 text-green">
          <MdFactCheck className="h-5 w-5" />
        </div>
        <p className="text-sm font-bold text-slate-900">{t("staff_dashboard.applications_donut_title")}</p>
      </div>

      {loading ? (
        <Skeleton className="mx-auto h-40 w-40 rounded-full" />
      ) : total === 0 ? (
        <p className="py-8 text-center text-xs text-slate-400">{t("admin_dashboard.no_data_yet")}</p>
      ) : (
        <div className="flex flex-col items-center">
          <ReactApexChart type="donut" series={series} options={donutOpts(STATUS_LABELS, colors)} height={160} />
          <div className="mt-3 grid w-full grid-cols-3 gap-2">
            {STATUS_LABELS.map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />
                <span className="text-[11px] text-slate-500">{label}</span>
                <span className="text-xs font-bold text-slate-700">{series[i]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
