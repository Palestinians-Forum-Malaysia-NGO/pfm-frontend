import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";

export default function Admin(props) {
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const active = routes.find(
      (r) => r.layout === "/admin" && location.pathname.includes(r.path)
    );
    if (active) setCurrentRoute(active.name);
  }, [location.pathname]);

  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/admin" ? (
        <Route path={`/${route.path}`} element={route.component} key={key} />
      ) : null
    );

  document.documentElement.dir = "ltr";

  return (
    <div className="flex min-h-screen bg-lightPrimary">
      {/* Sidebar */}
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex flex-1 flex-col min-h-screen xl:ml-[280px]">
        <Navbar
          onOpenSidenav={() => setOpen(true)}
          brandText={currentRoute}
        />

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            {getRoutes()}
            <Route path="/" element={<Navigate to="/admin/default" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
