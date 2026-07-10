import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/FooterAuthDefault";
import routes from "routes.js";
import { ROUTE_KEY } from "components/sidebar/components/Links";
import PageTransition from "components/ui/PageTransition";
import BeneficiaryDetail from "views/admin/beneficiaries/BeneficiaryDetail";
import BeneficiaryEdit   from "views/admin/beneficiaries/BeneficiaryEdit";
import CategoryCreate    from "views/admin/categories/CategoryCreate";
import CategoryDetail    from "views/admin/categories/CategoryDetail";
import CategoryEdit      from "views/admin/categories/CategoryEdit";
import ProjectCreate     from "views/admin/projects/ProjectCreate";
import ProjectDetail     from "views/admin/projects/ProjectDetail";
import ProjectEdit       from "views/admin/projects/ProjectEdit";
import ContactMessageDetail from "views/admin/contactMessages/ContactMessageDetail";
import PartnershipCreate from "views/admin/partnerships/PartnershipCreate";
import PartnershipDetail from "views/admin/partnerships/PartnershipDetail";
import PartnershipEdit   from "views/admin/partnerships/PartnershipEdit";
import BranchCreate from "views/admin/branches/BranchCreate";
import BranchDetail from "views/admin/branches/BranchDetail";
import BranchEdit   from "views/admin/branches/BranchEdit";

const SUB_ROUTE_NAMES = {
  "/categories/create":    "New Category",
  "/projects/create":      "New Project",
  "/partnerships/create":  "New Partnership",
  "/branches/create":      "New Branch",
};

export default function StaffLayout() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen]                 = React.useState(true);
  const [currentRouteName, setCurrentRouteName] = React.useState("Dashboard");
  const currentRoute = t(ROUTE_KEY[currentRouteName] ?? currentRouteName, { defaultValue: currentRouteName });

  React.useEffect(() => {
    const handleResize = () => setOpen(window.innerWidth >= 1200);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const path = location.pathname;
    const subMatch = Object.keys(SUB_ROUTE_NAMES).find((k) => path.endsWith(k));
    if (subMatch) { setCurrentRouteName(SUB_ROUTE_NAMES[subMatch]); return; }
    if (path.match(/\/beneficiaries\/[^/]+\/edit$/)) { setCurrentRouteName("Edit Beneficiary"); return; }
    if (path.match(/\/categories\/[^/]+\/edit$/))    { setCurrentRouteName("Edit Category");    return; }
    if (path.match(/\/projects\/[^/]+\/edit$/))      { setCurrentRouteName("Edit Project");     return; }
    if (path.match(/\/partnerships\/[^/]+\/edit$/))  { setCurrentRouteName("Edit Partnership");  return; }
    if (path.match(/\/branches\/[^/]+\/edit$/))      { setCurrentRouteName("Edit Branch");       return; }
    if (path.match(/\/beneficiaries\/[^/]+$/))       { setCurrentRouteName("Beneficiary Detail"); return; }
    if (path.match(/\/categories\/[^/]+$/))          { setCurrentRouteName("Category Detail");  return; }
    if (path.match(/\/projects\/[^/]+$/))            { setCurrentRouteName("Project Detail");   return; }
    if (path.match(/\/contact-messages\/[^/]+$/))    { setCurrentRouteName("Contact Message Detail"); return; }
    if (path.match(/\/partnerships\/[^/]+$/))        { setCurrentRouteName("Partnership Detail"); return; }
    if (path.match(/\/branches\/[^/]+$/))            { setCurrentRouteName("Branch Detail");     return; }
    const active = routes.find((r) => r.layout === "/staff" && path.includes(r.path));
    if (active) setCurrentRouteName(active.name);
  }, [location.pathname]);

  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/staff" ? (
        <Route path={`/${route.path}`} element={route.component} key={key} />
      ) : null
    );

  React.useEffect(() => {
    document.documentElement.dir  = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={open} onClose={() => setOpen(false)} layout="/staff" />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col min-h-screen min-w-0 xl:ltr:ml-[280px] xl:rtl:mr-[280px]">
        <Navbar onOpenSidenav={() => setOpen(true)} brandText={currentRoute} />

        <main className="flex-1 p-4 md:p-6">
          <PageTransition>
            <Routes>
              {getRoutes()}
              <Route path="/beneficiaries/:id"      element={<BeneficiaryDetail />} />
              <Route path="/beneficiaries/:id/edit" element={<BeneficiaryEdit />} />
              <Route path="/categories/create"      element={<CategoryCreate />} />
              <Route path="/categories/:id"         element={<CategoryDetail />} />
              <Route path="/categories/:id/edit"    element={<CategoryEdit />} />
              <Route path="/projects/create"        element={<ProjectCreate />} />
              <Route path="/projects/:id"           element={<ProjectDetail />} />
              <Route path="/projects/:id/edit"      element={<ProjectEdit />} />
              <Route path="/contact-messages/:id"   element={<ContactMessageDetail />} />
              <Route path="/partnerships/create"    element={<PartnershipCreate />} />
              <Route path="/partnerships/:id"       element={<PartnershipDetail />} />
              <Route path="/partnerships/:id/edit"  element={<PartnershipEdit />} />
              <Route path="/branches/create"    element={<BranchCreate />} />
              <Route path="/branches/:id"       element={<BranchDetail />} />
              <Route path="/branches/:id/edit"  element={<BranchEdit />} />
              <Route path="/" element={<Navigate to="/staff/default" replace />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />
      </div>
    </div>
  );
}
