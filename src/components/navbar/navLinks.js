import React from "react";
import {
  MdPeople, MdEvent, MdCalendarToday, MdHistory,
  MdFavorite, MdCampaign, MdVolunteerActivism, MdMail,
  MdFolderSpecial, MdCheckCircle, MdFlag,
} from "react-icons/md";

const getNavLinks = (t) => [
  { label: t("nav.home"),    to: "/" },
  { label: t("nav.about"),   to: "/about" },
  {
    label: t("nav.projects"), to: "/projects",
    children: [
      { label: t("nav.all_projects"),    to: "/projects", desc: t("nav.projects_desc"),        icon: <MdFolderSpecial className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: t("nav.active_projects"), to: "/projects", desc: t("nav.active_projects_desc"), icon: <MdCheckCircle className="h-4 w-4" />,   bg: "bg-blue-50 text-blue-500" },
      { label: t("nav.completed"),       to: "/projects", desc: t("nav.completed_desc"),       icon: <MdFlag className="h-4 w-4" />,          bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: t("nav.events"), to: "/events",
    children: [
      { label: t("nav.all_events"),  to: "/events", desc: t("nav.all_events_desc"),  icon: <MdEvent className="h-4 w-4" />,         bg: "bg-amber-50 text-amber-500" },
      { label: t("nav.upcoming"),    to: "/events", desc: t("nav.upcoming_desc"),    icon: <MdCalendarToday className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: t("nav.past_events"), to: "/events", desc: t("nav.past_events_desc"), icon: <MdHistory className="h-4 w-4" />,       bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: t("nav.donate"), to: "/donate",
    children: [
      { label: t("nav.donate_now"),   to: "/donate",    desc: t("nav.donate_now_desc"),   icon: <MdFavorite className="h-4 w-4" />,         bg: "bg-red-50 text-red-500" },
      { label: t("nav.campaigns"),    to: "/campaigns", desc: t("nav.campaigns_desc"),    icon: <MdCampaign className="h-4 w-4" />,         bg: "bg-green/10 text-green" },
      { label: t("nav.aid_projects"), to: "/donate",    desc: t("nav.aid_projects_desc"), icon: <MdVolunteerActivism className="h-4 w-4" />, bg: "bg-blue-50 text-blue-500" },
    ],
  },
  {
    label: t("nav.contact"), to: "/contact",
    children: [
      { label: t("nav.get_in_touch"), to: "/contact", desc: t("nav.get_in_touch_desc"), icon: <MdMail className="h-4 w-4" />,   bg: "bg-green/10 text-green" },
      { label: t("nav.volunteer"),    to: "/contact", desc: t("nav.volunteer_desc"),    icon: <MdPeople className="h-4 w-4" />, bg: "bg-purple-50 text-purple-500" },
    ],
  },
];

export default getNavLinks;
