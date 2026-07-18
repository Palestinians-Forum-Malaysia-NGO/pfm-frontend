/* eslint-disable */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import { useTranslation } from "react-i18next";
import useAuth from "components/features/auth/hooks/useAuth";

const SECTION_ORDER = ["MAIN", "COMMUNITY", "SYSTEM", "ACCOUNT"];

const SECTION_KEY = {
  MAIN:      "sidebar.section_main",
  COMMUNITY: "sidebar.section_community",
  SYSTEM:    "sidebar.section_system",
  ACCOUNT:   "sidebar.section_account",
};

export const ROUTE_KEY = {
  "Dashboard":           "sidebar.dashboard",
  "Projects":            "sidebar.projects",
  "Beneficiaries":       "sidebar.beneficiaries",
  "Applications":        "sidebar.applications",
  "Contact Messages":    "sidebar.contact_messages",
  "Feedback":            "sidebar.feedback",
  "Opportunities":       "sidebar.opportunities",
  "News":                "sidebar.news",
  "Newsletter":          "sidebar.newsletter",
  "Subscribers":         "sidebar.subscribers",
  "Notifications":       "sidebar.notifications",
  "Classifications":     "sidebar.classifications",
  "Categories":          "sidebar.categories",
  "Partnerships":        "sidebar.partnerships",
  "Branches":            "sidebar.branches",
  "Staff":               "sidebar.staff",
  "Users":               "sidebar.users",
  "Profile":             "sidebar.profile",
  "My Requests":         "sidebar.my_requests",
  "Settings":            "sidebar.settings",
  "All Projects":        "sidebar.all_projects",
  "New Project":         "sidebar.new_project",
  "All Categories":      "sidebar.all_categories",
  "Add Category":        "sidebar.add_category",
  "All Classifications": "sidebar.all_classifications",
  "Add Classification":  "sidebar.add_classification",
  "All Partnerships":    "sidebar.all_partnerships",
  "Add Partnership":     "sidebar.add_partnership",
  "All Opportunities":   "sidebar.all_opportunities",
  "All News":            "sidebar.all_news",
  "All Events":          "sidebar.all_events",
  "All Branches":        "sidebar.all_branches",
  "Add Branch":          "sidebar.add_branch",
  "All Applications":    "sidebar.all_applications",
  "New Application":     "sidebar.new_application_title",
  "All Staff":           "sidebar.all_staff",
  "Add Staff":           "sidebar.add_staff",
  "All Users":           "sidebar.all_users",
  "Add User":            "sidebar.add_user",
  "New User":            "sidebar.new_user_title",
  "New Staff":           "sidebar.new_staff_title",
  "New Category":        "sidebar.new_category_title",
  "New Classification":  "sidebar.new_classification_title",
  "New Project":         "projects.add_title",
  "New Partnership":     "sidebar.new_partnership_title",
  "New Branch":          "sidebar.new_branch_title",
  "New Opportunity":     "sidebar.new_opportunity_title",
  "New Article":         "sidebar.new_article_title",
  "New Event":           "sidebar.new_event_title",
  "Edit User":           "users.edit_user",
  "Edit Beneficiary":    "beneficiaries.edit_title",
  "Edit Staff":          "sidebar.edit_staff_title",
  "Edit Category":       "categories.edit_title",
  "Edit Classification": "classifications.edit_title",
  "Edit Project":        "projects.edit_project",
  "Edit Partnership":    "partnerships.edit_title",
  "Edit Branch":         "branches.edit_title",
  "Edit Opportunity":    "opportunities.edit_title",
  "Edit News Article":   "news.edit_title",
  "Edit Event":          "events.edit_title",
  "User Detail":         "sidebar.user_detail_title",
  "Beneficiary Detail":  "sidebar.beneficiary_detail_title",
  "Staff Detail":        "sidebar.staff_detail_title",
  "Category Detail":     "sidebar.category_detail_title",
  "Classification Detail": "sidebar.classification_detail_title",
  "Project Detail":      "sidebar.project_detail_title",
  "Contact Message Detail": "sidebar.contact_message_detail_title",
  "Feedback Detail":     "sidebar.feedback_detail_title",
  "Opportunity Detail":  "sidebar.opportunity_detail_title",
  "Opportunity Application Detail": "sidebar.opportunity_application_detail_title",
  "News Article Detail": "sidebar.news_article_detail_title",
  "Event Detail":        "sidebar.event_detail_title",
  "Partnership Detail":  "sidebar.partnership_detail_title",
  "Branch Detail":       "sidebar.branch_detail_title",
  "Application Detail":  "sidebar.application_detail_title",
  "Notification Detail": "sidebar.notification_detail_title",
  "News & Updates":      "sidebar.news_updates",
  "Events":              "nav.events",
  "Donations":           "categories.module_donations",
  "Campaigns":           "categories.module_campaigns",
  "Reports":             "staff_dashboard.reports",
};

