/* eslint-disable */
import { HiX } from "react-icons/hi";
import { MdOutlineHandshake } from "react-icons/md";
import Links from "./components/Links";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
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
      <div className="flex items-center gap-3 px-6 pb-5 pt-8">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand shadow-md shadow-brand/30">
          <span className="text-[11px] font-black tracking-tight text-white">PFM</span>
        </div>
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
        <Links routes={routes} />
      </div>

      {/* ── Bottom divider ── */}
      <div className="mx-5 h-px bg-gray-100" />

      {/* ── Palestinian solidarity card ── */}
      <div className="mx-4 my-4">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand to-[#005629] p-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
            <MdOutlineHandshake className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-white">Stand with Palestine</p>
            <p className="text-[10px] text-white/70">Together for a free Palestine 🇵🇸</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
