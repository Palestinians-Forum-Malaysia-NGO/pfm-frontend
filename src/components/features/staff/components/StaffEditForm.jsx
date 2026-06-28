import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdVerified, MdEdit, MdBadge, MdPerson } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, PasswordField, ToggleInput } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetStaff, useUpdateStaff } from "components/features/staff/hooks";
import { ROLE_LABELS, ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const USER_RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255, message: "Name must be 255 characters or fewer" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
  password:  [{ minLength: 8, message: "At least 8 characters" }],
};

export default function StaffEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { staff, execute: fetchStaff, loading, error: loadError } = useGetStaff();
  const { execute: updateStaff, loading: saving, error: saveError } = useUpdateStaff();
  const { success, error: toastError } = useToast();

  const [userForm, setUserForm]   = useState({ full_name: "", email: "", password: "", phone_number: "", is_active: true });
  const [staffForm, setStaffForm] = useState({ employee_id: "", department: "", position: "", branch: "", joining_date: "" });
  const [initialUser, setInitialUser]   = useState(null);
  const [initialStaff, setInitialStaff] = useState(null);
  const [errors, setErrors] = useState({});

  const setU = (field, value) => setUserForm((p) => ({ ...p, [field]: value }));
  const setS = (field, value) => setStaffForm((p) => ({ ...p, [field]: value }));

  const isDirty = !initialUser || !initialStaff || (
    userForm.full_name    !== initialUser.full_name    ||
    userForm.email        !== initialUser.email        ||
    userForm.phone_number !== initialUser.phone_number ||
    userForm.is_active    !== initialUser.is_active    ||
    userForm.password     !== ""                       ||
    staffForm.employee_id  !== initialStaff.employee_id  ||
    staffForm.department   !== initialStaff.department   ||
    staffForm.position     !== initialStaff.position     ||
    staffForm.branch       !== initialStaff.branch       ||
    staffForm.joining_date !== initialStaff.joining_date
  );

  useEffect(() => {
    fetchStaff(id).then((data) => {
      if (!data) return;
      const u = data.user ?? {};
      const userSnap = {
        full_name:    u.full_name    ?? "",
        email:        u.email        ?? "",
        password:     "",
        phone_number: u.phone_number ?? "",
        is_active:    u.is_active    ?? true,
      };
      const staffSnap = {
        employee_id:  data.employee_id  ?? "",
        department:   data.department   ?? "",
        position:     data.position     ?? "",
        branch:       data.branch       ?? "",
        joining_date: data.joining_date ? data.joining_date.slice(0, 10) : "",
      };
      setUserForm(userSnap);
      setStaffForm(staffSnap);
      setInitialUser(userSnap);
      setInitialStaff(staffSnap);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!userForm.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!userForm.email.trim())     newErrors.email     = "Email is required";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        user: {
          full_name:    userForm.full_name,
          email:        userForm.email,
          phone_number: userForm.phone_number,
          is_active:    userForm.is_active,
        },
        employee_id:  staffForm.employee_id  || undefined,
        department:   staffForm.department   || undefined,
        position:     staffForm.position     || undefined,
        branch:       staffForm.branch       || undefined,
        joining_date: staffForm.joining_date || undefined,
      };
      if (userForm.password) payload.user.password = userForm.password;
      await updateStaff(id, payload);
      success("Staff updated", `${userForm.full_name} has been updated successfully.`);
      navigate(`/admin/staff/${id}`);
    } catch (err) {
      toastError("Failed to update staff", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading staff member…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  const role = staff?.user?.role ?? "staff";

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Staff"
        subtitle={userForm.full_name || "Update staff member details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Staff" onClick={() => navigate(`/admin/staff/${id}`)} />
        }
      />

      {/* ── Live preview ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[role] ?? "from-blue-100 to-blue-50 text-blue-600"}`}>
              {getInitials(userForm.full_name) || "?"}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[role] ?? "bg-blue-50 text-blue-600 border-blue-100"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {ROLE_LABELS[role] ?? role}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {userForm.full_name || <span className="text-slate-300">Full Name</span>}
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">{userForm.email || "email@example.com"}</p>
          {(staffForm.position || staffForm.department) && (
            <p className="mt-0.5 text-sm font-medium text-slate-600">
              {staffForm.position}{staffForm.department ? ` · ${staffForm.department}` : ""}
            </p>
          )}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              userForm.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${userForm.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {userForm.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── User Account ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="User Account" subtitle="Login credentials for this staff member" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField    label="Full Name"     field="full_name"     placeholder="Ahmad Farid"                  formData={userForm} errors={errors} updateFormData={setU} rules={USER_RULES.full_name} />
            <InputField    label="Email Address" field="email"         type="email" placeholder="ahmad@example.com" formData={userForm} errors={errors} updateFormData={setU} rules={USER_RULES.email} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <PasswordField label="New Password"  field="password"      placeholder="Leave blank to keep current"  formData={userForm} errors={errors} updateFormData={setU} rules={USER_RULES.password} />
            <InputField    label="Phone Number"  field="phone_number"  placeholder="+60 12-345 6789"              formData={userForm} errors={errors} updateFormData={setU} />
          </div>
          <ToggleInput label="Account Active" field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
        </div>

        {/* ── Staff Profile ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Staff Profile" subtitle="Employment and organisational details" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Employee ID" field="employee_id"  placeholder="EMP001"        formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label="Department"  field="department"   placeholder="Finance"        formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Position"    field="position"     placeholder="Accountant"     formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label="Branch"      field="branch"       placeholder="Kuala Lumpur"   formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <InputField label="Joining Date"  field="joining_date" type="date"                  formData={staffForm} errors={errors} updateFormData={setS} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`/admin/staff/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Save Changes"
            loading={saving}
            disabled={!userForm.full_name.trim() || !userForm.email.trim() || !isDirty}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
