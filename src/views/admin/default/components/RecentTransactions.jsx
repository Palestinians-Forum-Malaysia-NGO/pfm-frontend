import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

const TYPE_STYLES = {
  Donation: {
    badge: "border border-brand-300 text-brand-600 bg-brand-50",
    amount: "text-brand-600",
    icon: MdArrowUpward,
  },
  "Aid Sent": {
    badge: "border border-pfmRed-300 text-pfmRed-500 bg-pfmRed-50",
    amount: "text-pfmRed-500",
    icon: MdArrowDownward,
  },
};

const RecentTransactions = ({ transactions, asOf }) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="font-bold text-navy-700">Recent Transactions</h3>
          <p className="mt-0.5 text-xs text-gray-400">{asOf}</p>
        </div>
        <button className="rounded-xl bg-navy-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-800">
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="border-b border-gray-100">
              {["Description", "Date", "Amount", "Type"].map((col) => (
                <th
                  key={col}
                  className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx, i) => {
              const style = TYPE_STYLES[tx.type] || TYPE_STYLES["Donation"];
              const Icon = style.icon;
              return (
                <tr key={i} className="transition hover:bg-gray-50/60">
                  <td className="py-3.5 pr-4 text-sm text-gray-600">
                    {tx.description}
                  </td>
                  <td className="py-3.5 pr-4 text-sm text-gray-400">
                    {tx.date}
                  </td>
                  <td
                    className={`py-3.5 pr-4 text-sm font-semibold ${style.amount}`}
                  >
                    <span className="flex items-center gap-1">
                      <Icon className="h-3.5 w-3.5" />
                      {tx.amount}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                    >
                      {tx.type}
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

export default RecentTransactions;
