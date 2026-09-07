import { useTranslation } from "react-i18next";
import ComingSoonPage from "components/ui/ComingSoonPage";
import { MdSettings } from "react-icons/md";

const BeneficiarySettings = () => {
  const { t } = useTranslation();
  return (
    <ComingSoonPage
      title={t("navbar.settings")}
      description={t("beneficiary_dashboard.settings_page_desc")}
      icon={<MdSettings className="h-11 w-11" />}
      showBack={false}
    />
  );
};

export default BeneficiarySettings;
