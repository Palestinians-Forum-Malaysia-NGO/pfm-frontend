import React from "react";
import { useTranslation } from "react-i18next";

export default function FooterAuthDefault() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto flex w-full max-w-screen-sm items-center justify-center px-5 pb-4 lg:max-w-full xl:pb-6">
      <p className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Palestinian Forum Malaysia. {t("footer.rights")}
      </p>
    </div>
  );
}
