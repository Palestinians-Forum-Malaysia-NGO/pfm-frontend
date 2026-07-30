import React from "react";

// Page Imports
import MainDashboard from "views/admin/default";
import UsersPage from "views/admin/users";
import StaffPage from "views/admin/staff";
import BeneficiariesPage from "views/admin/beneficiaries";
import CategoriesPage        from "views/admin/categories";
import ClassificationsPage   from "views/admin/classifications";
import ContactMessagesPage   from "views/admin/contactMessages";
import FeedbackPage          from "views/admin/feedback";
import OpportunitiesPage     from "views/admin/opportunities";
import NewsPage              from "views/admin/news";
import BlogsPage             from "views/admin/blogs";
import EventsPage            from "views/admin/events";
import SubscribersPage       from "views/admin/newsletter/Subscribers";
import NotificationsPage     from "views/admin/newsletter/Notifications";
import PartnershipsPage      from "views/admin/partnerships";
import BranchesPage          from "views/admin/branches";
import ApplicationsPage      from "views/admin/applications";
import ProjectsPage from "views/admin/projects";
import Profile from "views/admin/profile";
import Placeholder from "views/admin/placeholder";
import SignIn           from "views/auth/SignIn";
import Register         from "views/auth/Register";
import ForgotPassword   from "views/auth/ForgotPassword";
import ResetPassword    from "views/auth/ResetPassword";
import ChangePassword   from "views/auth/ChangePassword";
import ActivateAccount  from "views/auth/ActivateAccount";
import SetPassword      from "views/auth/SetPassword";
import StaffDashboard        from "views/staff/default";
import BeneficiaryDashboard  from "views/beneficiary/default";
import BeneficiaryRequests   from "views/beneficiary/requests";
import BeneficiaryProfile    from "views/beneficiary/profile";
import BeneficiarySettings   from "views/beneficiary/settings";
import BeneficiaryEvents     from "views/beneficiary/events";
import BeneficiaryProjects   from "views/beneficiary/projects";
import BeneficiaryOpportunities from "views/beneficiary/opportunities";
import Home from "views/public/home";
import About from "views/public/about";
import PublicEvents from "views/public/events";
import Donate from "views/public/donate";
import Contact from "views/public/contact";
import PublicProjectsPage from "views/public/projects";
import RegisterPage from "views/public/register";
import PublicOpportunitiesPage from "views/public/opportunities";
import PublicNewsListPage from "views/public/news";
import PublicBlogsListPage from "views/public/blogs";

// Icon Imports
import {
  MdHome,
  MdFeed,
  MdEvent,
  MdPeople,
  MdFavorite,
  MdCampaign,
  MdPerson,
  MdSettings,
  MdBarChart,
  MdManageAccounts,
  MdAssignment,
  MdBadge,
  MdCategory,
  MdFolderSpecial,
  MdGroups,
  MdMailOutline,
  MdHandshake,
  MdBusiness,
  MdFactCheck,
  MdRateReview,
  MdWork,
  MdArticle,
  MdEmail,
} from "react-icons/md";

