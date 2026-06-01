import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import UserCreate   from "views/admin/users/UserCreate";
import UserDetail   from "views/admin/users/UserDetail";
import UserEdit     from "views/admin/users/UserEdit";
import MemberCreate from "views/admin/members/MemberCreate";
import MemberDetail from "views/admin/members/MemberDetail";
import MemberEdit   from "views/admin/members/MemberEdit";

const SUB_ROUTE_NAMES = {
  "/users/create":  "New User",
  "/members/create":"New Member",
};

export default function Admin(props) {
  const location = useLocation();
  const [open, setOpen]               = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const path = location.pathname;
    // Check explicit sub-route names first
    const subMatch = Object.keys(SUB_ROUTE_NAMES).find((k) => path.endsWith(k));
    if (subMatch) { setCurrentRoute(SUB_ROUTE_NAMES[subMatch]); return; }
    // Edit pages
    if (path.match(/\/users\/\d+\/edit$/))   { setCurrentRoute("Edit User");   return; }
    if (path.match(/\/members\/\d+\/edit$/)) { setCurrentRoute("Edit Member"); return; }
    // Detail pages
    if (path.match(/\/users\/\d+$/))         { setCurrentRoute("User Detail");   return; }
    if (path.match(/\/members\/\d+$/))       { setCurrentRoute("Member Detail"); return; }
    // Top-level route names from routes.js
    const active = routes.find((r) => r.layout === "/admin" && path.includes(r.path));
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
    <div className="flex min-h-screen bg-slate-50">
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
      <div className="flex flex-1 flex-col min-h-screen min-w-0 xl:ml-[280px]">
        <Navbar onOpenSidenav={() => setOpen(true)} brandText={currentRoute} />

        <main className="flex-1 p-4 md:p-6">
          <Routes>
            {getRoutes()}
            <Route path="/users/create"     element={<UserCreate />} />
            <Route path="/users/:id"        element={<UserDetail />} />
            <Route path="/users/:id/edit"   element={<UserEdit />} />
            <Route path="/members/create"   element={<MemberCreate />} />
            <Route path="/members/:id"      element={<MemberDetail />} />
            <Route path="/members/:id/edit" element={<MemberEdit />} />
            <Route path="/" element={<Navigate to="/admin/default" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
