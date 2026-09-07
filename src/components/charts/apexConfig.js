// Shared ApexCharts config/colors so every dashboard chart looks consistent
// instead of each widget re-declaring its own options.

export const BRAND_GREEN = "#007A3D";

// pending / approved / rejected — matches APPLICATION_STATUS_BADGE's palette
export const APPLICATION_STATUS_COLORS = { pending: "#F59E0B", approved: "#007A3D", rejected: "#EF4444" };

export const GENDER_COLORS = ["#3B82F6", "#EC4899", "#94A3B8"];

export const donutOpts = (labels, colors) => ({
  chart:       { type: "donut", toolbar: { show: false }, sparkline: { enabled: false } },
  labels,
  colors,
  legend:      { show: false },
  dataLabels:  { enabled: false },
  stroke:      { width: 0 },
  plotOptions: { pie: { donut: { size: "70%", labels: { show: false } }, expandOnClick: false } },
  tooltip:     { theme: "dark", style: { fontSize: "12px" } },
  states:      { hover: { filter: { type: "lighten", value: 0.05 } } },
});
