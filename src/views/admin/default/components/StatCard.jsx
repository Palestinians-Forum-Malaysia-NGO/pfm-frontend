const StatCard = ({ label, value, sub, icon: Icon, iconBg, iconColor, trend }) => {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              trend >= 0
                ? "bg-green/10 text-[#006833]"
                : "bg-pfmRed-50 text-pfmRed-500"
            }`}
          >
            {trend >= 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-navy-700">{value}</p>
        <p className="mt-0.5 text-xs text-gray-400">{label}</p>
        {sub && <p className="mt-1 text-[11px] text-gray-300">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
