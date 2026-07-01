import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdPeople, MdCheckCircle, MdCancel,
  MdEdit, MdDeleteOutline, MdOpenInNew, MdClose,
  MdGroups, MdHourglassEmpty, MdFlag, MdLink, MdCheck,
} from "react-icons/md";
import { useBeneficiaryList } from "components/features/beneficiaries/hooks";
import BeneficiaryDeleteModal from "./BeneficiaryDeleteModal";
import {
  ACCOUNT_STATUS_BADGE, ACCOUNT_STATUS_LABELS, ACCOUNT_STATUS_OPTIONS,
} from "components/features/beneficiaries/constants/beneficiary";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import SimpleDataTable from "components/ui/SimpleDataTable";
import StorageImage from "components/ui/StorageImage";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const APPLY_URL = `${window.location.origin}/apply`;

export default function BeneficiaryList() {
  const navigate = useNavigate();
  const base = useLayoutBase();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(APPLY_URL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const {
    beneficiaries, loading, error,
    stats,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    accountFilter, setAccountFilter,
    toDelete,      setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  } = useBeneficiaryList();

  const statCards = [
    {
      key: "total", label: "Total Beneficiaries", value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: statusFilter === "all" && accountFilter === "all",
      onClick: () => { setStatusFilter("all"); setAccountFilter("all"); },
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
      active: accountFilter === "pending",
      onClick: () => setAccountFilter((a) => a === "pending" ? "all" : "pending"),
    },
  ];

  const columns = [
    {
      key: "beneficiary",
      label: "Beneficiary",
      icon: <MdPeople className="h-3.5 w-3.5" />,
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-green/10 text-xs font-bold text-green">
            {b.user?.profile_photo
              ? <StorageImage fileKey={b.user.profile_photo} alt={b.user?.full_name} className="h-full w-full object-cover" fallback={getInitials(b.user?.full_name)} />
              : getInitials(b.user?.full_name)
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">{b.user?.full_name}</p>
            <p className="truncate text-xs text-slate-400">{b.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "account_status",
      label: "Account Status",
      icon: <MdGroups className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ACCOUNT_STATUS_BADGE[b.account_status] ?? "bg-slate-100 text-slate-500"}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {ACCOUNT_STATUS_LABELS[b.account_status] ?? b.account_status ?? "—"}
        </span>
      ),
    },
    {
      key: "classification",
      label: "Classification",
      render: (b) => (
        <span className="truncate text-sm text-slate-700">
          {b.classification?.name || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "country",
      label: "Country",
      icon: <MdFlag className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className="truncate text-sm text-slate-700">
          {b.country_of_origin || <span className="text-slate-300">—</span>}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      icon: <MdCheckCircle className="h-3.5 w-3.5" />,
      render: (b) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          b.user?.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${b.user?.is_active ? "bg-green" : "bg-slate-400"}`} />
          {b.user?.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      stopPropagation: true,
      render: (b) => (
        <div className="flex items-center justify-end gap-0.5">
          <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />}     title="View"   onClick={() => navigate(`${base}/beneficiaries/${b.id}`)}      variant="primary" />
          <RowIconButton icon={<MdEdit className="h-4 w-4" />}          title="Edit"   onClick={() => navigate(`${base}/beneficiaries/${b.id}/edit`)} />
          <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title="Delete" onClick={() => setToDelete(b)} variant="danger" />
        </div>
      ),
    },
  ];

  const hasFilters = search !== "" || statusFilter !== "all" || accountFilter !== "all";

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title="Beneficiaries"
        subtitle="Manage PFM beneficiary profiles"
        actions={
          <button onClick={handleCopyLink}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-200 hover:border-green/40 hover:bg-green/5 hover:text-green active:scale-[0.98]">
            {copied
              ? <><MdCheck className="h-4 w-4 text-green" /> Copied!</>
              : <><MdLink className="h-4 w-4" /> Copy Apply Link</>
            }
          </button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Search by name, email, or passport…" className="flex-1" />
        <FilterSelect value={accountFilter} onChange={setAccountFilter} options={ACCOUNT_STATUS_OPTIONS} icon={<MdGroups className="h-3.5 w-3.5" />} />
        <FilterSelect value={statusFilter}  onChange={setStatusFilter}  options={STATUS_OPTIONS}         icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
        {hasFilters && (
          <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear"
            onClick={() => { setSearch(""); setStatusFilter("all"); setAccountFilter("all"); }} />
        )}
      </div>

      <SimpleDataTable
        columns={columns}
        data={beneficiaries}
        loading={loading}
        error={error}
        onRowClick={(b) => navigate(`${base}/beneficiaries/${b.id}`)}
        pageSize={8}
        emptyIcon={<MdPeople />}
        emptyTitle="No beneficiaries found"
        emptyDesc={hasFilters ? "Try adjusting your filters." : "Add the first PFM beneficiary."}
        emptyAction={!hasFilters ? { label: "Add Beneficiary", onClick: () => navigate(`${base}/beneficiaries/create`) } : undefined}
      />

      <BeneficiaryDeleteModal
        open={!!toDelete}
        beneficiary={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
