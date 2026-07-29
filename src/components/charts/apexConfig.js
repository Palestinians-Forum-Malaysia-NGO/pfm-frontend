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

export const barOpts = (categories) => ({
  chart:      { type: "bar", toolbar: { show: false } },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 6,
      barHeight: "55%",
      distributed: true,
    },
  },
  colors:      ["#007A3D", "#00a351", "#00c45f", "#34d578", "#6ee7a0"],
  dataLabels:  { enabled: false },
  legend:      { show: false },
  grid:        { show: false },
  xaxis: {
    categories,
    labels: { style: { colors: "#94A3B8", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks:  { show: false },
  },
  yaxis: {
    labels: { style: { colors: "#64748B", fontSize: "12px", fontWeight: 500 } },
  },
  tooltip: { theme: "dark", style: { fontSize: "12px" } },
});
