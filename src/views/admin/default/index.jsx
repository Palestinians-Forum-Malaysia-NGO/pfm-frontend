import {
  MdFavorite,
  MdCampaign,
  MdPeople,
  MdFolderSpecial,
} from "react-icons/md";

import BalanceCard from "./components/BalanceCard";
import BeneficiaryStatsWidget from "./components/BeneficiaryStatsWidget";

const STATS = [
  {
    label:      "Total Donations",
    value:      "RM 125,000",
    sub:        "All time received",
    icon:       MdFavorite,
    iconBg:     "bg-green/10",
    iconColor:  "text-green",
    trend:      12,
  },
  {
    label:      "Active Campaigns",
    value:      "8",
    sub:        "3 ending this month",
    icon:       MdCampaign,
    iconBg:     "bg-pfmRed-50",
    iconColor:  "text-pfmRed-500",
    trend:      0,
  },
  {
    label:      "Total Members",
    value:      "342",
    sub:        "18 joined this week",
    icon:       MdPeople,
    iconBg:     "bg-blue-50",
    iconColor:  "text-blue-500",
    trend:      5,
  },
  {
    label:      "Active Projects",
    value:      "14",
    sub:        "Across all categories",
    icon:       MdFolderSpecial,
    iconBg:     "bg-amber-50",
    iconColor:  "text-amber-500",
    trend:      8,
  },
];

const Dashboard = () => (
  <div className="flex flex-col gap-4 max-w-5xl mx-auto px-4">
    
    {/* ── Beneficiary stats (live) ── */}

    <BalanceCard />
    <BeneficiaryStatsWidget />

  </div>
);

export default Dashboard;
