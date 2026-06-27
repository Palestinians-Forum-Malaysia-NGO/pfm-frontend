import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes.js";
import PageTransition from "components/ui/PageTransition";
import BeneficiaryCreate from "views/admin/beneficiaries/BeneficiaryCreate";
import BeneficiaryDetail from "views/admin/beneficiaries/BeneficiaryDetail";
import BeneficiaryEdit   from "views/admin/beneficiaries/BeneficiaryEdit";
import CategoryCreate    from "views/admin/categories/CategoryCreate";
import CategoryDetail    from "views/admin/categories/CategoryDetail";
import CategoryEdit      from "views/admin/categories/CategoryEdit";
import ProjectCreate     from "views/admin/projects/ProjectCreate";
import ProjectDetail     from "views/admin/projects/ProjectDetail";
import ProjectEdit       from "views/admin/projects/ProjectEdit";

const SUB_ROUTE_NAMES = {
  "/beneficiaries/create": "New Beneficiary",
  "/categories/create":    "New Category",
  "/projects/create":      "New Project",
};

export default function StaffLayout() {
  const location = useLocation();
  const [open, setOpen]                 = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Dashboard");

  React.useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const path = location.pathname;
    const subMatch = Object.keys(SUB_ROUTE_NAMES).find((k) => path.endsWith(k));
    if (subMatch) { setCurrentRoute(SUB_ROUTE_NAMES[subMatch]); return; }
    if (path.match(/\/beneficiaries\/[^/]+\/edit$/)) { setCurrentRoute("Edit Beneficiary"); return; }
    if (path.match(/\/categories\/[^/]+\/edit$/))    { setCurrentRoute("Edit Category");    return; }
    if (path.match(/\/projects\/[^/]+\/edit$/))      { setCurrentRoute("Edit Project");     return; }
    if (path.match(/\/beneficiaries\/[^/]+$/))       { setCurrentRoute("Beneficiary Detail"); return; }
    if (path.match(/\/categories\/[^/]+$/))          { setCurrentRoute("Category Detail");  return; }
    if (path.match(/\/projects\/[^/]+$/))            { setCurrentRoute("Project Detail");   return; }
    const active = routes.find((r) => r.layout === "/staff" && path.includes(r.path));
    if (active) setCurrentRoute(active.name);
  }, [location.pathname]);

  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/staff" ? (
        <Route path={`/${route.path}`} element={route.component} key={key} />
      ) : null
    );

  document.documentElement.dir = "ltr";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={open} onClose={() => setOpen(false)} layout="/staff" />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col min-h-screen min-w-0 xl:ml-[280px]">
        <Navbar onOpenSidenav={() => setOpen(true)} brandText={currentRoute} />

        <main className="flex-1 p-4 md:p-6">
          <PageTransition>
            <Routes>
              {getRoutes()}
              <Route path="/beneficiaries/create"   element={<BeneficiaryCreate />} />
              <Route path="/beneficiaries/:id"      element={<BeneficiaryDetail />} />
              <Route path="/beneficiaries/:id/edit" element={<BeneficiaryEdit />} />
              <Route path="/categories/create"      element={<CategoryCreate />} />
              <Route path="/categories/:id"         element={<CategoryDetail />} />
              <Route path="/categories/:id/edit"    element={<CategoryEdit />} />
              <Route path="/projects/create"        element={<ProjectCreate />} />
              <Route path="/projects/:id"           element={<ProjectDetail />} />
              <Route path="/projects/:id/edit"      element={<ProjectEdit />} />
              <Route path="/" element={<Navigate to="/staff/default" replace />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />
      </div>
    </div>
  );
}
