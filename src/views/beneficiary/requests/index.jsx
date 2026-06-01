import ComingSoonPage from "components/ui/ComingSoonPage";
import { MdAssignment } from "react-icons/md";

const BeneficiaryRequests = () => (
  <ComingSoonPage
    title="My Aid Requests"
    description="Submit, track, and manage your humanitarian aid requests."
    icon={<MdAssignment className="h-11 w-11" />}
    showBack={false}
  />
);

export default BeneficiaryRequests;
