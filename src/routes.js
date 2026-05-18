import React from "react";

// Page Imports
import MainDashboard from "views/admin/default";
import Profile from "views/admin/profile";
import Placeholder from "views/admin/placeholder";
import SignIn from "views/auth/SignIn";

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
  MdLock,
  MdBarChart,
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
    name: "News & Updates",
    layout: "/admin",
    path: "news",
    icon: <MdFeed className="h-5 w-5" />,
    component: <Placeholder pageName="News & Updates" />,
    section: "MAIN",
  },
  {
    name: "Events",
    layout: "/admin",
    path: "events",
    icon: <MdEvent className="h-5 w-5" />,
    component: <Placeholder pageName="Events" />,
    section: "MAIN",
    children: [
      { name: "All Events",      path: "events" },
      { name: "Create Event",    path: "events/create" },
      { name: "Past Events",     path: "events/archive" },
    ],
  },

  // ── COMMUNITY ────────────────────────────────────────────────────────────────
  {
    name: "Members",
    layout: "/admin",
    path: "members",
    icon: <MdPeople className="h-5 w-5" />,
    component: <Placeholder pageName="Members" />,
    section: "COMMUNITY",
    children: [
      { name: "All Members",         path: "members" },
      { name: "Add Member",          path: "members/add" },
      { name: "Roles & Permissions", path: "members/roles" },
    ],
  },
  {
    name: "Donations",
    layout: "/admin",
    path: "donations",
    icon: <MdFavorite className="h-5 w-5" />,
    component: <Placeholder pageName="Donations" />,
    section: "COMMUNITY",
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
    children: [
      { name: "Financial Report", path: "reports/financial" },
      { name: "Member Report",    path: "reports/members" },
      { name: "Campaign Report",  path: "reports/campaigns" },
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
  },

  // ── AUTH (hidden from sidebar) ───────────────────────────────────────────────
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-5 w-5" />,
    component: <SignIn />,
  },
];

export default routes;
