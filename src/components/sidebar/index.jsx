/* eslint-disable */
import { HiX } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { useTranslation } from "react-i18next";
import logo from "assets/branding/LOGO-wbg.png";
import Links from "./components/Links";
import routes from "routes.js";
import useAuth from "components/features/auth/hooks/useAuth";

const Sidebar = ({ open, onClose, layout = "/admin" }) => {
  const { t } = useTranslation();
  const { handleLogout, user } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 flex w-[280px] flex-col bg-white shadow-xl transition-transform duration-200 ease-in-out md:z-50 lg:z-50 xl:z-0 ${
        open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
      }`}
    >
      {/* Close button — mobile only */}
      <button
        className="absolute ltr:right-3 rtl:left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 xl:hidden"
        onClick={onClose}
      >
        <HiX className="h-4 w-4" />
      </button>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-6">
        <img src={logo} alt="PFM" className="h-12 w-12 flex-shrink-0 object-contain" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-navy-700">{t("sidebar.org")}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {t("sidebar.country")}
          </p>
        </div>
      </div>

      {/* ── Top divider ── */}
      <div className="mx-5 h-px bg-gray-100" />

      {/* ── Navigation ── */}
      <div className="flex-1 overflow-y-auto py-5">
        <Links routes={routes} layout={layout} />
      </div>

      {/* ── Bottom divider ── */}
      <div className="mx-5 h-px bg-gray-100" />

      {/* ── User + Logout ── */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
            {user?.full_name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-navy-700">{user?.full_name || "—"}</p>
            <p className="truncate text-[10px] text-gray-400">{user?.email || ""}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-all duration-150 hover:bg-red-50"
        >
          <MdLogout className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-red-500" />
          <span className="text-sm font-medium text-gray-500 transition-colors group-hover:text-red-500">
            {t("sidebar.logout")}
          </span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
