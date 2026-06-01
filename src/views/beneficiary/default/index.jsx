import {
  MdPending, MdCheckCircle, MdAssignmentTurnedIn, MdHourglass,
} from "react-icons/md";
import { FaHandHoldingHeart } from "react-icons/fa";

import StatCard    from "views/admin/default/components/StatCard";
import RecentAid   from "./components/RecentAid";
import NewRequest  from "./components/NewRequest";

// ── Mock data ──────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Active Requests",
    value: "2",
    sub: "Under review",
    icon: MdPending,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    trend: 0,
  },
  {
    label: "Approved",
    value: "1",
    sub: "Ready to collect",
    icon: MdCheckCircle,
    iconBg: "bg-green/10",
    iconColor: "text-green",
    trend: 0,
  },
  {
    label: "Completed",
    value: "3",
    sub: "Aid received",
    icon: MdAssignmentTurnedIn,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    trend: 0,
  },
  {
    label: "Total Aid",
    value: "RM 4,500",
    sub: "Lifetime received",
    icon: FaHandHoldingHeart,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    trend: 0,
  },
];

const RECORDS = [
  { description: "Medical Aid — Clinic Visit",         date: "10 Jun, 2025", amount: "RM 500.00",   type: "Aid Received" },
  { description: "Food Assistance — Ramadan Package",  date: "28 Mar, 2025", amount: "RM 300.00",   type: "Aid Received" },
  { description: "Emergency Relief Request",           date: "15 Feb, 2025", amount: "RM 1,200.00", type: "Aid Received" },
  { description: "Financial Support Application",      date: "01 Jun, 2025", amount: "RM 2,500.00", type: "Pending" },
  { description: "Education Fund — School Fees",       date: "03 Jun, 2025", amount: "RM 800.00",   type: "Request Sent" },
];

const AS_OF = new Date().toLocaleDateString("en-MY", {
  day: "2-digit", month: "short", year: "numeric",
  hour: "2-digit", minute: "2-digit",
});

// ── Component ──────────────────────────────────────────────────────────────────

const BeneficiaryDashboard = () => (
  <div className="flex flex-col gap-4">

    {/* ── Stat cards ── */}
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {STATS.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>

    {/* ── Main grid: left (2/3) + right (1/3) ── */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

      {/* Left — recent aid activity */}
      <div className="lg:col-span-2">
        <RecentAid records={RECORDS} asOf={AS_OF} />
      </div>

      {/* Right — new request widget */}
      <div className="lg:col-span-1">
        <NewRequest />
      </div>

    </div>
  </div>
);

export default BeneficiaryDashboard;
