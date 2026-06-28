import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdBadge,
  MdEmail, MdPhone, MdShield, MdVerified, MdCalendarToday,
  MdWork, MdDomain, MdAccountBox, MdLocationCity, MdUpdate,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import StaffDeleteModal from "./StaffDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import { useGetStaff, useDeleteStaff } from "components/features/staff/hooks";
import { ROLE_LABELS, ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function StaffDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { staff, execute: fetchStaff, loading, error } = useGetStaff();
  const { execute: deleteStaff, loading: deleteLoading, error: deleteError } = useDeleteStaff();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchStaff(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteStaff(id);
      success("Staff removed", `${staff?.user?.full_name} has been removed.`);
      navigate("/admin/staff");
    } catch (err) {
      toastError("Failed to remove staff", err?.message);
    }
  };

  if (loading) return <Loading text="Loading staff member…" />;
  if (error)   return <AlertBanner message={error} />;
  if (!staff)  return null;

  const u = staff.user ?? {};

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdBadge className="h-5 w-5" />}
        title={u.full_name}
        subtitle="Staff Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Staff" onClick={() => navigate("/admin/staff")} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Staff",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/staff/${id}/edit`) },
                { divider: true },
                { label: "Remove Staff", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[u.role] ?? "from-blue-100 to-blue-50 text-blue-600"}`}>
              {getInitials(u.full_name)}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[u.role] ?? "bg-blue-50 text-blue-600 border-blue-100"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[u.role] ?? u.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{u.full_name}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{u.email}</p>
          {staff.position && (
            <p className="mt-0.5 text-sm font-medium text-slate-600">{staff.position}{staff.department ? ` · ${staff.department}` : ""}</p>
          )}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              u.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {u.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdAccountBox className="h-5 w-5" />} title="Account Information" subtitle="Login credentials and access details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"           value={u.email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"           value={u.phone_number || "—"} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"            value={ROLE_LABELS[u.role] ?? u.role} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Account created" value={fmtDate(u.created_at)} />
        </div>
      </div>

      {/* ── Staff profile ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Staff Profile" subtitle="Employment and organisational details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdBadge className="h-4 w-4" />}         label="Employee ID"  value={staff.employee_id || "—"} />
          <InfoRow icon={<MdDomain className="h-4 w-4" />}        label="Department"   value={staff.department || "—"} />
          <InfoRow icon={<MdWork className="h-4 w-4" />}          label="Position"     value={staff.position || "—"} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />}  label="Branch"       value={staff.branch || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joining Date" value={fmtDate(staff.joining_date)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Last Updated" value={fmtDate(staff.updated_at)} />
        </div>
      </div>

      <StaffDeleteModal
        open={deleteOpen}
        staff={staff}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
