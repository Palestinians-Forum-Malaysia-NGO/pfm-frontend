import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdManageAccounts, MdClose,
  MdPerson,
} from "react-icons/md";
import StorageImage  from "components/ui/StorageImage";
import { useUsers } from "components/features/users/hooks/useUsers";
import UserDeleteModal from "./UserDeleteModal";
import Button        from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FilterSelect  from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput   from "components/form/SearchInput";
import SimpleDataTable from "components/ui/SimpleDataTable";
import { ROLE_AVATAR_BG } from "components/features/users/constants/roles";
import { useToast }  from "components/ui/toast/ToastContext";

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
      success("Admin deleted", `${name} has been removed.`);
    } catch (err) {
      toastError("Failed to delete", err?.message);
    }
  };

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const hasFilters = search !== "" || statusFilter !== "all";

  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  const filtered = useMemo(() => users.filter((u) => {
    const matchSearch = search
      ? (u.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(search.toLowerCase())
      : true;
    const matchStatus = statusFilter === "all" ||
      (statusFilter === "active" ? u.is_active : !u.is_active);
    return matchSearch && matchStatus;
  }), [users, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    users.length,
    active:   users.filter((u) =>  u.is_active).length,
    inactive: users.filter((u) => !u.is_active).length,
  }), [users]);

  const statCards = [
    {
      key: "total", label: "Total Admins", value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
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

  const columns = [
    {
      key: "user",
      label: "Admin",
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
        subtitle="Manage admin accounts"
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text="Add Admin" onClick={() => navigate("/admin/users/create")} />
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {statCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active ? "border-green/30 bg-green/5 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{loading ? "—" : card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search by name or email..." className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear" onClick={clearFilters} />
        )}
      </div>

      {/* ── Table ── */}
      <SimpleDataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle="No admins found"
        emptyDesc={hasFilters ? "Try adjusting your filters." : "Add the first admin user to get started."}
        emptyAction={!hasFilters ? { label: "Add Admin", onClick: () => navigate("/admin/users/create") } : undefined}
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
