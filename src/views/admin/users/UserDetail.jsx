import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline,
  MdEmail, MdCalendarToday, MdShield, MdVerified, MdPerson, MdPhone, MdSecurity,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import UserDeleteModal from "components/features/users/components/UserDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import { useGetUser, useDeleteUser } from "components/features/users/hooks";

const ROLE_LABELS = { admin: "Admin", manager: "Manager", account_manager: "Account Manager" };
const ROLE_BADGE  = {
  admin:           "bg-green/10 text-green border-green/20",
  manager:         "bg-blue-50 text-blue-600 border-blue-100",
  account_manager: "bg-blue-50 text-blue-600 border-blue-100",
};
const AVATAR_BG = {
  admin:           "from-green/20 to-green/10 text-green",
  manager:         "from-blue-100 to-blue-50 text-blue-600",
  account_manager: "from-blue-100 to-blue-50 text-blue-600",
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UserDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const { user, execute: fetchUser, loading, error } = useGetUser();
  const { execute: deleteUser, loading: deleteLoading, error: deleteError } = useDeleteUser();
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => { fetchUser(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteUser(id);
      navigate("/admin/users");
    } catch {
      // error shown via deleteError
    }
  };

  if (loading) return <Loading text="Loading user..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!user)   return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title={user.full_name}
        subtitle="User Details"
        actions={
          <>
            <Button
              variant="ghost"
              icon={<MdArrowBack className="h-4 w-4" />}
              text="Users"
              onClick={() => navigate("/admin/users")}
            />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit User",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/users/${id}/edit`) },
                { divider: true },
                { label: "Delete User", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}
        >
          <div className="h-full w-full opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }} />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[user.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {user.profile_picture
                ? <img src={user.profile_picture} alt={user.full_name} className="h-full w-full rounded-2xl object-cover" />
                : getInitials(user.full_name)
              }
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[user.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{user.email}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdPerson className="h-5 w-5" />}
          title="Account Information"
          subtitle="Profile and access details for this user"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"  value={user.email} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"   value={ROLE_LABELS[user.role] ?? user.role} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"  value={user.phone_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joined" value={new Date(user.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })} />
          <InfoRow icon={<MdVerified className="h-4 w-4" />}      label="Status" value={user.is_active ? "Active" : "Inactive"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />}      label="2FA"    value={user.is_2fa_enabled ? (user.is_2fa_verified ? "Enabled & Verified" : "Enabled") : "Disabled"} />
        </div>
      </div>

      {/* ── Modal ── */}
      <UserDeleteModal
        open={deleteOpen}
        user={user}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
