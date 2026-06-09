import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdBadge, MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdWork, MdDomain,
} from "react-icons/md";
import { useStaffList } from "components/features/staff/hooks";
import StaffDeleteModal from "./StaffDeleteModal";
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

export default function StaffList() {
  const navigate = useNavigate();
  const {
    staffs, loading, error,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    toDelete,     setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useStaffList();

  const statCards = [
    {
      key: "total", label: "Total Staff", value: stats.total,
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
      key: "staff",
      label: "Staff Member",
      icon: <MdBadge className="h-3.5 w-3.5" />,
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-xs font-bold text-blue-600">
            {getInitials(s.user?.full_name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{s.user?.full_name}</p>
            <p className="truncate text-xs text-slate-400">{s.employee_id || s.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      icon: <MdDomain className="h-3.5 w-3.5" />,
      render: (s) => <span className="truncate text-sm text-slate-700">{s.department || <span className="text-slate-300">—</span>}</span>,
    },
    {
      key: "position",
      label: "Position",
      icon: <MdWork className="h-3.5 w-3.5" />,
      render: (s) => <span className="truncate text-sm text-slate-700">{s.position || <span className="text-slate-300">—</span>}</span>,
    },
    {
      key: "status",
      label: "Status",
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (s) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          s.user?.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${s.user?.is_active ? "bg-green" : "bg-slate-400"}`} />
          {s.user?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      stopPropagation: true,
      render: (s) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title="View"   onClick={() => navigate(`/admin/staff/${s.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title="Edit"   onClick={() => navigate(`/admin/staff/${s.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title="Remove" onClick={() => setToDelete(s)} variant="danger" />
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all";

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdBadge className="h-5 w-5" />}
        title="Staff"
        subtitle="Manage staff members and their profiles"
        actions={
          <Button icon={<MdAdd className="h-4 w-4" />} text="Add Staff" onClick={() => navigate("/admin/staff/create")} />
        }
      />

      <div className="mb-5 grid grid-cols-3 gap-3">
        {statCards.map((card) => (
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

      <div className="mb-4 flex items-center gap-2">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search by name, email, or employee ID…" className="flex-1" />
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear" onClick={() => { setSearch(""); setStatusFilter("all"); }} />
        )}
      </div>

      <DataTable
        columns={columns}
        data={staffs}
        loading={loading}
        error={error}
        onRowClick={(s) => navigate(`/admin/staff/${s.id}`)}
        selectable
        pageSize={8}
        emptyIcon={<MdBadge />}
        emptyTitle="No staff members found"
        emptyDesc={hasFilters ? "Try adjusting your filters." : "Add the first staff member to get started."}
        emptyAction={!hasFilters ? { label: "Add Staff", onClick: () => navigate("/admin/staff/create") } : undefined}
      />

      <StaffDeleteModal
        open={!!toDelete}
        staff={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
