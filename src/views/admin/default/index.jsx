import BalanceCard from "./components/BalanceCard";
import BeneficiaryStatsWidget from "./components/BeneficiaryStatsWidget";
import OrgStatsOverview from "./components/OrgStatsOverview";

const Dashboard = () => (
  <div className="flex flex-col gap-4 max-w-5xl mx-auto px-4">

    <OrgStatsOverview />
    <BalanceCard />
    <BeneficiaryStatsWidget />

  </div>
);

export default Dashboard;
