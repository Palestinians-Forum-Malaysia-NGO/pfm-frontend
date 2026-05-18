import {
  MdFavorite,
  MdCampaign,
  MdPeople,
  MdVolunteerActivism,
} from "react-icons/md";

import StatCard from "./components/StatCard";
import BalanceCard from "./components/BalanceCard";
import RecentTransactions from "./components/RecentTransactions";
import QuickDonate from "./components/QuickDonate";

// ── Mock data ──────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Total Donations",
    value: "RM 125,000",
    sub: "All time received",
    icon: MdFavorite,
    iconBg: "bg-brand-50",
    iconColor: "text-brand-500",
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

const TRANSACTIONS = [
  {
    description: "Donation from Ahmad Razali",
    date: "12 Nov, 2024",
    amount: "RM 500.00",
    type: "Donation",
  },
  {
    description: "Aid sent to Gaza families",
    date: "11 Nov, 2024",
    amount: "RM 2,000.00",
    type: "Aid Sent",
  },
  {
    description: "Donation from Siti Nurhaliza",
    date: "10 Nov, 2024",
    amount: "RM 1,200.00",
    type: "Donation",
  },
  {
    description: "Medical supplies — Palestine",
    date: "09 Nov, 2024",
    amount: "RM 3,500.00",
    type: "Aid Sent",
  },
  {
    description: "Donation from Ali Hassan",
    date: "08 Nov, 2024",
    amount: "RM 800.00",
    type: "Donation",
  },
  {
    description: "Donation from Nurul Izzah",
    date: "07 Nov, 2024",
    amount: "RM 250.00",
    type: "Donation",
  },
];

const CAMPAIGNS = [
  "Gaza Medical Aid",
  "Food for Palestine",
  "Education Fund",
  "Orphan Support",
  "Winter Relief 2024",
];

const BENEFICIARIES = [
  "Al-Shifa Hospital",
  "UNRWA Malaysia",
  "Islamic Relief",
  "Palestinian Red Crescent",
  "Aman Palestine",
];

const AS_OF = new Date().toLocaleDateString("en-MY", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Main grid: left (2/3) + right (1/3) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <BalanceCard
            total="RM 125,000"
            available="RM 48,200"
            asOf={AS_OF}
          />
          <RecentTransactions transactions={TRANSACTIONS} asOf={AS_OF} />
        </div>

        {/* Right column */}
        <div className="lg:col-span-1">
          <QuickDonate campaigns={CAMPAIGNS} beneficiaries={BENEFICIARIES} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
