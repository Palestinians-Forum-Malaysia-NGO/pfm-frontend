import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar  from "components/navbar";
import Sidebar from "components/sidebar";
import Footer  from "components/footer/FooterAuthDefault";
import routes  from "routes.js";
import PageTransition from "components/ui/PageTransition";

export default function BeneficiaryLayout() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const [open, setOpen]                 = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const active = routes.find(
      (r) => r.layout === "/beneficiary" && location.pathname.includes(r.path)
    );
    if (active) setCurrentRoute(active.name);
  }, [location.pathname]);

  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/beneficiary" ? (
        <Route path={`/${route.path}`} element={route.component} key={key} />
      ) : null
    );

  React.useEffect(() => {
    document.documentElement.dir  = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} layout="/beneficiary" />

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col min-h-screen min-w-0 xl:ltr:ml-[280px] xl:rtl:mr-[280px]">
        <Navbar onOpenSidenav={() => setOpen(true)} brandText={currentRoute} />

        <main className="flex-1 p-4 md:p-6">
          <PageTransition>
            <Routes>
              {getRoutes()}
              <Route path="/" element={<Navigate to="/beneficiary/default" replace />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />
      </div>
    </div>
  );
}
