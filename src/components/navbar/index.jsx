import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { MdNotificationsNone, MdOutlineInfo } from "react-icons/md";
import avatar from "assets/img/avatars/avatar4.png";

const Navbar = ({ onOpenSidenav, brandText }) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6">
      {/* Left — mobile toggle + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidenav}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 xl:hidden"
        >
          <FiAlignJustify className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs text-gray-400">Palestinian Forum Malaysia</p>
          <h1 className="text-base font-bold capitalize text-navy-700">
            {brandText}
          </h1>
        </div>
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Dropdown
          button={
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100">
              <MdNotificationsNone className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pfmRed-500" />
            </button>
          }
          animation="origin-top-right transition-all duration-200 ease-in-out"
          classNames="py-2 top-12 -right-2 w-max"
          children={
            <div className="w-80 rounded-2xl bg-white p-4 shadow-xl shadow-shadow-500">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-navy-700">Notifications</p>
                <button className="text-xs font-medium text-brand-500 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { title: "New member joined PFM", time: "2 min ago" },
                  { title: "Upcoming event: Gaza Solidarity March", time: "1 hr ago" },
                  { title: "Donation goal reached — Thank you!", time: "Yesterday" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-2 hover:bg-gray-50">
                    <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-brand-500" />
                    <div>
                      <p className="text-sm font-medium text-navy-700">{n.title}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* Avatar */}
        <Dropdown
          button={
            <button className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden ring-2 ring-brand-100 transition hover:ring-brand-400">
              <img src={avatar} alt="User" className="h-full w-full object-cover" />
            </button>
          }
          animation="origin-top-right transition-all duration-200 ease-in-out"
          classNames="py-2 top-12 -right-2 w-max"
          children={
            <div className="w-52 rounded-2xl bg-white shadow-xl shadow-shadow-500">
              <div className="flex items-center gap-3 p-4">
                <img src={avatar} alt="User" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold text-navy-700">Admin User</p>
                  <p className="text-xs text-gray-400">PFM Administrator</p>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex flex-col p-3 gap-1">
                <a href=" " className="rounded-lg px-3 py-2 text-sm text-navy-700 transition hover:bg-gray-50">
                  Profile Settings
                </a>
                <a href=" " className="rounded-lg px-3 py-2 text-sm font-medium text-pfmRed-500 transition hover:bg-pfmRed-50">
                  Log Out
                </a>
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
};

export default Navbar;
