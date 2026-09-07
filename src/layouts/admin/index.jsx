import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/FooterAuthDefault";
import routes from "routes.js";
import { ROUTE_KEY } from "components/sidebar/components/Links";
import PageTransition from "components/ui/PageTransition";
import UserCreate   from "views/admin/users/UserCreate";
import UserDetail   from "views/admin/users/UserDetail";
import UserEdit     from "views/admin/users/UserEdit";
import BeneficiaryDetail from "views/admin/beneficiaries/BeneficiaryDetail";
import BeneficiaryEdit   from "views/admin/beneficiaries/BeneficiaryEdit";
import StaffCreate      from "views/admin/staff/StaffCreate";
import StaffDetail      from "views/admin/staff/StaffDetail";
import StaffEdit        from "views/admin/staff/StaffEdit";
import CategoryCreate   from "views/admin/categories/CategoryCreate";
import CategoryDetail   from "views/admin/categories/CategoryDetail";
import CategoryEdit     from "views/admin/categories/CategoryEdit";
import ClassificationCreate from "views/admin/classifications/ClassificationCreate";
import ClassificationDetail from "views/admin/classifications/ClassificationDetail";
import ClassificationEdit   from "views/admin/classifications/ClassificationEdit";
import ContactMessageDetail from "views/admin/contactMessages/ContactMessageDetail";
import FeedbackDetail from "views/admin/feedback/FeedbackDetail";
import OpportunityCreate from "views/admin/opportunities/OpportunityCreate";
import OpportunityDetail from "views/admin/opportunities/OpportunityDetail";
import OpportunityEdit   from "views/admin/opportunities/OpportunityEdit";
import OpportunityApplicationDetail from "views/admin/opportunities/OpportunityApplicationDetail";
import NewsCreate from "views/admin/news/NewsCreate";
import NewsDetail from "views/admin/news/NewsDetail";
import NewsEdit   from "views/admin/news/NewsEdit";
import BlogCreate from "views/admin/blogs/BlogCreate";
import BlogDetail from "views/admin/blogs/BlogDetail";
import BlogEdit   from "views/admin/blogs/BlogEdit";
import EventCreate from "views/admin/events/EventCreate";
import EventDetail from "views/admin/events/EventDetail";
import EventEdit   from "views/admin/events/EventEdit";
import PartnershipCreate from "views/admin/partnerships/PartnershipCreate";
import PartnershipDetail from "views/admin/partnerships/PartnershipDetail";
import PartnershipEdit   from "views/admin/partnerships/PartnershipEdit";
import InactivePartnerships from "views/admin/partnerships/InactivePartnerships";
import BranchCreate from "views/admin/branches/BranchCreate";
import BranchDetail from "views/admin/branches/BranchDetail";
import BranchEdit   from "views/admin/branches/BranchEdit";
import ApplicationCreate from "views/admin/applications/ApplicationCreate";
import ApplicationDetail from "views/admin/applications/ApplicationDetail";
import ProjectCreate    from "views/admin/projects/ProjectCreate";
import ProjectDetail    from "views/admin/projects/ProjectDetail";
import ProjectEdit      from "views/admin/projects/ProjectEdit";
import NotificationsPage    from "views/admin/newsletter/Notifications";
import NotificationDetail   from "views/admin/newsletter/NotificationDetail";

const SUB_ROUTE_NAMES = {
  "/users/create":      "New Super Administrator",
  "/staff/create":      "New Staff",
  "/categories/create":      "New Category",
  "/classifications/create": "New Classification",
  "/projects/create":   "New Project",
  "/partnerships/create": "New Partnership",
  "/partnerships/inactive": "Inactive Partners",
  "/branches/create": "New Branch",
  "/applications/create": "New Application",
  "/opportunities/create": "New Opportunity",
  "/news/create": "New Article",
  "/events/create": "New Event",
  "/newsletter/notifications": "Notifications",
};

