import {
  MdFavorite,
  MdCampaign,
  MdPeople,
  MdVolunteerActivism,
} from "react-icons/md";

import StatCard from "./components/StatCard";

// ── Mock data ──────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Total Donations",
    value: "RM 125,000",
    sub: "All time received",
    icon: MdFavorite,
    iconBg: "bg-green/10",
    iconColor: "text-green",
    trend: 12,
  },
  {
    label: "Active Campaigns",
    value: "8",
    sub: "3 ending this month",
    icon: MdCampaign,
    iconBg: "bg-pfmRed-50",
    iconColor: "text-pfmRed-500",
    trend: 0,
  },
  {
    label: "Total Members",
    value: "342",
    sub: "18 joined this week",
    icon: MdPeople,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    trend: 5,
  },
  {
    label: "Aid Distributed",
    value: "RM 89,500",
    sub: "Sent to beneficiaries",
    icon: MdVolunteerActivism,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    trend: 8,
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
