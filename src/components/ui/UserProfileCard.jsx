import React from "react";
import { useTranslation } from "react-i18next";
import {
  MdEmail, MdPhone, MdShield, MdCalendarToday,
  MdVerified, MdSecurity, MdUpdate, MdFingerprint,
  MdAccountBalance, MdAttachMoney, MdBusiness, MdWork,
  MdWarning,
} from "react-icons/md";
import { MdPerson } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow    from "components/ui/InfoRow";
import StorageImage from "components/ui/StorageImage";
import {
  ROLE_BADGE_BORDER as ROLE_BADGE,
  ROLE_AVATAR_GRADIENT as AVATAR_BG,
} from "components/features/users/constants/roles";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const UserProfileCard = ({ user }) => {
  const { t } = useTranslation();

  const ROLE_LABELS = {
    admin: t("users.role_admin"),
    staff: t("users.role_staff"),
    beneficiary: t("users.role_beneficiary"),
  };
  const fmtFrequency = (f) => {
    const map = {
      monthly: t("users.freq_monthly"), weekly: t("users.freq_weekly"),
      "bi-weekly": t("users.freq_biweekly"), annually: t("users.freq_annually"),
    };
    return map[f] ?? f ?? "—";
  };

  if (!user) return null;

  // Self-service GET /accounts/me/ nests these under profile.user.* instead of
  // returning them at the top level (unlike /accounts/users/{id} or /staff/{id}).
  // For the admin role this endpoint omits is_active/created_at/updated_at entirely —
  // treat them as "unknown" rather than defaulting to a false/blank value that reads
  // as a real (and wrong) status.
  const nestedUser = user.profile?.user;
  const isActive      = user.is_active       ?? nestedUser?.is_active;
  const createdAt     = user.created_at      ?? nestedUser?.created_at;
  const updatedAt      = user.updated_at      ?? nestedUser?.updated_at;
  const is2faVerified = user.is_2fa_verified ?? nestedUser?.is_2fa_verified;
  const statusKnown = isActive !== undefined;

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
            <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[user.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {user.profile_photo
                ? <StorageImage fileKey={user.profile_photo} alt={user.full_name} className="h-full w-full object-cover" fallback={getInitials(user.full_name)} />
                : getInitials(user.full_name)
              }
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[user.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[user.role] ?? user.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
          {user.full_name_ar && (
            <p className="mt-0.5 text-sm text-slate-400" dir="rtl">{user.full_name_ar}</p>
          )}
          <p className="mt-0.5 text-sm text-slate-400">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusKnown && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isActive ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {isActive ? t("users.status_active") : t("users.status_inactive")}
              </span>
            )}
            {user.password_reset_required && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                <MdWarning className="h-3.5 w-3.5" />
                {t("beneficiaries.password_reset")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Account Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("users.account_info_title")} subtitle={t("users.account_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label={t("users.info_email")}   value={user.email} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label={t("users.role")}    value={ROLE_LABELS[user.role] ?? user.role} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label={t("users.info_phone")}   value={user.phone_number || "—"} />
          {createdAt && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("users.info_joined")}  value={fmtDate(createdAt)} />}
          {statusKnown && <InfoRow icon={<MdVerified className="h-4 w-4" />}      label={t("users.info_status")}  value={isActive ? t("users.status_active") : t("users.status_inactive")} />}
          <InfoRow icon={<MdSecurity className="h-4 w-4" />}      label={t("users.info_2fa")}     value={user.is_2fa_enabled ? (is2faVerified ? t("users.info_2fa_enabled_verified") : t("common.enabled")) : t("common.disabled")} />
          {updatedAt && <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("users.info_updated")} value={fmtDate(updatedAt)} />}
        </div>
      </div>

      {/* ── Employment Details ── */}
      {(user.department || user.job_title || user.branch || user.joining_date) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("users.employment_details")} subtitle={t("users.info_employment_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {user.department   && <InfoRow icon={<MdBusiness className="h-4 w-4" />}       label={t("users.department")}   value={user.department} />}
            {user.job_title    && <InfoRow icon={<MdWork className="h-4 w-4" />}            label={t("users.job_title")}    value={user.job_title} />}
            {user.branch       && <InfoRow icon={<MdBusiness className="h-4 w-4" />}        label={t("users.branch")}       value={user.branch} />}
            {user.joining_date && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />}  label={t("users.joining_date")} value={fmtDate(user.joining_date)} />}
          </div>
        </div>
      )}

      {/* ── Banking Information ── */}
      {hasBanking && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("users.banking_info")} subtitle={t("users.info_banking_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {bi.bank_name           && <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label={t("users.bank_name")}     value={bi.bank_name} />}
            {bi.account_holder_name && <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("users.info_account_holder")} value={bi.account_holder_name} />}
            {bi.account_number      && <InfoRow icon={<MdFingerprint className="h-4 w-4" />}    label={t("users.info_account_no")}   value={bi.account_number} />}
          </div>
        </div>
      )}

      {/* ── Financial Information ── */}
      {hasFinancial && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("users.financial_info")} subtitle={t("users.info_financial_sub")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fi.job_title         && <InfoRow icon={<MdWork className="h-4 w-4" />}          label={t("users.job_title")}    value={fi.job_title} />}
            {fi.salary            && <InfoRow icon={<MdAttachMoney className="h-4 w-4" />}   label={t("users.salary")}       value={`MYR ${fi.salary}`} />}
            {fi.payment_frequency && <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("users.info_pay_frequency")} value={fmtFrequency(fi.payment_frequency)} />}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfileCard;
