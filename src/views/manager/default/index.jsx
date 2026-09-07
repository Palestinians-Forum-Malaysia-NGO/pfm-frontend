import React from "react";
import { MdPeople, MdFavorite, MdEvent, MdBarChart } from "react-icons/md";

const CARDS = [
  { label: "Members",   value: "—", icon: <MdPeople   className="h-6 w-6" />, bg: "bg-green/10",    color: "text-green" },
  { label: "Donations", value: "—", icon: <MdFavorite  className="h-6 w-6" />, bg: "bg-pfmRed-50",   color: "text-pfmRed-500" },
  { label: "Events",    value: "—", icon: <MdEvent     className="h-6 w-6" />, bg: "bg-blue-50",     color: "text-blue-500" },
  { label: "Reports",   value: "—", icon: <MdBarChart  className="h-6 w-6" />, bg: "bg-amber-50",    color: "text-amber-500" },
];

const ManagerDashboard = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-xl font-bold text-navy-700">Manager Dashboard</h1>
      <p className="mt-1 text-sm text-gray-400">Overview of your managed areas</p>
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map((c) => (
        <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
            {c.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">{c.label}</p>
            <p className="text-2xl font-bold text-navy-700">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ManagerDashboard;
