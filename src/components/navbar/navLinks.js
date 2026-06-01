import React from "react";
import {
  MdPeople, MdEvent, MdCalendarToday, MdHistory,
  MdFavorite, MdCampaign, MdVolunteerActivism, MdMail,
} from "react-icons/md";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Events", to: "/events",
    children: [
      { label: "All Events",  to: "/events", desc: "Browse every PFM event",          icon: <MdEvent className="h-4 w-4" />,         bg: "bg-amber-50 text-amber-500" },
      { label: "Upcoming",    to: "/events", desc: "What's happening near you soon",  icon: <MdCalendarToday className="h-4 w-4" />, bg: "bg-green/10 text-green" },
      { label: "Past Events", to: "/events", desc: "Relive our community highlights", icon: <MdHistory className="h-4 w-4" />,       bg: "bg-slate-100 text-slate-500" },
    ],
  },
  {
    label: "Donate", to: "/donate",
    children: [
      { label: "Donate Now",   to: "/donate",    desc: "Every ringgit makes a difference", icon: <MdFavorite className="h-4 w-4" />,         bg: "bg-red-50 text-red-500" },
      { label: "Campaigns",    to: "/campaigns", desc: "Active fundraising campaigns",      icon: <MdCampaign className="h-4 w-4" />,         bg: "bg-green/10 text-green" },
      { label: "Aid Projects", to: "/donate",    desc: "Direct aid to those in need",       icon: <MdVolunteerActivism className="h-4 w-4" />, bg: "bg-blue-50 text-blue-500" },
    ],
  },
  {
    label: "Contact", to: "/contact",
    children: [
      { label: "Get in Touch", to: "/contact", desc: "Send us a message anytime",   icon: <MdMail className="h-4 w-4" />,   bg: "bg-green/10 text-green" },
      { label: "Volunteer",    to: "/contact", desc: "Give your time to the cause", icon: <MdPeople className="h-4 w-4" />, bg: "bg-purple-50 text-purple-500" },
    ],
  },
];

export default navLinks;