// ── Single nav item (with or without children) ─────────────────────────────────
function NavItem({ route }) {
  const { t } = useTranslation();
  const location = useLocation();

  const isPathActive = (path) => location.pathname.includes(path);

  const hasChildren = Array.isArray(route.children) && route.children.length > 0;

  // Auto-open accordion if any child is currently active
  const childIsActive = hasChildren && route.children.some((c) => isPathActive(c.path));
  const [open, setOpen] = React.useState(childIsActive);

  // Keep open state in sync when navigating via URL directly
  React.useEffect(() => {
    if (childIsActive) setOpen(true);
  }, [location.pathname]);

  const parentActive = hasChildren ? childIsActive : isPathActive(route.path);

  // ── Parent with children (accordion) ────────────────────────────────────────
  if (hasChildren) {
    return (
      <div className="mb-0.5">
        {/* Accordion trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
            parentActive ? "bg-green/10" : "hover:bg-gray-100"
          }`}
        >
          <span
            className={`flex-shrink-0 transition-colors ${
              parentActive
                ? "text-green"
                : "text-gray-400 group-hover:text-green"
            }`}
          >
            {route.icon}
          </span>
          <span
            className={`flex-1 text-start text-sm font-medium transition-colors ${
              parentActive ? "text-green" : "text-navy-700"
            }`}
          >
            {t(ROUTE_KEY[route.name] ?? route.name, { defaultValue: route.name })}
          </span>
          <MdChevronRight
            className={`h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-200 ${
              open ? "ltr:rotate-90 rtl:-rotate-90" : ""
            }`}
          />
        </button>

        {/* Children — animated with max-height */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ltr:ml-4 rtl:mr-4 mt-0.5 flex flex-col ltr:border-l-2 rtl:border-r-2 border-gray-100 ltr:pl-3 rtl:pr-3">
            {route.children.map((child, i) => {
              const active = isPathActive(child.path);
              return (
                <Link key={i} to={`${route.layout}/${child.path}`}>
                  <div
                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-all duration-150 ${
                      active
                        ? "font-semibold text-green"
                        : "font-medium text-gray-500 hover:text-navy-700"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${
                        active ? "bg-green" : "bg-gray-300"
                      }`}
                    />
                    {t(ROUTE_KEY[child.name] ?? child.name, { defaultValue: child.name })}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Regular link (no children) ───────────────────────────────────────────────
  return (
    <Link to={route.layout + "/" + route.path}>
      <div
        className={`group mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
          parentActive
            ? "ltr:border-l-4 rtl:border-r-4 border-green text-green bg-green/10"
            : "hover:bg-gray-100"
        }`}
      >
        <span
          className={`flex-shrink-0 transition-colors ${
            parentActive
              ? "text-green"
              : "text-gray-400 group-hover:text-green"
          }`}
        >
          {route.icon}
        </span>
        <span
          className={`flex-1 text-sm font-medium transition-colors ${
            parentActive ? "text-green" : "text-navy-700"
          }`}
        >
          {t(ROUTE_KEY[route.name] ?? route.name, { defaultValue: route.name })}
        </span>
        {parentActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-green/60" />
        )}
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function SidebarLinks({ routes, layout = "/admin" }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const userRole = user?.role;

  const grouped = SECTION_ORDER.reduce((acc, section) => {
    const items = routes.filter(
      (r) =>
        r.layout === layout &&
        r.section === section &&
        !r.hidden &&
        (!r.roles || r.roles.includes(userRole))
    );
    if (items.length) acc[section] = items;
    return acc;
  }, {});

  return (
    <nav className="flex flex-col gap-1 px-4">
      {SECTION_ORDER.map((section) => {
        if (!grouped[section]) return null;
        return (
          <div key={section} className="mb-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {t(SECTION_KEY[section] ?? section, { defaultValue: section })}
            </p>
            {grouped[section].map((route, i) => (
              <NavItem key={i} route={route} />
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export default SidebarLinks;
