import React from "react";
import {
  MdPeople, MdMail, MdFolderSpecial,
  MdCheckCircle, MdFlag, MdEvent, MdUpdate, MdHistory,
  MdArticle, MdFeed,
} from "react-icons/md";

const getNavLinks = (t) => [
  { label: t("nav.home"),    to: "/" },
  { label: t("nav.about"),   to: "/about" },
  {
    label: t("nav.projects"), to: "/projects",
    children: [
      { label: t("nav.all_projects"),    to: "/projects",                 desc: t("nav.projects_desc"),        icon: <MdFolderSpecial className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: t("nav.active_projects"), to: "/projects?status=active",   desc: t("nav.active_projects_desc"), icon: <MdCheckCircle className="h-4 w-4" />,   bg: "bg-blue-50 text-blue-500" },
      { label: t("nav.completed"),       to: "/projects?status=completed", desc: t("nav.completed_desc"),      icon: <MdFlag className="h-4 w-4" />,          bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: t("nav.events"), to: "/events",
    children: [
      { label: t("nav.all_events"),  to: "/events",               desc: t("nav.all_events_desc"),  icon: <MdEvent className="h-4 w-4" />,   bg: "bg-green/10 text-green" },
      { label: t("nav.upcoming"),    to: "/events?when=upcoming", desc: t("nav.upcoming_desc"),    icon: <MdUpdate className="h-4 w-4" />,  bg: "bg-blue-50 text-blue-500" },
      { label: t("nav.past_events"), to: "/events?when=past",     desc: t("nav.past_events_desc"), icon: <MdHistory className="h-4 w-4" />, bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: t("nav.news_blog"), to: "/news",
    children: [
      { label: t("nav.all_news"),  to: "/news",  desc: t("nav.all_news_desc"),  icon: <MdArticle className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: t("nav.all_blogs"), to: "/blogs", desc: t("nav.all_blogs_desc"), icon: <MdFeed className="h-4 w-4" />,    bg: "bg-blue-50 text-blue-500" },
    ],
  },
  { label: t("nav.donate"), to: "/donate" },
  {
    label: t("nav.contact"), to: "/contact",
    children: [
      { label: t("nav.get_in_touch"), to: "/contact", desc: t("nav.get_in_touch_desc"), icon: <MdMail className="h-4 w-4" />,   bg: "bg-green/10 text-green" },
      { label: t("nav.volunteer"),    to: "/opportunities", desc: t("nav.volunteer_desc"),    icon: <MdPeople className="h-4 w-4" />, bg: "bg-purple-50 text-purple-500" },
    ],
  },
];

export default getNavLinks;
