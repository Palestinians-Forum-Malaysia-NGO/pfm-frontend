import React from "react";
import {
  MdEmail, MdPhone, MdShield, MdCalendarToday,
  MdVerified, MdSecurity, MdUpdate, MdFingerprint,
  MdAccountBalance, MdAttachMoney, MdBusiness, MdWork,
  MdWarning,
} from "react-icons/md";
import { MdPerson } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow    from "components/ui/InfoRow";
import {
  ROLE_LABELS,
  ROLE_BADGE_BORDER as ROLE_BADGE,
  ROLE_AVATAR_GRADIENT as AVATAR_BG,
} from "components/features/users/constants/roles";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const fmtFrequency = (f) => {
  const map = { monthly: "Monthly", weekly: "Weekly", "bi-weekly": "Bi-Weekly", annually: "Annually" };
  return map[f] ?? f ?? "—";
};

const UserProfileCard = ({ user, showId = false }) => {
  if (!user) return null;

  const bi = user.banking_information;
  const fi = user.financial_information;
  const hasBanking  = bi && (bi.bank_name || bi.account_number || bi.account_holder_name);
  const hasFinancial = fi && (fi.job_title || fi.salary || fi.payment_frequency);

  return (
    <>
      {/* ── Banner ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[user.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {user.profile_photo
                ? <img src={user.profile_photo} alt={user.full_name} className="h-full w-full rounded-2xl object-cover" />
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
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              user.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {user.is_active ? "Active" : "Inactive"}
            </span>
            {user.password_reset_required && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                <MdWarning className="h-3.5 w-3.5" />
                Password Reset Required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Account Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Information" subtitle="Profile and access details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"   value={user.email} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"    value={ROLE_LABELS[user.role] ?? user.role} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"   value={user.phone_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joined"  value={fmtDate(user.created_at)} />
          <InfoRow icon={<MdVerified className="h-4 w-4" />}      label="Status"  value={user.is_active ? "Active" : "Inactive"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />}      label="2FA"     value={user.is_2fa_enabled ? (user.is_2fa_verified ? "Enabled & Verified" : "Enabled") : "Disabled"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Updated" value={fmtDate(user.updated_at)} />
          {showId && (
            <InfoRow icon={<MdFingerprint className="h-4 w-4" />} label="User ID" value={user.id} />
          )}
        </div>
      </div>

      {/* ── Employment Details ── */}
      {(user.department || user.job_title || user.branch || user.joining_date) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title="Employment Details" subtitle="Department and position information" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {user.department   && <InfoRow icon={<MdBusiness className="h-4 w-4" />}       label="Department"   value={user.department} />}
            {user.job_title    && <InfoRow icon={<MdWork className="h-4 w-4" />}            label="Job Title"    value={user.job_title} />}
            {user.branch       && <InfoRow icon={<MdBusiness className="h-4 w-4" />}        label="Branch"       value={user.branch} />}
            {user.joining_date && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />}  label="Joining Date" value={fmtDate(user.joining_date)} />}
          </div>
        </div>
      )}

      {/* ── Banking Information ── */}
      {hasBanking && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title="Banking Information" subtitle="Bank account details" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bi.bank_name           && <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label="Bank Name"     value={bi.bank_name} />}
            {bi.account_holder_name && <InfoRow icon={<MdPerson className="h-4 w-4" />}         label="Account Holder" value={bi.account_holder_name} />}
            {bi.account_number      && <InfoRow icon={<MdFingerprint className="h-4 w-4" />}    label="Account No."   value={bi.account_number} />}
          </div>
        </div>
      )}

      {/* ── Financial Information ── */}
      {hasFinancial && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title="Financial Information" subtitle="Salary and payment details" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fi.job_title         && <InfoRow icon={<MdWork className="h-4 w-4" />}          label="Job Title"    value={fi.job_title} />}
            {fi.salary            && <InfoRow icon={<MdAttachMoney className="h-4 w-4" />}   label="Salary"       value={`MYR ${fi.salary}`} />}
            {fi.payment_frequency && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Pay Frequency" value={fmtFrequency(fi.payment_frequency)} />}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileCard;
