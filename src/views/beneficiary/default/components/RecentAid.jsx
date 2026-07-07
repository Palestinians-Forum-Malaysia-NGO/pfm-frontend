import { useTranslation } from "react-i18next";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";

const TYPE_STYLES = {
  "Aid Received": {
    badge:  "border border-green/50 text-[#006833] bg-green/10",
    amount: "text-[#006833]",
    icon:   MdArrowDownward,
  },
  "Request Sent": {
    badge:  "border border-blue-200 text-blue-600 bg-blue-50",
    amount: "text-blue-600",
    icon:   MdArrowUpward,
  },
  "Pending": {
    badge:  "border border-amber-200 text-amber-600 bg-amber-50",
    amount: "text-amber-600",
    icon:   MdArrowUpward,
  },
};

const RecentAid = ({ records, asOf }) => {
  const { t } = useTranslation();
  const TYPE_LABEL = {
    "Aid Received": t("beneficiary_dashboard.type_aid_received"),
    "Request Sent": t("beneficiary_dashboard.type_request_sent"),
    "Pending":      t("beneficiary_dashboard.type_pending"),
  };
  const COLUMNS = [
    t("beneficiary_dashboard.col_description"),
    t("beneficiary_dashboard.col_date"),
    t("beneficiary_dashboard.col_amount"),
    t("beneficiary_dashboard.col_status"),
  ];

  return (
  <div className="rounded-2xl bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h3 className="font-bold text-navy-700">{t("beneficiary_dashboard.recent_activity_title")}</h3>
        <p className="mt-0.5 text-xs text-gray-400">{asOf}</p>
      </div>
      <button className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-800">
        {t("beneficiary_dashboard.view_all")}
      </button>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px]">
        <thead>
          <tr className="border-b border-gray-100">
            {COLUMNS.map((col) => (
              <th key={col} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {records.map((rec, i) => {
            const style = TYPE_STYLES[rec.type] ?? TYPE_STYLES["Pending"];
            const Icon  = style.icon;
            return (
              <tr key={i} className="transition hover:bg-gray-50/60">
                <td className="py-3.5 pr-4 text-sm text-gray-600">{rec.description}</td>
                <td className="py-3.5 pr-4 text-sm text-gray-400">{rec.date}</td>
                <td className={`py-3.5 pr-4 text-sm font-semibold ${style.amount}`}>
                  <span className="flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5" />
                    {rec.amount}
                  </span>
                </td>
                <td className="py-3.5">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}>
                    {TYPE_LABEL[rec.type] ?? rec.type}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default RecentAid;