const routes = [
  // ── MAIN ────────────────────────────────────────────────────────────────────
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-5 w-5" />,
    component: <MainDashboard />,
    section: "MAIN",
  },
  {
    name: "Events",
    layout: "/admin",
    path: "events",
    icon: <MdEvent className="h-5 w-5" />,
    component: <EventsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Events", path: "events" },
      { name: "New Event",  path: "events/create" },
    ],
  },
  {
    name: "Newsletter",
    layout: "/admin",
    path: "newsletter/subscribers",
    icon: <MdEmail className="h-5 w-5" />,
    component: <SubscribersPage />,
    section: "COMMUNITY",
    children: [
      { name: "Subscribers",   path: "newsletter/subscribers" },
      { name: "Notifications", path: "newsletter/notifications" },
    ],
  },

  // ── COMMUNITY ────────────────────────────────────────────────────────────────
  {
    name: "Projects",
    layout: "/admin",
    path: "projects",
    icon: <MdFolderSpecial className="h-5 w-5" />,
    component: <ProjectsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Projects", path: "projects" },
      { name: "New Project",  path: "projects/create" },
    ],
  },
  {
    name: "Beneficiaries",
    layout: "/admin",
    path: "beneficiaries",
    icon: <MdPeople className="h-5 w-5" />,
    component: <BeneficiariesPage />,
    section: "COMMUNITY",
  },
  {
    name: "Applications",
    layout: "/admin",
    path: "applications",
    icon: <MdFactCheck className="h-5 w-5" />,
    component: <ApplicationsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Applications", path: "applications" },
      { name: "New Application",  path: "applications/create" },
    ],
  },
  {
    name: "Contact Messages",
    layout: "/admin",
    path: "contact-messages",
    icon: <MdMailOutline className="h-5 w-5" />,
    component: <ContactMessagesPage />,
    section: "COMMUNITY",
  },
  {
    name: "Feedback",
    layout: "/admin",
    path: "feedback",
    icon: <MdRateReview className="h-5 w-5" />,
    component: <FeedbackPage />,
    section: "COMMUNITY",
  },
  {
    name: "Opportunities",
    layout: "/admin",
    path: "opportunities",
    icon: <MdWork className="h-5 w-5" />,
    component: <OpportunitiesPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Opportunities", path: "opportunities" },
      { name: "New Opportunity",   path: "opportunities/create" },
    ],
  },
  {
    name: "News",
    layout: "/admin",
    path: "news",
    icon: <MdArticle className="h-5 w-5" />,
    component: <NewsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All News",     path: "news" },
      { name: "New Article",  path: "news/create" },
    ],
  },
  {
    name: "Blogs",
    layout: "/admin",
    path: "blogs",
    icon: <MdFeed className="h-5 w-5" />,
    component: <BlogsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Blogs",  path: "blogs" },
      { name: "New Blog",   path: "blogs/create" },
    ],
  },
  {
    name: "Donations",
    layout: "/admin",
    path: "donations",
    icon: <MdFavorite className="h-5 w-5" />,
    component: <Placeholder pageName="Donations" />,
    section: "COMMUNITY",
    hidden: true,
    children: [
      { name: "All Donations",   path: "donations" },
      { name: "Pending",         path: "donations/pending" },
      { name: "History",         path: "donations/history" },
    ],
  },
  {
    name: "Campaigns",
    layout: "/admin",
    path: "campaigns",
    icon: <MdCampaign className="h-5 w-5" />,
    component: <Placeholder pageName="Campaigns" />,
    section: "COMMUNITY",
    hidden: true,
    children: [
      { name: "All Campaigns",   path: "campaigns" },
      { name: "Create Campaign", path: "campaigns/create" },
      { name: "Archive",         path: "campaigns/archive" },
    ],
  },
  {
    name: "Reports",
    layout: "/admin",
    path: "reports",
    icon: <MdBarChart className="h-5 w-5" />,
    component: <Placeholder pageName="Reports" />,
    section: "COMMUNITY",
    hidden: true,
    children: [
      { name: "Financial Report", path: "reports/financial" },
      { name: "Beneficiary Report", path: "reports/beneficiaries" },
      { name: "Campaign Report",  path: "reports/campaigns" },
    ],
  },

  // ── SYSTEM ───────────────────────────────────────────────────────────────────
  {
    name: "Classifications",
    layout: "/admin",
    path: "classifications",
    icon: <MdGroups className="h-5 w-5" />,
    component: <ClassificationsPage />,
    section: "SYSTEM",
    roles: ["admin"],
    children: [
      { name: "All Classifications", path: "classifications" },
      { name: "Add Classification",  path: "classifications/create" },
    ],
  },
  {
    name: "Categories",
    layout: "/admin",
    path: "categories",
    icon: <MdCategory className="h-5 w-5" />,
    component: <CategoriesPage />,
    section: "SYSTEM",
    roles: ["admin"],
    children: [
      { name: "All Categories", path: "categories" },
      { name: "Add Category",   path: "categories/create" },
    ],
  },
  {
    name: "Partnerships",
    layout: "/admin",
    path: "partnerships",
    icon: <MdHandshake className="h-5 w-5" />,
    component: <PartnershipsPage />,
    section: "SYSTEM",
    children: [
      { name: "All Partnerships", path: "partnerships" },
      { name: "Add Partnership",  path: "partnerships/create" },
      { name: "Inactive Partners", path: "partnerships/inactive" },
    ],
  },
  {
    name: "Branches",
    layout: "/admin",
    path: "branches",
    icon: <MdBusiness className="h-5 w-5" />,
    component: <BranchesPage />,
    section: "SYSTEM",
    children: [
      { name: "All Branches", path: "branches" },
      { name: "Add Branch",   path: "branches/create" },
    ],
  },
  {
    name: "Staff",
    layout: "/admin",
    path: "staff",
    icon: <MdBadge className="h-5 w-5" />,
    component: <StaffPage />,
    section: "SYSTEM",
    roles: ["admin"],
    children: [
      { name: "All Staff", path: "staff" },
      { name: "Add Staff", path: "staff/create" },
    ],
  },
  {
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <MdManageAccounts className="h-5 w-5" />,
    component: <UsersPage />,
    section: "SYSTEM",
    roles: ["admin"],
    children: [
      { name: "All Users", path: "users" },
      { name: "Add User",  path: "users/create" },
    ],
  },

  // ── ACCOUNT ──────────────────────────────────────────────────────────────────
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-5 w-5" />,
    component: <Profile />,
    section: "ACCOUNT",
  },
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-5 w-5" />,
    component: <Placeholder pageName="Settings" />,
    section: "ACCOUNT",
    hidden: true,
  },

  // ── STAFF ────────────────────────────────────────────────────────────────────
  {
    name: "Dashboard",
    layout: "/staff",
    path: "default",
    icon: <MdHome className="h-5 w-5" />,
    component: <StaffDashboard />,
    section: "MAIN",
  },
  {
    name: "Projects",
    layout: "/staff",
    path: "projects",
    icon: <MdFolderSpecial className="h-5 w-5" />,
    component: <ProjectsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Projects", path: "projects" },
      { name: "New Project",  path: "projects/create" },
    ],
  },
  {
    name: "Beneficiaries",
    layout: "/staff",
    path: "beneficiaries",
    icon: <MdPeople className="h-5 w-5" />,
    component: <BeneficiariesPage />,
    section: "COMMUNITY",
  },
  {
    name: "Applications",
    layout: "/staff",
    path: "applications",
    icon: <MdFactCheck className="h-5 w-5" />,
    component: <ApplicationsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Applications", path: "applications" },
      { name: "New Application",  path: "applications/create" },
    ],
  },
  {
    name: "Contact Messages",
    layout: "/staff",
    path: "contact-messages",
    icon: <MdMailOutline className="h-5 w-5" />,
    component: <ContactMessagesPage />,
    section: "COMMUNITY",
  },
  {
    name: "Feedback",
    layout: "/staff",
    path: "feedback",
    icon: <MdRateReview className="h-5 w-5" />,
    component: <FeedbackPage />,
    section: "COMMUNITY",
  },
  {
    name: "Opportunities",
    layout: "/staff",
    path: "opportunities",
    icon: <MdWork className="h-5 w-5" />,
    component: <OpportunitiesPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Opportunities", path: "opportunities" },
      { name: "New Opportunity",   path: "opportunities/create" },
    ],
  },
  {
    name: "News",
    layout: "/staff",
    path: "news",
    icon: <MdArticle className="h-5 w-5" />,
    component: <NewsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All News",    path: "news" },
      { name: "New Article", path: "news/create" },
    ],
  },
  {
    name: "Blogs",
    layout: "/staff",
    path: "blogs",
    icon: <MdFeed className="h-5 w-5" />,
    component: <BlogsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Blogs", path: "blogs" },
      { name: "New Blog",  path: "blogs/create" },
    ],
  },
  {
    name: "Events",
    layout: "/staff",
    path: "events",
    icon: <MdEvent className="h-5 w-5" />,
    component: <EventsPage />,
    section: "COMMUNITY",
    children: [
      { name: "All Events", path: "events" },
      { name: "New Event",  path: "events/create" },
    ],
  },
  {
    name: "Newsletter",
    layout: "/staff",
    path: "newsletter/subscribers",
    icon: <MdEmail className="h-5 w-5" />,
    component: <SubscribersPage />,
    section: "COMMUNITY",
    children: [
      { name: "Subscribers",   path: "newsletter/subscribers" },
      { name: "Notifications", path: "newsletter/notifications" },
    ],
  },
  {
    name: "Categories",
    layout: "/staff",
    path: "categories",
    icon: <MdCategory className="h-5 w-5" />,
    component: <CategoriesPage />,
    section: "SYSTEM",
    children: [
      { name: "All Categories", path: "categories" },
      { name: "Add Category",   path: "categories/create" },
    ],
  },
  {
    name: "Partnerships",
    layout: "/staff",
    path: "partnerships",
    icon: <MdHandshake className="h-5 w-5" />,
    component: <PartnershipsPage />,
    section: "SYSTEM",
    children: [
      { name: "All Partnerships", path: "partnerships" },
      { name: "Add Partnership",  path: "partnerships/create" },
      { name: "Inactive Partners", path: "partnerships/inactive" },
    ],
  },
  {
    name: "Branches",
    layout: "/staff",
    path: "branches",
    icon: <MdBusiness className="h-5 w-5" />,
    component: <BranchesPage />,
    section: "SYSTEM",
    children: [
      { name: "All Branches", path: "branches" },
      { name: "Add Branch",   path: "branches/create" },
    ],
  },
  {
    name: "Profile",
    layout: "/staff",
    path: "profile",
    icon: <MdPerson className="h-5 w-5" />,
    component: <Profile />,
    section: "ACCOUNT",
  },

  // ── BENEFICIARY ──────────────────────────────────────────────────────────────
  {
    name: "Dashboard",
    layout: "/beneficiary",
    path: "default",
    icon: <MdHome className="h-5 w-5" />,
    component: <BeneficiaryDashboard />,
    section: "MAIN",
  },
  {
    name: "My Requests",
    layout: "/beneficiary",
    path: "requests",
    icon: <MdAssignment className="h-5 w-5" />,
    component: <BeneficiaryRequests />,
    section: "MAIN",
  },
  {
    name: "Events",
    layout: "/beneficiary",
    path: "events",
    icon: <MdEvent className="h-5 w-5" />,
    component: <BeneficiaryEvents />,
    section: "MAIN",
  },
  {
    name: "Projects",
    layout: "/beneficiary",
    path: "projects",
    icon: <MdFolderSpecial className="h-5 w-5" />,
    component: <BeneficiaryProjects />,
    section: "MAIN",
  },
  {
    name: "Opportunities",
    layout: "/beneficiary",
    path: "opportunities",
    icon: <MdWork className="h-5 w-5" />,
    component: <BeneficiaryOpportunities />,
    section: "MAIN",
  },
  {
    name: "Profile",
    layout: "/beneficiary",
    path: "profile",
    icon: <MdPerson className="h-5 w-5" />,
    component: <BeneficiaryProfile />,
    section: "ACCOUNT",
  },
  {
    name: "Settings",
    layout: "/beneficiary",
    path: "settings",
    icon: <MdSettings className="h-5 w-5" />,
    component: <BeneficiarySettings />,
    section: "ACCOUNT",
    hidden: true,
  },

  // ── PUBLIC ───────────────────────────────────────────────────────────────────
  { name: "Home",     layout: "/", path: "/",         component: <Home /> },
  { name: "About",    layout: "/", path: "/about",    component: <About /> },
  { name: "Events",   layout: "/", path: "/events",   component: <PublicEvents /> },
  { name: "Projects", layout: "/", path: "/projects", component: <PublicProjectsPage /> },
  { name: "Donate",   layout: "/", path: "/donate",   component: <Donate /> },
  { name: "Contact",  layout: "/", path: "/contact",  component: <Contact /> },
  { name: "Opportunities", layout: "/", path: "/opportunities", component: <PublicOpportunitiesPage /> },
  { name: "News",          layout: "/", path: "/news",          component: <PublicNewsListPage /> },
  { name: "Blogs",         layout: "/", path: "/blogs",         component: <PublicBlogsListPage /> },
  { name: "Apply",    layout: "/", path: "/apply",    component: <RegisterPage /> },

  // ── AUTH (hidden from sidebar) ───────────────────────────────────────────────
  { name: "Sign In",          layout: "/auth", path: "sign-in",         component: <SignIn /> },
  { name: "Register",         layout: "/auth", path: "register",        component: <Register /> },
  { name: "Forgot Password",  layout: "/auth", path: "forgot-password", component: <ForgotPassword /> },
  { name: "Reset Password",   layout: "/auth", path: "reset-password",  component: <ResetPassword /> },
  { name: "Change Password",  layout: "/auth", path: "change-password", component: <ChangePassword /> },
  { name: "Activate Account", layout: "/auth", path: "activate",        component: <ActivateAccount /> },
  { name: "Set Password",     layout: "/auth", path: "set-password",    component: <SetPassword /> },
];

export default routes;
