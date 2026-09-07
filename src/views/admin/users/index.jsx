import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdPeople, MdCheckCircle, MdCancel, MdAdminPanelSettings, MdEdit, MdDeleteOutline, MdOpenInNew, MdManageAccounts, MdClose, MdPerson, MdShield, MdCalendarToday, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FiSliders } from "react-icons/fi";
import { useUsers } from "components/features/users/hooks/useUsers";
import UserDeleteModal from "components/features/users/components/UserDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";

const ROLE_LABELS = {
  admin:           "Admin",
  account_manager: "Account Manager",
};

const ROLE_BADGE = {
  admin:           "bg-green/10 text-green",
  account_manager: "bg-blue-50 text-blue-600",
};

const AVATAR_BG = {
  admin:           "bg-green/15 text-green",
  account_manager: "bg-blue-50 text-blue-600",
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const PAGE_SIZE = 8;

const ROLE_OPTIONS = [
  { value: "all",             label: "All Roles" },
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function UsersPage() {
  const navigate = useNavigate();
  const {
    users, loading, error,
    deleteUser, actionLoading,
    openDelete, closeAll, handleDelete,
  } = useUsers();

  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFiltersCount = [
    search !== "",
    roleFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setRoleFilter("all"); setStatusFilter("all");
    setPage(1); setShowMobileFilters(false);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = search
        ? u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchRole   = roleFilter   === "all" || u.role     === roleFilter;
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "active" ? u.is_active : !u.is_active);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (val) => { setSearch(val); setPage(1); };
  const handleRoleChange   = (val) => { setRoleFilter(val); setPage(1); };
  const handleStatusChange = (val) => { setStatusFilter(val); setPage(1); };

  // Stats computed from the full (unfiltered) list
  const stats = useMemo(() => ({
    total:    users.length,
    active:   users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
    admins:   users.filter((u) => u.role === "admin").length,
  }), [users]);

  const statCards = [
    {
      key:     "total",
      label:   "Total Users",
      value:   stats.total,
      icon:    <MdPeople className="h-5 w-5" />,
      color:   "text-slate-600",
      bgColor: "bg-slate-100",
      active:  roleFilter === "all" && statusFilter === "all",
      onClick: () => { setRoleFilter("all"); setStatusFilter("all"); setPage(1); },
    },
    {
      key:     "active",
      label:   "Active",
      value:   stats.active,
      icon:    <MdCheckCircle className="h-5 w-5" />,
      color:   "text-green",
      bgColor: "bg-green/10",
      active:  statusFilter === "active",
      onClick: () => { setStatusFilter((s) => s === "active" ? "all" : "active"); setPage(1); },
    },
    {
      key:     "inactive",
      label:   "Inactive",
      value:   stats.inactive,
      icon:    <MdCancel className="h-5 w-5" />,
      color:   "text-slate-400",
      bgColor: "bg-slate-100",
      active:  statusFilter === "inactive",
      onClick: () => { setStatusFilter((s) => s === "inactive" ? "all" : "inactive"); setPage(1); },
    },
    {
      key:     "admins",
      label:   "Admins",
      value:   stats.admins,
      icon:    <MdAdminPanelSettings className="h-5 w-5" />,
      color:   "text-blue-600",
      bgColor: "bg-blue-50",
      active:  roleFilter === "admin",
      onClick: () => { setRoleFilter((r) => r === "admin" ? "all" : "admin"); setPage(1); },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl border border-slate-200 ">

      <PageHeader
        icon={<MdManageAccounts className="h-5 w-5" />}
        title="Users"
        subtitle="Manage portal access and roles"
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text="Add User" onClick={() => navigate("/admin/users/create")} />
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 active:scale-[0.97] ${
              card.active
                ? "border-green/30 bg-green/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>
                {card.value}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="mb-4">
        {/* Main row — always visible */}
        <div className="flex items-center gap-2">

          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or email..."
            className="flex-1"
          />

          {/* Mobile toggle */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileFilters((s) => !s)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ${
                showMobileFilters
                  ? "border-blue-300 bg-blue-50 text-blue-600"
                  : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              <FiSliders className="h-4 w-4" />
            </button>
            {activeFiltersCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {/* Desktop dropdowns + clear — hidden on mobile, inline via contents on sm+ */}
          <div className="hidden sm:contents">
            <FilterSelect value={roleFilter}   onChange={handleRoleChange}   options={ROLE_OPTIONS}   />
            <FilterSelect value={statusFilter} onChange={handleStatusChange} options={STATUS_OPTIONS} />
            {activeFiltersCount > 0 && (
              <Button
                variant="danger"
                icon={<MdClose className="h-3.5 w-3.5" />}
                text="Clear"
                onClick={clearFilters}
              />
            )}
          </div>
        </div>

        {/* Mobile expanded filters */}
        {showMobileFilters && (
          <div className="mt-3 flex flex-col gap-3 sm:hidden">
            <FilterSelect value={roleFilter}   onChange={handleRoleChange}   options={ROLE_OPTIONS}   className="w-full" />
            <FilterSelect value={statusFilter} onChange={handleStatusChange} options={STATUS_OPTIONS} className="w-full" />
            {activeFiltersCount > 0 && (
              <Button
                variant="danger"
                icon={<MdClose className="h-3.5 w-3.5" />}
                text="Clear filters"
                onClick={clearFilters}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Loading / Error ── */}
      {loading && <Loading text="Loading users..." />}
      {error   && <p className="py-6 text-center text-sm text-red-500">{error}</p>}

      {/* ── Table ── */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<MdPeople />}
              title="No users found"
              description={search || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Add the first portal user to get started."}
              action={!search && roleFilter === "all" && statusFilter === "all"
                ? { label: "Add User", onClick: () => navigate("/admin/users/create") }
                : undefined}
            />
          ) : (
            <>
              {/* Table wrapper — rounded top, no bottom border */}
              <div className="overflow-x-auto rounded-lg rounded-b-none border border-b-0 border-slate-200">
                <table className="w-full min-w-[680px] bg-white text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-500 w-10">
                        <input type="checkbox" className="accent-green h-3.5 w-3.5 rounded" />
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdPerson className="h-3.5 w-3.5" />User</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdShield className="h-3.5 w-3.5" />Role</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdCheckCircle className="h-3.5 w-3.5" />Status</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdCalendarToday className="h-3.5 w-3.5" />Joined</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginated.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="bg-white hover:bg-slate-50 cursor-pointer transition-colors duration-150"
                      >
                        {/* Checkbox — stop propagation */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="accent-green h-3.5 w-3.5" />
                        </td>

                        {/* User */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_BG[user.role]}`}>
                              {getInitials(user.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-slate-900">{user.name}</p>
                              <p className="truncate text-xs text-slate-400">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex max-w-[120px] items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role]}`}>
                            <span className="truncate">{ROLE_LABELS[user.role]}</span>
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green" : "bg-slate-400"}`} />
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(user.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            <RowIconButton
                              icon={<MdOpenInNew className="h-4 w-4" />}
                              title="View"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                              variant="primary"
                            />
                            <RowIconButton
                              icon={<MdEdit className="h-4 w-4" />}
                              title="Edit"
                              onClick={() => navigate(`/admin/users/${user.id}/edit`)}
                            />
                            <RowIconButton
                              icon={<MdDeleteOutline className="h-4 w-4" />}
                              title="Delete"
                              onClick={() => openDelete(user)}
                              variant="danger"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between rounded-b-xl border border-slate-200 bg-slate-50 px-5 py-3.5">

                {/* Left — result count */}
                <div className="flex items-center gap-2">
                  
                  <span className="text-xs text-slate-400">
                  page {" "}
                    <span className="font-semibold text-slate-600">{page}</span>
                    {" of "}
                    <span className="font-semibold text-slate-600">{totalPages}</span>
                  </span>
                </div>

                {/* Right — navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 pl-2 pr-3 text-xs font-medium text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] disabled:opacity-35 disabled:pointer-events-none"
                  >
                    <MdChevronLeft className="h-3.5 w-3.5" />
                    Prev
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 active:scale-[0.97] ${
                          p === page
                            ? "bg-green text-white shadow-sm shadow-green/30"
                            : "text-slate-500 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 pl-3 pr-2 text-xs font-medium text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97] disabled:opacity-35 disabled:pointer-events-none"
                  >
                    Next
                    <MdChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* ── Modals ── */}
      <UserDeleteModal
        open={!!deleteUser}
        user={deleteUser}
        onClose={closeAll}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
