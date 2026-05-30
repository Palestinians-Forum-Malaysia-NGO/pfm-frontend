import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline,
  MdEmail, MdCalendarToday, MdShield, MdVerified, MdPerson,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import { userService } from "components/features/users/services/userService";
import UserDeleteModal from "components/features/users/components/UserDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";

const ROLE_LABELS = { admin: "Admin", account_manager: "Account Manager" };
const ROLE_BADGE  = { admin: "bg-green/10 text-green border-green/20", account_manager: "bg-blue-50 text-blue-600 border-blue-100" };
const AVATAR_BG   = { admin: "from-green/20 to-green/10 text-green", account_manager: "from-blue-100 to-blue-50 text-blue-600" };

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();


export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await userService.getById(id);
        if (!data) { setError("User not found"); return; }
        setUser(data);
      } catch (err) {
        setError(err.message ?? "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await userService.remove(id);
      navigate("/admin/users");
    } catch (err) {
      setError(err.message ?? "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading text="Loading user..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!user)   return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title={user.name}
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

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Cover */}
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

        {/* Avatar + identity */}
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[user.role]}`}>
              {getInitials(user.name)}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[user.role]}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[user.role]}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"  value={user.email} />
        <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"   value={ROLE_LABELS[user.role]} />
        <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joined" value={new Date(user.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })} />
        <InfoRow icon={<MdVerified className="h-4 w-4" />}      label="Status" value={user.is_active ? "Active" : "Inactive"} />
      </div>


      {/* ── Modal ── */}
      <UserDeleteModal
        open={deleteOpen}
        user={user}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
