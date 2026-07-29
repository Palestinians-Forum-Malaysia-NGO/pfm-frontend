import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { MdNotificationsNone } from "react-icons/md";
import { AuthContext } from "components/features/auth/context/AuthContext";
import LanguageSwitcher from "components/navbar/LanguageSwitcher";
import StorageImage from "components/ui/StorageImage";

const ROLE_PROFILE = {
  admin:       "/admin/profile",
  staff:       "/staff/profile",
  member:      "/member/profile",
  beneficiary: "/beneficiary/profile",
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const Navbar = ({ onOpenSidenav, brandText }) => {
  const { t } = useTranslation();
  const { user, handleLogout } = useContext(AuthContext);

  const profilePath = ROLE_PROFILE[user?.role] ?? "/admin/profile";
  const initials    = getInitials(user?.full_name);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white px-4 md:px-6">
      {/* Left — mobile toggle + page title */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onOpenSidenav}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 xl:hidden"
        >
          <FiAlignJustify className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="hidden truncate text-xs text-gray-400 sm:block">{t("hero.badge")}</p>
          <h1 className="truncate text-base font-bold capitalize text-navy-700">{brandText}</h1>
        </div>
      </div>

      {/* Right — language switcher + notifications + avatar */}
      <div className="flex flex-shrink-0 items-center gap-2">
        <LanguageSwitcher />

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
            <div className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-white p-4 shadow-xl shadow-shadow-500">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-bold text-navy-700">{t("navbar.notifications")}</p>
                <button className="text-xs font-medium text-brand-500 hover:underline">{t("navbar.mark_all_read")}</button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { title: t("navbar.notif_new_member"), time: t("navbar.time_2_min_ago") },
                  { title: t("navbar.notif_event"),       time: t("navbar.time_1_hr_ago") },
                  { title: t("navbar.notif_donation"),    time: t("navbar.time_yesterday") },
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
            <button className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden bg-green/10 ring-2 ring-green/20 transition hover:ring-green/50 text-sm font-bold text-green">
              <StorageImage fileKey={user?.profile_photo} alt={user?.full_name} className="h-full w-full object-cover" fallback={initials} />
            </button>
          }
          animation="origin-top-right transition-all duration-200 ease-in-out"
          classNames="py-2 top-12 -right-2 w-max"
          children={
            <div className="w-52 rounded-2xl bg-white shadow-xl shadow-shadow-500">
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/10 text-sm font-bold text-green">
                  <StorageImage fileKey={user?.profile_photo} alt={user?.full_name} className="h-full w-full rounded-full object-cover" fallback={initials} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-navy-700">{user?.full_name || "—"}</p>
                  <p className="truncate text-xs text-gray-400">{user?.email || ""}</p>
                </div>
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex flex-col p-3 gap-1">
                <Link
                  to={profilePath}
                  className="rounded-lg px-3 py-2 text-sm text-navy-700 transition hover:bg-gray-50"
                >
                  {t("navbar.profile_settings")}
                </Link>
                <Link
                  to="/auth/change-password"
                  className="rounded-lg px-3 py-2 text-sm text-navy-700 transition hover:bg-gray-50"
                >
                  {t("navbar.change_password")}
                </Link>
                <div className="my-1 h-px bg-gray-100" />
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-pfmRed-500 transition hover:bg-pfmRed-50"
                >
                  {t("navbar.log_out")}
                </button>
              </div>
            </div>
          }
        />
      </div>
    </header>
  );
};

export default Navbar;
