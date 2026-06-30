import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdVerified, MdEdit, MdBadge, MdPerson,
  MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading     from "components/loading/Loading";
import { useGetStaff, useUpdateStaff } from "components/features/staff/hooks";
import { ROLE_LABELS, ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const PAYMENT_FREQUENCY_OPTIONS = [
  { value: "monthly",   label: "Monthly" },
  { value: "weekly",    label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "annually",  label: "Annually" },
];

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }, { maxLength: 255 }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const EMPTY_USER  = { full_name: "", email: "", phone_number: "", is_active: true };
const EMPTY_BANK  = { bank_name: "", account_number: "", account_holder_name: "" };
const EMPTY_FIN   = { job_title: "", salary: "", payment_frequency: "" };
const EMPTY_STAFF = { department: "", position: "", branch: "", joining_date: "" };

export default function StaffEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { staff, execute: fetchStaff, loading, error: loadError } = useGetStaff();
  const { execute: updateStaff, loading: saving, error: saveError } = useUpdateStaff();
  const { success, error: toastError } = useToast();

  const [userForm,  setUserForm]  = useState(EMPTY_USER);
  const [bankForm,  setBankForm]  = useState(EMPTY_BANK);
  const [finForm,   setFinForm]   = useState(EMPTY_FIN);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [initial, setInitial]     = useState(null);
  const [errors, setErrors]       = useState({});

  const setU = (f, v) => setUserForm((p) => ({ ...p, [f]: v }));
  const setB = (f, v) => setBankForm((p) => ({ ...p, [f]: v }));
  const setF = (f, v) => setFinForm((p)  => ({ ...p, [f]: v }));
  const setS = (f, v) => setStaffForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || (
    userForm.full_name    !== initial.user.full_name    ||
    userForm.email        !== initial.user.email        ||
    userForm.phone_number !== initial.user.phone_number ||
    userForm.is_active    !== initial.user.is_active    ||
    bankForm.bank_name           !== initial.bank.bank_name           ||
    bankForm.account_number      !== initial.bank.account_number      ||
    bankForm.account_holder_name !== initial.bank.account_holder_name ||
    finForm.job_title         !== initial.fin.job_title         ||
    finForm.salary            !== initial.fin.salary            ||
    finForm.payment_frequency !== initial.fin.payment_frequency ||
    staffForm.department   !== initial.staff.department   ||
    staffForm.position     !== initial.staff.position     ||
    staffForm.branch       !== initial.staff.branch       ||
    staffForm.joining_date !== initial.staff.joining_date
  );

  useEffect(() => {
    fetchStaff(id).then((data) => {
      if (!data) return;
      const u  = data.user ?? {};
      const bi = u.banking_information  ?? {};
      const fi = u.financial_information ?? {};

      const userSnap  = { full_name: u.full_name ?? "", email: u.email ?? "", phone_number: u.phone_number ?? "", is_active: u.is_active ?? true };
      const bankSnap  = { bank_name: bi.bank_name ?? "", account_number: bi.account_number ?? "", account_holder_name: bi.account_holder_name ?? "" };
      const finSnap   = { job_title: fi.job_title ?? "", salary: fi.salary ?? "", payment_frequency: fi.payment_frequency ?? "" };
      const staffSnap = { department: data.department ?? "", position: data.position ?? "", branch: data.branch ?? "", joining_date: data.joining_date ? data.joining_date.slice(0, 10) : "" };

      setUserForm(userSnap);
      setBankForm(bankSnap);
      setFinForm(finSnap);
      setStaffForm(staffSnap);
      setInitial({ user: userSnap, bank: bankSnap, fin: finSnap, staff: staffSnap });
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(userForm[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    try {
      const payload = {
        user: {
          full_name:    userForm.full_name,
          email:        userForm.email,
          phone_number: userForm.phone_number || undefined,
          is_active:    userForm.is_active,
          banking_information: {
            bank_name:           bankForm.bank_name           || undefined,
            account_number:      bankForm.account_number      || undefined,
            account_holder_name: bankForm.account_holder_name || undefined,
          },
          financial_information: {
            job_title:         finForm.job_title         || undefined,
            salary:            finForm.salary            || undefined,
            payment_frequency: finForm.payment_frequency || undefined,
          },
        },
        department:   staffForm.department   || undefined,
        position:     staffForm.position     || undefined,
        branch:       staffForm.branch       || undefined,
        joining_date: staffForm.joining_date || undefined,
      };
      await updateStaff(id, payload);
      success("Staff updated", `${userForm.full_name} has been updated successfully.`);
      navigate(`/admin/staff/${id}`);
    } catch (err) {
      toastError("Failed to update staff", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading staff member…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  const role = staff?.user?.role ?? "stuff";

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Staff"
        subtitle={userForm.full_name || "Update staff member details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back" onClick={() => navigate(`/admin/staff/${id}`)} />
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
              {ROLE_LABELS[role] ?? "Staff"}
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

        {/* ── Account details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Details" subtitle="Basic information for this staff member" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Full Name"     field="full_name"    placeholder="Fatima Ali"             formData={userForm} errors={errors} updateFormData={setU} rules={RULES.full_name} />
            <InputField label="Email Address" field="email"        type="email" placeholder="fatima@pfm.org.my" formData={userForm} errors={errors} updateFormData={setU} rules={RULES.email} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Phone Number" field="phone_number" placeholder="+60 19-876 5432" required={false} formData={userForm} errors={errors} updateFormData={setU} />
            <ToggleInput label="Account Active" field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
          </div>
        </div>

        {/* ── Employment details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Employment Details" subtitle="Organisational role and assignment" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Department"   field="department"   placeholder="Programs"         required={false} formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label="Position"     field="position"     placeholder="Program Manager"   required={false} formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Branch"       field="branch"       placeholder="Kuala Lumpur HQ"  required={false} formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label="Joining Date" field="joining_date" type="date"                    required={false} formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
        </div>

        {/* ── Banking Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title="Banking Information" subtitle="Bank account details for salary payments (optional)" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Bank Name"           field="bank_name"           placeholder="e.g. Maybank"         required={false} formData={bankForm} errors={errors} updateFormData={setB} />
            <InputField label="Account Holder Name" field="account_holder_name" placeholder="As per bank records"  required={false} formData={bankForm} errors={errors} updateFormData={setB} />
          </div>
          <InputField   label="Account Number"      field="account_number"      placeholder="e.g. 1234567890"      required={false} formData={bankForm} errors={errors} updateFormData={setB} />
        </div>

        {/* ── Financial Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title="Financial Information" subtitle="Salary and payment details (optional)" />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Job Title" field="job_title" placeholder="e.g. Senior Officer" required={false} formData={finForm} errors={errors} updateFormData={setF} />
            <InputField label="Salary"    field="salary"    placeholder="e.g. 3500.00"        required={false} formData={finForm} errors={errors} updateFormData={setF} />
          </div>
          <SelectField label="Payment Frequency" field="payment_frequency" options={PAYMENT_FREQUENCY_OPTIONS} required={false} formData={finForm} errors={errors} updateFormData={setF} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`/admin/staff/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Save Changes"
            loading={saving}
            disabled={!userForm.full_name.trim() || !userForm.email.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
