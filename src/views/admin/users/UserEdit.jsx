import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdVerified, MdEdit } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, PasswordField, SelectField, ToggleInput } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetUser, useUpdateUser } from "components/features/users/hooks";
import { ROLE_VALUES, ROLE_LABELS, ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG, ROLE_OPTIONS } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function UserEdit() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const { user, execute: fetchUser, loading, error: loadError } = useGetUser();
  const { execute: updateUser, loading: saving, error: saveError } = useUpdateUser();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    full_name: "", email: "", password: "", role: ROLE_VALUES.STAFF, is_active: true,
  });
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    fetchUser(id).then((data) => {
      if (data) {
        setFormData({
          full_name: data.full_name ?? "",
          email:     data.email ?? "",
          password:  "",
          role:      data.role ?? ROLE_VALUES.STAFF,
          is_active: data.is_active ?? true,
        });
      }
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const payload = {
        full_name: formData.full_name,
        email:     formData.email,
        role:      formData.role,
        is_active: formData.is_active,
      };
      if (formData.password) payload.password = formData.password;
      await updateUser(id, payload);
      success("User updated", `${formData.full_name} has been updated successfully.`);
      navigate(`/admin/users/${id}`);
    } catch (err) {
      toastError("Failed to update user", err?.message);
    }
  };

  if (loading) return <Loading text="Loading user..." />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit User"
        subtitle={formData.full_name || "Update account details"}
        actions={
          <Button
            variant="ghost"
            icon={<MdArrowBack className="h-4 w-4" />}
            text="Back to User"
            onClick={() => navigate(`/admin/users/${id}`)}
          />
        }
      />

      {/* ── Live preview card ── */}
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

        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[formData.role] ?? "from-slate-100 to-slate-50 text-slate-600"}`}>
              {getInitials(formData.full_name) || "?"}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[formData.role] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[formData.role] ?? formData.role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {formData.full_name || <span className="text-slate-300">Full Name</span>}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">{formData.email || "email@example.com"}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              formData.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${formData.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {formData.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Edit form ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          title="Edit Details"
          subtitle="Update account information and permissions"
        />

        <AlertBanner message={saveError} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Full Name"
              field="full_name"
              placeholder="John Doe"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
            <InputField
              label="Email Address"
              field="email"
              type="email"
              placeholder="john@example.com"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <PasswordField
              label="New Password"
              field="password"
              placeholder="Leave blank to keep current"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
            <SelectField
              label="Role"
              field="role"
              options={ROLE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          </div>

          <ToggleInput
            label="Account Status"
            field="is_active"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />

          <div className="mt-4 flex gap-3">
            <Button
              variant="ghost"
              text="Cancel"
              onClick={() => navigate(`/admin/users/${id}`)}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="primary"
              text="Save Changes"
              loading={saving}
              className="flex-1"
            />
          </div>
        </form>
      </div>

    </div>
  );
}
