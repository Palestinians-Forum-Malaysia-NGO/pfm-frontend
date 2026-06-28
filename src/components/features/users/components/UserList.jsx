import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdPeople, MdCheckCircle, MdCancel, MdAdminPanelSettings,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdManageAccounts, MdClose,
  MdPerson, MdShield, MdSupervisorAccount, MdGroup,
} from "react-icons/md";
import { FiSliders } from "react-icons/fi";
import StorageImage from "components/ui/StorageImage";
import { useUsers } from "components/features/users/hooks/useUsers";
import UserDeleteModal from "./UserDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import { ROLE_LABELS, ROLE_BADGE, ROLE_AVATAR_BG, ROLE_FILTER_OPTIONS as ROLE_OPTIONS } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function UserList() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const {
    users, loading, error,
    deleteUser, actionLoading,
    openDelete, closeAll, handleDelete: _handleDelete,
  } = useUsers();

  const handleDelete = async () => {
    const name = deleteUser?.full_name;
    try {
      await _handleDelete();
      success("User deleted", `${name} has been removed.`);
    } catch (err) {
      toastError("Failed to delete user", err?.message);
    }
  };

  const [search, setSearch]             = useState("");
  const [roleFilter, setRoleFilter]     = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFiltersCount = [search !== "", roleFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setRoleFilter("all"); setStatusFilter("all");
    setShowMobileFilters(false);
  };

  const filtered = useMemo(() => users.filter((u) => {
    const matchSearch = search
      ? (u.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(search.toLowerCase())
      : true;
    const matchRole   = roleFilter   === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" ? u.is_active : !u.is_active);
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total:    users.length,
    active:   users.filter((u) => u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
    admin:    users.filter((u) => u.role === "admin").length,
    staff:    users.filter((u) => u.role === "staff").length,
    beneficiary: users.filter((u) => u.role === "beneficiary").length,
  }), [users]);

  const statusCards = [
    {
      key: "total", label: "Total Users", value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: roleFilter === "all" && statusFilter === "all",
      onClick: () => { setRoleFilter("all"); setStatusFilter("all"); },
    },
    {
      key: "active", label: "Active", value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "inactive", label: "Inactive", value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const roleCards = [
    { key: "admin",  label: "Admin",  value: stats.admin,  icon: <MdAdminPanelSettings className="h-5 w-5" />, active: roleFilter === "admin",  onClick: () => setRoleFilter((r) => r === "admin"  ? "all" : "admin") },
    { key: "staff",  label: "Staff",  value: stats.staff,  icon: <MdSupervisorAccount  className="h-5 w-5" />, active: roleFilter === "staff",  onClick: () => setRoleFilter((r) => r === "staff"  ? "all" : "staff") },
    { key: "beneficiary", label: "Beneficiary", value: stats.beneficiary, icon: <MdGroup className="h-5 w-5" />, active: roleFilter === "beneficiary", onClick: () => setRoleFilter((r) => r === "beneficiary" ? "all" : "beneficiary") },
  ];

  const columns = [
    {
      key: "user",
      label: "User",
      icon: <MdPerson className="h-3.5 w-3.5" />,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold ${ROLE_AVATAR_BG[user.role] ?? "bg-slate-100 text-slate-500"}`}>
            {user.profile_photo
              ? <StorageImage fileKey={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" fallback={getInitials(user.full_name)} />
              : getInitials(user.full_name)
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{user.full_name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      icon: <MdShield className="h-3.5 w-3.5" />,
      render: (user) => (
        <span className={`inline-flex max-w-[140px] items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role] ?? "bg-slate-100 text-slate-500"}`}>
          <span className="truncate">{ROLE_LABELS[user.role] ?? user.role}</span>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green" : "bg-slate-400"}`} />
          {user.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      stopPropagation: true,
      render: (user) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title="View"   onClick={() => navigate(`/admin/users/${user.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title="Edit"   onClick={() => navigate(`/admin/users/${user.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title="Delete" onClick={() => openDelete(user)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdManageAccounts className="h-5 w-5" />}
        title="Users"
        subtitle="Manage portal access and roles"
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text="Add User" onClick={() => navigate("/admin/users/create")} />
        }
      />

      {/* ── Status cards ── */}
      <div className="mb-3 grid grid-cols-3 gap-3">
        {statusCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Role cards ── */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {roleCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ROLE_AVATAR_BG[card.key] ?? "bg-slate-100 text-slate-500"}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-lg font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search by name or email..." className="flex-1" />

          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileFilters((s) => !s)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
                showMobileFilters ? "border-blue-300 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100/50"
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

          <div className="hidden sm:contents">
            <FilterSelect value={roleFilter}   onChange={setRoleFilter}   options={ROLE_OPTIONS}   icon={<MdShield className="h-3.5 w-3.5" />} />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
            {activeFiltersCount > 0 && (
              <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear" onClick={clearFilters} />
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="mt-3 flex flex-col gap-3 sm:hidden">
            <FilterSelect value={roleFilter}   onChange={setRoleFilter}   options={ROLE_OPTIONS}   icon={<MdShield className="h-3.5 w-3.5" />} className="w-full" />
            <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} className="w-full" />
            {activeFiltersCount > 0 && (
              <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear filters" onClick={clearFilters} />
            )}
          </div>
        )}
      </div>

      {/* ── DataTable ── */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        selectable
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle="No users found"
        emptyDesc={search || roleFilter !== "all" || statusFilter !== "all" ? "Try adjusting your filters." : "Add the first portal user to get started."}
        emptyAction={!search && roleFilter === "all" && statusFilter === "all" ? { label: "Add User", onClick: () => navigate("/admin/users/create") } : undefined}
      />

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
