import ComingSoonPage from "components/ui/ComingSoonPage";
import { MdPerson } from "react-icons/md";

const BeneficiaryProfile = () => (
  <ComingSoonPage
    title="My Profile"
    description="Manage your personal information and account details."
    icon={<MdPerson className="h-11 w-11" />}
    showBack={false}
  />
);

export default BeneficiaryProfile;
