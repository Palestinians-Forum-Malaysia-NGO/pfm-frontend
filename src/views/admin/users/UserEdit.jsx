import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { userService } from "components/features/users/services/userService";
import Loading from "components/loading/Loading";

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const inputCls = (hasError) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-green/50 ${
    hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
  }`;

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "account_manager", is_active: true,
  });
  const [saving, setSaving]           = useState(false);
  const [saveError, setSaveError]     = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await userService.getById(id);
        if (!data) { setLoadError("User not found"); return; }
        setForm({ name: data.name, email: data.email, password: "", role: data.role, is_active: data.is_active });
      } catch (err) {
        setLoadError(err.message ?? "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveError(null);
      setFieldErrors({});
      const payload = { name: form.name, email: form.email, role: form.role, is_active: form.is_active };
      if (form.password) payload.password = form.password;
      await userService.update(id, payload);
      navigate(`/admin/users/${id}`);
    } catch (err) {
      setSaveError(err.message ?? "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading)   return <Loading text="Loading user..." />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="max-w-2xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/admin/users/${id}`)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-slate-300 hover:text-slate-900"
          >
            <MdArrowBack className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-900">Edit User</h1>
            <p className="truncate mt-0.5 text-xs text-slate-400">Update account details and permissions</p>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        {saveError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {saveError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name</label>
            <input
              value={form.name}
              onChange={set("name")}
              required
              placeholder="John Doe"
              className={inputCls(!!fieldErrors.name)}
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email</label>
            <input
              value={form.email}
              onChange={set("email")}
              type="email"
              required
              placeholder="john@example.com"
              className={inputCls(!!fieldErrors.email)}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Password{" "}
              <span className="font-normal text-slate-400">(leave blank to keep current)</span>
            </label>
            <input
              value={form.password}
              onChange={set("password")}
              type="password"
              placeholder="••••••••"
              className={inputCls(false)}
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Role</label>
            <select value={form.role} onChange={set("role")} className={inputCls(!!fieldErrors.role)}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            {fieldErrors.role && <p className="mt-1 text-xs text-red-500">{fieldErrors.role}</p>}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">Active</span>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
              className={`relative h-5 w-10 rounded-full transition-colors duration-200 ${form.is_active ? "bg-green" : "bg-slate-300"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                  form.is_active ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => navigate(`/admin/users/${id}`)}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-green py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#006833] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
