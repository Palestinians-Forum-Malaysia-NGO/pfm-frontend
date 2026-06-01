import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdAdd, MdPeople, MdCheckCircle, MdCancel,
  MdClose, MdOpenInNew, MdEdit, MdDeleteOutline,
  MdManageAccounts, MdShield, MdGroups,
  MdChevronLeft, MdChevronRight,
} from "react-icons/md";
import { FiSliders } from "react-icons/fi";
import { useMembers } from "components/features/members/hooks/useMembers";
import MemberDeleteModal from "components/features/members/components/MemberDeleteModal";
import Button from "components/ui/buttons/Button";
import PrevButton from "components/ui/buttons/PrevButton";
import NextButton from "components/ui/buttons/NextButton";
import PageHeader from "components/ui/PageHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import SearchInput from "components/form/SearchInput";
import Loading from "components/loading/Loading";
import EmptyState from "components/empty/empty";

const TYPE_LABELS = {
  regular:  "Regular",
  student:  "Student",
  honorary: "Honorary",
  lifetime: "Lifetime",
};

const TYPE_BADGE = {
  regular:  "bg-blue-50 text-blue-600",
  student:  "bg-purple-50 text-purple-600",
  honorary: "bg-amber-50 text-amber-600",
  lifetime: "bg-green/10 text-green",
};

