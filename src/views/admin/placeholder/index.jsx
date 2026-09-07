import { useTranslation } from "react-i18next";
import ComingSoonPage from "components/ui/ComingSoonPage";
import { ROUTE_KEY } from "components/sidebar/components/Links";

const Placeholder = ({ pageName }) => {
  const { t } = useTranslation();
  const title = pageName
    ? t(ROUTE_KEY[pageName] ?? pageName, { defaultValue: pageName })
    : undefined;
  return <ComingSoonPage title={title} />;
};

export default Placeholder;
