import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdDeleteOutline, MdEmail, MdCalendarToday, MdShield } from "react-icons/md";
import { userService } from "components/features/users/services/userService";
import UserDeleteModal from "components/features/users/components/UserDeleteModal";
import Loading from "components/loading/Loading";

const ROLE_LABELS = { admin: "Admin", account_manager: "Account Manager" };
const ROLE_BADGE  = { admin: "bg-green/10 text-green", account_manager: "bg-blue-50 text-blue-600" };
const AVATAR_BG   = { admin: "bg-green/15 text-green", account_manager: "bg-blue-50 text-blue-600" };

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [deleteOpen, setDeleteOpen]       = useState(false);
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
  if (error)   return <p className="py-12 text-center text-sm text-red-500">{error}</p>;
  if (!user)   return null;

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Back + Actions header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
        >
          <MdArrowBack className="h-4 w-4" />
          Back to Users
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/users/${id}/edit`)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.97]"
          >
            <MdEdit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-50 active:scale-[0.97]"
          >
            <MdDeleteOutline className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* ── Profile card ── */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${AVATAR_BG[user.role]}`}>
            {getInitials(user.name)}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <h2 className="truncate text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="truncate mt-0.5 text-sm text-slate-400">{user.email}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${ROLE_BADGE[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green" : "bg-slate-400"}`} />
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Details card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
        <div className="px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Account Information</p>
        </div>

        <div className="flex items-center gap-4 px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <MdEmail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-400">Email address</p>
            <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <MdShield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Role</p>
            <p className="text-sm font-medium text-slate-900">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 px-6 py-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <MdCalendarToday className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Joined</p>
            <p className="text-sm font-medium text-slate-900">
              {new Date(user.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="mt-4 rounded-2xl border border-red-200 bg-white p-5">
        <p className="text-sm font-semibold text-red-600 mb-1">Danger Zone</p>
        <p className="text-xs text-slate-400 mb-4">Deleting this user is permanent and cannot be undone.</p>
        <button
          onClick={() => setDeleteOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 active:scale-[0.97]"
        >
          <MdDeleteOutline className="h-4 w-4" />
          Delete User
        </button>
      </div>

      {/* ── Modals ── */}
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
