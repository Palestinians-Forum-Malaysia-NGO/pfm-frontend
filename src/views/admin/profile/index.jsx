import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdPerson, MdEmail, MdPhone, MdShield, MdCalendarToday,
  MdVerified, MdSecurity, MdUpdate, MdFingerprint, MdEdit, MdLock,
} from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import { InputField } from "components/form";
import Loading from "components/loading/Loading";
import { useProfile, useUpdateProfile } from "components/features/profile/hooks";
import {
  ROLE_LABELS,
  ROLE_BADGE_BORDER as ROLE_BADGE,
  ROLE_AVATAR_GRADIENT as AVATAR_BG,
} from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, error, refetch } = useProfile();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({ full_name: "", phone_number: "" });
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name:    profile.full_name    ?? "",
        phone_number: profile.phone_number ?? "",
      });
    }
  }, [profile]);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    if (Object.keys(newErrors).length) { setFormErrors(newErrors); return; }

    try {
      await updateProfile({ full_name: formData.full_name, phone_number: formData.phone_number });
      await refetch();
      success("Profile updated", "Your changes have been saved.");
      setEditMode(false);
      setFormErrors({});
    } catch (err) {
      toastError("Failed to update profile", err?.message);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({ full_name: profile.full_name ?? "", phone_number: profile.phone_number ?? "" });
    }
    setFormErrors({});
    setEditMode(false);
  };

  if (loading) return <Loading text="Loading profile..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title="My Profile"
        subtitle="Your account information and settings"
      />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}
        >
          <div
            className="h-full w-full opacity-40"
            style={{
              backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[profile.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {profile.profile_picture
                ? <img src={profile.profile_picture} alt={profile.full_name} className="h-full w-full rounded-2xl object-cover" />
                : getInitials(profile.full_name)
              }
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[profile.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[profile.role] ?? profile.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{profile.email}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              profile.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${profile.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {profile.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdPerson className="h-5 w-5" />}
          title="Account Information"
          subtitle="Your profile and access details"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"   value={profile.email} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"    value={ROLE_LABELS[profile.role] ?? profile.role} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"   value={profile.phone_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joined"  value={new Date(profile.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })} />
          <InfoRow icon={<MdVerified className="h-4 w-4" />}      label="Status"  value={profile.is_active ? "Active" : "Inactive"} />
          <InfoRow icon={<MdSecurity className="h-4 w-4" />}      label="2FA"     value={profile.is_2fa_enabled ? (profile.is_2fa_verified ? "Enabled & Verified" : "Enabled") : "Disabled"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Updated" value={profile.updated_at ? new Date(profile.updated_at).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—"} />
          <InfoRow icon={<MdFingerprint className="h-4 w-4" />}   label="User ID" value={profile.id} />
        </div>
      </div>

      {/* ── Edit profile ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdEdit className="h-5 w-5" />}
          title="Edit Profile"
          subtitle="Update your name and contact details"
          actions={
            !editMode && (
              <Button
                variant="ghost"
                icon={<MdEdit className="h-4 w-4" />}
                text="Edit"
                onClick={() => setEditMode(true)}
              />
            )
          }
        />

        {editMode ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
              <InputField
                label="Full Name"
                field="full_name"
                placeholder="Your full name"
                formData={formData}
                errors={formErrors}
                updateFormData={updateFormData}
              />
              <InputField
                label="Phone Number"
                field="phone_number"
                placeholder="+60 12 345 6789"
                formData={formData}
                errors={formErrors}
                updateFormData={updateFormData}
              />
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="ghost" text="Cancel" onClick={handleCancel} className="flex-1" />
              <Button type="submit" variant="primary" text="Save Changes" loading={saving} className="flex-1" />
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Full Name"    value={profile.full_name    || "—"} />
            <InfoRow icon={<MdPhone className="h-4 w-4" />}  label="Phone Number" value={profile.phone_number || "—"} />
          </div>
        )}
      </div>

      {/* ── Security ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdLock className="h-5 w-5" />}
          title="Security"
          subtitle="Manage your password and authentication"
        />
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80">
              <MdLock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Password</p>
              <p className="text-xs text-slate-400">Change your account password</p>
            </div>
          </div>
          <Button
            variant="ghost"
            text="Change"
            onClick={() => navigate("/auth/change-password")}
          />
        </div>
      </div>

    </div>
  );
}
