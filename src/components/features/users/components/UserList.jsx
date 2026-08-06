import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdAdd, MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdManageAccounts, MdClose,
  MdPerson, MdVerified,
} from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import StorageImage from "components/ui/StorageImage";
import { useUsers } from "components/features/users/hooks/useUsers";
import UserDeleteModal from "./UserDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";
import { ROLE_AVATAR_BG, ROLE_BADGE } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UserList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
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
      success(t("users.toast_deleted"), `${name} ${t("users.toast_has_been_removed")}`);
    } catch (err) {
      toastError(t("users.toast_delete_failed"), err?.message);
    }
  };

  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const STATUS_OPTIONS = [
    { value: "all",      label: t("users.status_all") },
    { value: "active",   label: t("users.status_active") },
    { value: "inactive", label: t("users.status_inactive") },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";

  const clearFilters = () => { setSearch(""); setStatusFilter("all"); };

  // This page manages admin (super administrator) accounts only — staff and
  // beneficiaries have their own dedicated management pages.
  const admins = useMemo(() => users.filter((u) => u.role === "admin"), [users]);

  const filtered = useMemo(() => admins.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q
      || (u.full_name ?? "").toLowerCase().includes(q)
      || (u.full_name_ar ?? "").toLowerCase().includes(q)
      || (u.email ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all"
      || (statusFilter === "active" ? u.is_active : !u.is_active);
    return matchSearch && matchStatus;
  }), [admins, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    admins.length,
    active:   admins.filter((u) =>  u.is_active).length,
    inactive: admins.filter((u) => !u.is_active).length,
  }), [admins]);

  const statCards = [
    {
      key: "total", label: t("users.total_users"), value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all",
      onClick: () => setStatusFilter("all"),
    },
    {
      key: "active", label: t("users.status_active"), value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => setStatusFilter((s) => s === "active" ? "all" : "active"),
    },
    {
      key: "inactive", label: t("users.status_inactive"), value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => setStatusFilter((s) => s === "inactive" ? "all" : "inactive"),
    },
  ];

  const columns = [
    {
      key: "user",
      label: t("users.col_user"),
      icon: <MdPerson className="h-3.5 w-3.5" />,
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl text-xs font-bold ${ROLE_AVATAR_BG[user.role] ?? "bg-slate-100 text-slate-500"}`}>
            {user.profile_photo
              ? <StorageImage fileKey={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" fallback={getInitials(user.full_name)} />
              : getInitials(user.full_name)
            }
          </div>
          <div className="min-w-0 max-w-[220px] flex-1">
            <p className="truncate font-semibold text-slate-900">{user.full_name}</p>
            {user.full_name_ar && (
              <p className="truncate text-xs text-slate-400" dir="rtl">{user.full_name_ar}</p>
            )}
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: t("users.col_role"),
      icon: <MdVerified className="h-3.5 w-3.5" />,
      render: (user) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[user.role] ?? "bg-slate-100 text-slate-500"}`}>
          {t(`users.role_${user.role}`, { defaultValue: user.role ?? "—" })}
        </span>
      ),
    },
    {
      key: "status",
      label: t("users.col_status"),
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (user) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
          {user.is_active ? t("users.status_active") : t("users.status_inactive")}
        </span>
      ),
    },
    {
      key: "actions",
      label: t("users.col_actions"),
      align: "right",
      stopPropagation: true,
      render: (user) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title={t("users.view_user")} onClick={() => navigate(`${base}/users/${user.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title={t("users.edit")}      onClick={() => navigate(`${base}/users/${user.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("users.delete")}   onClick={() => openDelete(user)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdManageAccounts className="h-5 w-5" />}
        title={t("users.title")}
        subtitle={t("users.subtitle")}
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text={t("users.add_user")} onClick={() => navigate(`${base}/users/create`)} />
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {statCards.map((card) => (
          <button key={card.key} onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-start transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder={t("users.search_placeholder")} className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text={t("users.clear")} onClick={clearFilters} />
        )}
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        onRowClick={(user) => navigate(`${base}/users/${user.id}`)}
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle={t("users.no_users")}
        emptyDesc={hasFilters ? t("users.adjust_filters") : t("users.add_first")}
        emptyAction={!hasFilters ? { label: t("users.add_user"), onClick: () => navigate(`${base}/users/create`) } : undefined}
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
