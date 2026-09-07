// @ts-nocheck
import { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import type { User } from "types/auth";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  user?: User | null;
}

const ROLES = [
  { value: "admin",           label: "Admin" },
  { value: "account_manager", label: "Account Manager" },
];

const UserFormModal = ({
  open, onClose, onSubmit, loading, error, fieldErrors, user,
}: UserFormModalProps) => {
  const isEdit = !!user;

  const [form, setForm] = useState({
    name:      "",
    email:     "",
    password:  "",
    role:      "account_manager",
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name:      user.name,
        email:     user.email,
        password:  "",
        role:      user.role,
        is_active: user.is_active,
      });
    } else {
      setForm({ name: "", email: "", password: "", role: "account_manager", is_active: true });
    }
  }, [user, open]);

  if (!open) return null;

  const field = (key: string) => ({
    value: form[key],
    onChange: (e) => setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload: any = { name: form.name, email: form.email, role: form.role, is_active: form.is_active };
    if (form.password) payload.password = form.password;
    await onSubmit(payload);
  };

  const inputCls = (key: string) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-green/50 ${
      fieldErrors[key] ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-slate-900">
            {isEdit ? "Edit User" : "Create User"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Full Name</label>
            <input {...field("name")} required placeholder="John Doe" className={inputCls("name")} />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email</label>
            <input {...field("email")} type="email" required placeholder="john@example.com" className={inputCls("email")} />
            {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Password{" "}
              {isEdit && <span className="font-normal text-slate-400">(leave blank to keep current)</span>}
            </label>
            <input
              {...field("password")}
              type="password"
              placeholder="••••••••"
              required={!isEdit}
              className={inputCls("password")}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Role</label>
            <select {...field("role")} className={inputCls("role")}>
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
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-green py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#006833] active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
