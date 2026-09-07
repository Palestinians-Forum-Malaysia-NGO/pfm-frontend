/* eslint-disable */
import { HiX } from "react-icons/hi";
import { MdOutlineHandshake } from "react-icons/md";
import logo from "assets/brand/LOGO-wbg.png";
import Links from "./components/Links";
import routes from "routes.js";

const Sidebar = ({ open, onClose, layout = "/admin" }) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white shadow-xl transition-transform duration-200 ease-in-out md:z-50 lg:z-50 xl:z-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button — mobile only */}
      <button
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 xl:hidden"
        onClick={onClose}
      >
        <HiX className="h-4 w-4" />
      </button>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 pb-4 pt-6">
        <img src={logo} alt="PFM" className="h-12 w-12 flex-shrink-0 object-contain" />
        <div className="leading-tight">
          <p className="text-sm font-bold text-navy-700">Palestinians Forum</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Malaysia
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

    </aside>
  );
};

export default Sidebar;
