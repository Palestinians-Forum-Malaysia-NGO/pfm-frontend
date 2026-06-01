import ComingSoonPage from "components/ui/ComingSoonPage";
import { MdSettings } from "react-icons/md";

const BeneficiarySettings = () => (
  <ComingSoonPage
    title="Settings"
    description="Manage your account preferences and notifications."
    icon={<MdSettings className="h-11 w-11" />}
    showBack={false}
  />
);

export default BeneficiarySettings;