const AVATAR_BG = {
  regular:  "bg-blue-50 text-blue-600",
  student:  "bg-purple-50 text-purple-600",
  honorary: "bg-amber-50 text-amber-600",
  lifetime: "bg-green/10 text-green",
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const PAGE_SIZE = 8;

const TYPE_OPTIONS = [
  { value: "all",      label: "All Types" },
  { value: "regular",  label: "Regular" },
  { value: "student",  label: "Student" },
  { value: "honorary", label: "Honorary" },
  { value: "lifetime", label: "Lifetime" },
];

const STATUS_OPTIONS = [
  { value: "all",      label: "All Status" },
  { value: "active",   label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function MembersPage() {
  const navigate = useNavigate();
  const {
    members, loading, error,
    deleteMember, actionLoading,
    openDelete, closeAll, handleDelete,
  } = useMembers();

  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]               = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFiltersCount = [
    search !== "",
    typeFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearch(""); setTypeFilter("all"); setStatusFilter("all");
    setPage(1); setShowMobileFilters(false);
  };

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = search
        ? m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.email.toLowerCase().includes(search.toLowerCase()) ||
          m.ic_number?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchType   = typeFilter   === "all" || m.membership_type === typeFilter;
      const matchStatus = statusFilter === "all" ||
        (statusFilter === "active" ? m.is_active : !m.is_active);
      return matchSearch && matchType && matchStatus;
    });
  }, [members, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (val) => { setSearch(val); setPage(1); };
  const handleTypeChange   = (val) => { setTypeFilter(val); setPage(1); };
  const handleStatusChange = (val) => { setStatusFilter(val); setPage(1); };

  const stats = useMemo(() => ({
    total:    members.length,
    active:   members.filter((m) => m.is_active).length,
    inactive: members.filter((m) => !m.is_active).length,
    lifetime: members.filter((m) => m.membership_type === "lifetime").length,
  }), [members]);

  const statCards = [
    {
      key: "total", label: "Total Members", value: stats.total,
      icon: <MdPeople className="h-5 w-5" />, color: "text-slate-600", bgColor: "bg-slate-100",
      active: typeFilter === "all" && statusFilter === "all",
      onClick: () => { setTypeFilter("all"); setStatusFilter("all"); setPage(1); },
    },
    {
      key: "active", label: "Active", value: stats.active,
      icon: <MdCheckCircle className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: statusFilter === "active",
      onClick: () => { setStatusFilter((s) => s === "active" ? "all" : "active"); setPage(1); },
    },
    {
      key: "inactive", label: "Inactive", value: stats.inactive,
      icon: <MdCancel className="h-5 w-5" />, color: "text-slate-400", bgColor: "bg-slate-100",
      active: statusFilter === "inactive",
      onClick: () => { setStatusFilter((s) => s === "inactive" ? "all" : "inactive"); setPage(1); },
    },
    {
      key: "lifetime", label: "Lifetime", value: stats.lifetime,
      icon: <MdGroups className="h-5 w-5" />, color: "text-green", bgColor: "bg-green/10",
      active: typeFilter === "lifetime",
      onClick: () => { setTypeFilter((t) => t === "lifetime" ? "all" : "lifetime"); setPage(1); },
    },
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl border border-slate-200">

      <PageHeader
        icon={<MdManageAccounts className="h-5 w-5" />}
        title="Members"
        subtitle="Manage PFM community membership"
        actions={
          <Button
            icon={<MdAdd className="h-4 w-4" />}
            text="Add Member"
            onClick={() => navigate("/admin/members/create")}
          />
        }
      />

      {/* ── Stat cards ── */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <button
            key={card.key}
            onClick={card.onClick}
            className={`group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200 ease-in-out enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:scale-[0.98] ${
              card.active
                ? "border-green/30 bg-green/5 shadow-sm"
                : "border-slate-200 bg-white enabled:hover:border-slate-300 enabled:hover:bg-slate-50"
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
        <div className="flex items-center gap-2">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, email or IC..."
            className="flex-1"
          />

          <div className="relative sm:hidden">
            <button
              onClick={() => setShowMobileFilters((s) => !s)}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-200 ease-in-out enabled:hover:-translate-y-px enabled:active:scale-[0.98] ${
                showMobileFilters
                  ? "border-blue-300 bg-blue-50 text-blue-600"
                  : "border-slate-200 bg-slate-50 text-slate-500 enabled:hover:bg-slate-100/50"
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
            <FilterSelect value={typeFilter}   onChange={handleTypeChange}   options={TYPE_OPTIONS}   icon={<MdShield className="h-3.5 w-3.5" />} />
            <FilterSelect value={statusFilter} onChange={handleStatusChange} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} />
            {activeFiltersCount > 0 && (
              <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear" onClick={clearFilters} />
            )}
          </div>
        </div>

        {showMobileFilters && (
          <div className="mt-3 flex flex-col gap-3 sm:hidden">
            <FilterSelect value={typeFilter}   onChange={handleTypeChange}   options={TYPE_OPTIONS}   icon={<MdShield className="h-3.5 w-3.5" />} className="w-full" />
            <FilterSelect value={statusFilter} onChange={handleStatusChange} options={STATUS_OPTIONS} icon={<MdCheckCircle className="h-3.5 w-3.5" />} className="w-full" />
            {activeFiltersCount > 0 && (
              <Button variant="danger" icon={<MdClose className="h-3.5 w-3.5" />} text="Clear filters" onClick={clearFilters} />
            )}
          </div>
        )}
      </div>

      {/* ── Loading / Error ── */}
      {loading && <Loading text="Loading members..." />}
      {error   && <p className="py-6 text-center text-sm text-red-500">{error}</p>}

      {/* ── Table ── */}
      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<MdPeople />}
              title="No members found"
              description={search || typeFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Add the first PFM community member."}
              action={!search && typeFilter === "all" && statusFilter === "all"
                ? { label: "Add Member", onClick: () => navigate("/admin/members/create") }
                : undefined}
            />
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg rounded-b-none border border-b-0 border-slate-200">
                <table className="w-full min-w-[720px] bg-white text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-500 w-10">
                        <input type="checkbox" className="accent-green h-3.5 w-3.5 rounded" />
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdPeople className="h-3.5 w-3.5" />Member</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdShield className="h-3.5 w-3.5" />Type</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><MdCheckCircle className="h-3.5 w-3.5" />Status</span>
                      </th>
                      <th className="px-4 py-3 font-semibold text-slate-500">Phone</th>
                      <th className="px-4 py-3 font-semibold text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginated.map((member) => (
                      <tr
                        key={member.id}
                        onClick={() => navigate(`/admin/members/${member.id}`)}
                        className="bg-white cursor-pointer transition-colors duration-150 ease-in-out enabled:hover:bg-slate-50"
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" className="accent-green h-3.5 w-3.5" />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_BG[member.membership_type]}`}>
                              {getInitials(member.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-slate-900">{member.name}</p>
                              <p className="truncate text-xs text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex max-w-[100px] items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE[member.membership_type]}`}>
                            <span className="truncate">{TYPE_LABELS[member.membership_type]}</span>
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            member.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-green" : "bg-slate-400"}`} />
                            {member.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-slate-500 text-xs">{member.phone}</td>

                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-0.5">
                            <RowIconButton icon={<MdOpenInNew className="h-4 w-4" />} title="View"   onClick={() => navigate(`/admin/members/${member.id}`)} variant="primary" />
                            <RowIconButton icon={<MdEdit className="h-4 w-4" />}      title="Edit"   onClick={() => navigate(`/admin/members/${member.id}/edit`)} />
                            <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title="Delete" onClick={() => openDelete(member)} variant="danger" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-3 rounded-b-xl border border-slate-200 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {filtered.length}
                  </span>
                  <span className="text-xs text-slate-400">
                    results &mdash; page{" "}
                    <span className="font-semibold text-slate-600">{page}</span>
                    {" of "}
                    <span className="font-semibold text-slate-600">{totalPages}</span>
                  </span>
                </div>

                <div className={`flex items-center justify-center gap-1 sm:justify-end ${totalPages <= 1 ? "pointer-events-none opacity-40" : ""}`}>
                  <PrevButton text="Prev" icon={<MdChevronLeft className="h-3.5 w-3.5" />} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} />
                  <div className="flex items-center gap-1.5 px-2">
                    {[0, 1, 2].map((i) => {
                      const pos = page === 1 ? 0 : page === totalPages ? 2 : 1;
                      return (
                        <span key={i} className={`h-1.5 rounded-full transition-all duration-200 ease-in-out ${i === pos ? "w-4 bg-green" : "w-1.5 bg-slate-300"}`} />
                      );
                    })}
                  </div>
                  <NextButton text="Next" icon={<MdChevronRight className="h-3.5 w-3.5" />} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                </div>
              </div>
            </>
          )}
        </>
      )}

      <MemberDeleteModal
        open={!!deleteMember}
        member={deleteMember}
        onClose={closeAll}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
