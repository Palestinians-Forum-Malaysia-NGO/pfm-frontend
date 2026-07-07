import { useTranslation } from "react-i18next";
import ComingSoonPage from "components/ui/ComingSoonPage";
import { MdAssignment } from "react-icons/md";

const BeneficiaryRequests = () => {
  const { t } = useTranslation();
  return (
    <ComingSoonPage
      title={t("beneficiary_dashboard.requests_page_title")}
      description={t("beneficiary_dashboard.requests_page_desc")}
      icon={<MdAssignment className="h-11 w-11" />}
      showBack={false}
    />
  );
};

export default BeneficiaryRequests;
