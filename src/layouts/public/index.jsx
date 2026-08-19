import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import PublicNavbar from "components/navbar/PublicNavbar";
import Footer from "components/footer/Footer";
import Home from "views/public/home";

export default function PublicLayout() {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  React.useEffect(() => {
    document.documentElement.dir  = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {!isHome && <PublicNavbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isHome && <Footer />}
    </div>
  );
}