export default function Admin(props) {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [open, setOpen]               = React.useState(true);
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
    // Check explicit sub-route names first
    const subMatch = Object.keys(SUB_ROUTE_NAMES).find((k) => path.endsWith(k));
    if (subMatch) { setCurrentRouteName(SUB_ROUTE_NAMES[subMatch]); return; }
    // Edit pages
    if (path.match(/\/users\/\d+\/edit$/))   { setCurrentRouteName("Edit Super Administrator");   return; }
    if (path.match(/\/beneficiaries\/[^/]+\/edit$/)) { setCurrentRouteName("Edit Beneficiary"); return; }
    if (path.match(/\/staff\/[^/]+\/edit$/))         { setCurrentRouteName("Edit Staff");      return; }
    if (path.match(/\/categories\/[^/]+\/edit$/))       { setCurrentRouteName("Edit Category");       return; }
    if (path.match(/\/classifications\/[^/]+\/edit$/)) { setCurrentRouteName("Edit Classification");  return; }
    if (path.match(/\/projects\/[^/]+\/edit$/))        { setCurrentRouteName("Edit Project");         return; }
    if (path.match(/\/partnerships\/[^/]+\/edit$/))    { setCurrentRouteName("Edit Partnership");      return; }
    if (path.match(/\/branches\/[^/]+\/edit$/))        { setCurrentRouteName("Edit Branch");           return; }
    if (path.match(/\/opportunities\/[^/]+\/edit$/))   { setCurrentRouteName("Edit Opportunity");      return; }
    if (path.match(/\/news\/[^/]+\/edit$/))            { setCurrentRouteName("Edit News Article");     return; }
    if (path.match(/\/blogs\/[^/]+\/edit$/))           { setCurrentRouteName("Edit Blog");              return; }
    if (path.match(/\/events\/[^/]+\/edit$/))          { setCurrentRouteName("Edit Event");             return; }
    // Detail pages
    if (path.match(/\/users\/\d+$/))                   { setCurrentRouteName("Super Administrator Detail");          return; }
    if (path.match(/\/beneficiaries\/[^/]+$/))         { setCurrentRouteName("Beneficiary Detail");   return; }
    if (path.match(/\/staff\/[^/]+$/))                   { setCurrentRouteName("Staff Detail");         return; }
    if (path.match(/\/categories\/[^/]+$/))            { setCurrentRouteName("Category Detail");      return; }
    if (path.match(/\/classifications\/[^/]+$/))       { setCurrentRouteName("Classification Detail"); return; }
    if (path.match(/\/projects\/[^/]+$/))              { setCurrentRouteName("Project Detail");        return; }
    if (path.match(/\/contact-messages\/[^/]+$/))      { setCurrentRouteName("Contact Message Detail"); return; }
    if (path.match(/\/feedback\/[^/]+$/))               { setCurrentRouteName("Feedback Detail"); return; }
    if (path.match(/\/opportunities\/[^/]+\/applications\/[^/]+$/)) { setCurrentRouteName("Opportunity Application Detail"); return; }
    if (path.match(/\/opportunities\/[^/]+$/))         { setCurrentRouteName("Opportunity Detail");    return; }
    if (path.match(/\/news\/[^/]+$/))                  { setCurrentRouteName("News Article Detail");   return; }
    if (path.match(/\/blogs\/[^/]+$/))                 { setCurrentRouteName("Blog Detail");            return; }
    if (path.match(/\/events\/[^/]+$/))                { setCurrentRouteName("Event Detail");           return; }
    if (path.match(/\/partnerships\/[^/]+$/))          { setCurrentRouteName("Partnership Detail");    return; }
    if (path.match(/\/branches\/[^/]+$/))              { setCurrentRouteName("Branch Detail");         return; }
    if (path.match(/\/applications\/[^/]+$/))          { setCurrentRouteName("Application Detail");    return; }
    if (path.match(/\/newsletter\/notifications\/[^/]+$/)) { setCurrentRouteName("Notification Detail"); return; }
    // Top-level route names from routes.js
    const active = routes.find((r) => r.layout === "/admin" && path.includes(r.path));
    if (active) setCurrentRouteName(active.name);
  }, [location.pathname]);

  const getRoutes = () =>
    routes.map((route, key) =>
      route.layout === "/admin" ? (
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
      <Sidebar open={open} onClose={() => setOpen(false)} />

      {/* Overlay for mobile */}
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
              <Route path="/users/create"     element={<UserCreate />} />
              <Route path="/users/:id"        element={<UserDetail />} />
              <Route path="/users/:id/edit"   element={<UserEdit />} />
              <Route path="/beneficiaries/:id"      element={<BeneficiaryDetail />} />
              <Route path="/beneficiaries/:id/edit" element={<BeneficiaryEdit />} />
              <Route path="/staff/create"          element={<StaffCreate />} />
              <Route path="/staff/:id"             element={<StaffDetail />} />
              <Route path="/staff/:id/edit"        element={<StaffEdit />} />
              <Route path="/categories/create"          element={<CategoryCreate />} />
              <Route path="/categories/:id"             element={<CategoryDetail />} />
              <Route path="/categories/:id/edit"        element={<CategoryEdit />} />
              <Route path="/classifications/create"     element={<ClassificationCreate />} />
              <Route path="/classifications/:id"        element={<ClassificationDetail />} />
              <Route path="/classifications/:id/edit"   element={<ClassificationEdit />} />
              <Route path="/projects/create"       element={<ProjectCreate />} />
              <Route path="/projects/:id"          element={<ProjectDetail />} />
              <Route path="/projects/:id/edit"     element={<ProjectEdit />} />
              <Route path="/contact-messages/:id"  element={<ContactMessageDetail />} />
              <Route path="/feedback/:id"          element={<FeedbackDetail />} />
              <Route path="/opportunities/create"   element={<OpportunityCreate />} />
              <Route path="/opportunities/:id"      element={<OpportunityDetail />} />
              <Route path="/opportunities/:id/edit" element={<OpportunityEdit />} />
              <Route path="/opportunities/:opportunityId/applications/:id" element={<OpportunityApplicationDetail />} />
              <Route path="/news/create"   element={<NewsCreate />} />
              <Route path="/news/:id"      element={<NewsDetail />} />
              <Route path="/news/:id/edit" element={<NewsEdit />} />
              <Route path="/blogs/create"   element={<BlogCreate />} />
              <Route path="/blogs/:id"      element={<BlogDetail />} />
              <Route path="/blogs/:id/edit" element={<BlogEdit />} />
              <Route path="/events/create"   element={<EventCreate />} />
              <Route path="/events/:id"      element={<EventDetail />} />
              <Route path="/events/:id/edit" element={<EventEdit />} />
              <Route path="/partnerships/create"   element={<PartnershipCreate />} />
              <Route path="/partnerships/inactive" element={<InactivePartnerships />} />
              <Route path="/partnerships/:id"      element={<PartnershipDetail />} />
              <Route path="/partnerships/:id/edit" element={<PartnershipEdit />} />
              <Route path="/branches/create"   element={<BranchCreate />} />
              <Route path="/branches/:id"      element={<BranchDetail />} />
              <Route path="/branches/:id/edit" element={<BranchEdit />} />
              <Route path="/applications/create" element={<ApplicationCreate />} />
              <Route path="/applications/:id"    element={<ApplicationDetail />} />
              <Route path="/newsletter/notifications"     element={<NotificationsPage />} />
              <Route path="/newsletter/notifications/:id" element={<NotificationDetail />} />
              <Route path="/" element={<Navigate to="/admin/default" replace />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />
      </div>
    </div>
  );
}
