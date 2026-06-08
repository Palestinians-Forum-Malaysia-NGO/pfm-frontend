import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdGroups, MdHourglassEmpty, MdFlag,
} from "react-icons/md";
import { useMemberList } from "components/features/members/hooks";
import MemberDeleteModal from "components/features/members/components/MemberDeleteModal";
import {
  MEMBERSHIP_STATUS_BADGE, MEMBERSHIP_STATUS_LABELS, MEMBERSHIP_STATUS_OPTIONS,
} from "components/features/members/constants/membership";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import DataTable from "components/ui/DataTable";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function MembersPage() {
  const navigate = useNavigate();
  const {
    members, loading, error,
    stats,
    search,           setSearch,
    statusFilter,     setStatusFilter,
    membershipFilter, setMembershipFilter,
    toDelete,         setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useMemberList();

  const statCards = [
    {
      key: "total", label: "Total Members", value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all" && membershipFilter === "all",
      onClick: () => { setStatusFilter("all"); setMembershipFilter("all"); },
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
    {
      key: "pending", label: "Pending", value: stats.pending,
      icon: <MdHourglassEmpty className="h-5 w-5" />, color: "text-amber-600", bgColor: "bg-amber-50",
      active: membershipFilter === "pending",
      onClick: () => setMembershipFilter((m) => m === "pending" ? "all" : "pending"),
    },
  ];

  const columns = [
    {
      key: "member",
      label: "Member",
      icon: <MdPeople className="h-3.5 w-3.5" />,
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green/10 text-xs font-bold text-green">
            {m.profile_photo
              ? <img src={m.profile_photo} alt={m.user?.full_name} className="h-full w-full object-cover" />
              : getInitials(m.user?.full_name)
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{m.user?.full_name}</p>
            <p className="truncate text-xs text-slate-400">{m.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "membership_status",
      label: "Membership",
      icon: <MdGroups className="h-3.5 w-3.5" />,
      render: (m) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${MEMBERSHIP_STATUS_BADGE[m.membership_status] ?? "bg-slate-100 text-slate-500"}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {MEMBERSHIP_STATUS_LABELS[m.membership_status] ?? m.membership_status ?? "—"}
        </span>
      ),
    },
    {
      key: "classification",
      label: "Classification",
      render: (m) => (
        <span className="truncate text-sm text-slate-700">
          {m.classification?.name || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "country",
      label: "Country",
      icon: <MdFlag className="h-3.5 w-3.5" />,
      render: (m) => (
        <span className="truncate text-sm text-slate-700">
          {m.country_of_origin || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (m) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          m.user?.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${m.user?.is_active ? "bg-green" : "bg-slate-400"}`} />
          {m.user?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      stopPropagation: true,
      render: (m) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title="View"   onClick={() => navigate(`/admin/members/${m.id}`)} variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title="Edit"   onClick={() => navigate(`/admin/members/${m.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title="Delete" onClick={() => setToDelete(m)} variant="danger" />
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || membershipFilter !== "all";

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title="Members"
        subtitle="Manage PFM community membership"
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text="Add Member" onClick={() => navigate("/admin/members/create")} />
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ease-in-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] ${
              card.active
                ? "border-green/30 bg-green/5 shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xl font-bold leading-none ${card.active ? "text-green" : "text-slate-900"}`}>{card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="mb-4 flex items-center gap-2">
        <SearchInput
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder="Search by name, email, or passport…"
          className="flex-1"
        />
        <FilterSelect
          value={membershipFilter}
          onChange={setMembershipFilter}
          options={MEMBERSHIP_STATUS_OPTIONS}
          icon={<MdGroups className="h-3.5 w-3.5" />}
        />
        <FilterSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={STATUS_OPTIONS}
          icon={<MdCheckCircle className="h-3.5 w-3.5" />}
        />
        {hasFilters && (
          <Button
            variant="danger"
            icon={<MdClose className="h-3.5 w-3.5" />}
            text="Clear"
            onClick={() => { setSearch(""); setStatusFilter("all"); setMembershipFilter("all"); }}
          />
        )}
      </div>

      {/* ── DataTable ── */}
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        error={error}
        onRowClick={(m) => navigate(`/admin/members/${m.id}`)}
        selectable
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle="No members found"
        emptyDesc={hasFilters ? "Try adjusting your filters." : "Add the first PFM community member."}
        emptyAction={!hasFilters ? { label: "Add Member", onClick: () => navigate("/admin/members/create") } : undefined}
      />

      <MemberDeleteModal
        open={!!toDelete}
        member={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
