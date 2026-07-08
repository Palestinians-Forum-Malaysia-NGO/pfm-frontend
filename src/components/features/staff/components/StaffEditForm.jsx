import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdVerified, MdEdit, MdBadge, MdPerson,
  MdAccountBalance, MdAttachMoney,
} from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, StorageImageField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading     from "components/loading/Loading";
import { useGetStaff, useUpdateStaff } from "components/features/staff/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { ROLE_BADGE_BORDER as ROLE_BADGE, ROLE_AVATAR_GRADIENT as AVATAR_BG } from "components/features/users/constants/roles";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  full_name: [{ required: true }, { maxLength: 255 }],
  email:     [{ required: true }, { email: true }],
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const EMPTY_USER  = { full_name: "", full_name_ar: "", email: "", phone_number: "", is_active: true, profile_photo: null };
const EMPTY_BANK  = { bank_name: "", account_number: "", account_holder_name: "" };
const EMPTY_FIN   = { job_title: "", job_title_ar: "", salary: "", payment_frequency: "" };
const EMPTY_STAFF = { department: "", department_ar: "", position: "", position_ar: "", branch: "", branch_ar: "", joining_date: "" };

export default function StaffEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const base = useLayoutBase();

  const { staff, execute: fetchStaff, loading, error: loadError } = useGetStaff();
  const { execute: updateStaff, loading: saving, error: saveError } = useUpdateStaff();
  const { success, error: toastError } = useToast();

  const [userForm,  setUserForm]  = useState(EMPTY_USER);
  const [bankForm,  setBankForm]  = useState(EMPTY_BANK);
  const [finForm,   setFinForm]   = useState(EMPTY_FIN);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [initial,   setInitial]   = useState(null);
  const [errors,    setErrors]    = useState({});
  const [photoKey,  setPhotoKey]  = useState(null);
  const { url: currentPhotoUrl } = useStorageUrl(photoKey);

  const setU = (f, v) => setUserForm((p)  => ({ ...p, [f]: v }));
  const setB = (f, v) => setBankForm((p)  => ({ ...p, [f]: v }));
  const setF = (f, v) => setFinForm((p)   => ({ ...p, [f]: v }));
  const setS = (f, v) => setStaffForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || (
    JSON.stringify(userForm)  !== JSON.stringify(initial.user)  ||
    JSON.stringify(bankForm)  !== JSON.stringify(initial.bank)  ||
    JSON.stringify(finForm)   !== JSON.stringify(initial.fin)   ||
    JSON.stringify(staffForm) !== JSON.stringify(initial.staff)
  );

  useEffect(() => {
    fetchStaff(id).then((data) => {
      if (!data) return;
      const u  = data.user ?? {};
      const bi = u.banking_information  ?? {};
      const fi = u.financial_information ?? {};

      const userSnap  = {
        full_name:    u.full_name    ?? "",
        full_name_ar: u.full_name_ar ?? "",
        email:        u.email        ?? "",
        phone_number: u.phone_number ?? "",
        is_active:    u.is_active    ?? true,
        profile_photo: u.profile_photo ?? null,
      };
      const bankSnap  = {
        bank_name:           bi.bank_name           ?? "",
        account_number:      bi.account_number      ?? "",
        account_holder_name: bi.account_holder_name ?? "",
      };
      const finSnap   = {
        job_title:         fi.job_title         ?? "",
        job_title_ar:      fi.job_title_ar      ?? "",
        salary:            fi.salary            ?? "",
        payment_frequency: fi.payment_frequency ?? "",
      };
      const staffSnap = {
        department:   data.department   ?? "",
        department_ar: data.department_ar ?? "",
        position:     data.position     ?? "",
        position_ar:  data.position_ar  ?? "",
        branch:       data.branch       ?? "",
        branch_ar:    data.branch_ar    ?? "",
        joining_date: data.joining_date ? data.joining_date.slice(0, 10) : "",
      };

      setUserForm(userSnap);
      setBankForm(bankSnap);
      setFinForm(finSnap);
      setStaffForm(staffSnap);
      setInitial({ user: userSnap, bank: bankSnap, fin: finSnap, staff: staffSnap });
      setPhotoKey(u.profile_photo ?? null);
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
          full_name_ar: userForm.full_name_ar || undefined,
          email:        userForm.email,
          phone_number: userForm.phone_number || undefined,
          is_active:    userForm.is_active,
          profile_photo: userForm.profile_photo || undefined,
          banking_information: {
            bank_name:           bankForm.bank_name           || undefined,
            account_number:      bankForm.account_number      || undefined,
            account_holder_name: bankForm.account_holder_name || undefined,
          },
          financial_information: {
            job_title:         finForm.job_title         || undefined,
            job_title_ar:      finForm.job_title_ar      || undefined,
            salary:            finForm.salary            || undefined,
            payment_frequency: finForm.payment_frequency || undefined,
          },
        },
        department:    staffForm.department    || undefined,
        department_ar: staffForm.department_ar || undefined,
        position:      staffForm.position      || undefined,
        position_ar:   staffForm.position_ar   || undefined,
        branch:        staffForm.branch        || undefined,
        branch_ar:     staffForm.branch_ar     || undefined,
        joining_date:  staffForm.joining_date  || undefined,
      };
      await updateStaff(id, payload);
      success(t("staff.toast_updated"), `${userForm.full_name} ${t("staff.toast_updated_sub")}`);
      navigate(`${base}/staff/${id}`);
    } catch {
      toastError(t("staff.toast_update_failed"));
    }
  };

  if (loading)   return <Loading text={t("staff.loading", { defaultValue: "Loading…" })} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  const role = staff?.user?.role ?? "stuff";

  const PAYMENT_FREQUENCY_OPTIONS = [
    { value: "",           label: "—" },
    { value: "monthly",   label: t("staff.freq_monthly") },
    { value: "weekly",    label: t("staff.freq_weekly") },
    { value: "bi-weekly", label: t("staff.freq_biweekly") },
    { value: "annually",  label: t("staff.freq_annually") },
  ];

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("staff.edit_staff")}
        subtitle={userForm.full_name || t("staff.subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("staff.back")} onClick={() => navigate(`${base}/staff/${id}`)} />
        }
      />

      {/* ── Live preview ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[role] ?? "from-blue-100 to-blue-50 text-blue-600"}`}>
              {currentPhotoUrl ? (
                <img src={currentPhotoUrl} alt={userForm.full_name} className="h-full w-full object-cover" />
              ) : (
                getInitials(userForm.full_name) || "?"
              )}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ROLE_BADGE[role] ?? "bg-blue-50 text-blue-600 border-blue-100"}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {t(`users.role_${role}`, { defaultValue: role })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {userForm.full_name || <span className="text-slate-300">{t("users.full_name_label")}</span>}
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
              {userForm.is_active ? t("staff.is_active") : t("staff.is_inactive")}
            </span>
          </div>
        </div>
      </div>

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Account details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("staff.section_account")} subtitle={t("staff.section_account_sub")} />
          <StorageImageField
            label={t("common.profile_photo")}
            folder="staff/photos"
            currentUrl={currentPhotoUrl}
            onUpload={(key) => { setU("profile_photo", key); setPhotoKey(null); }}
            onRemove={() => { setU("profile_photo", null); setPhotoKey(null); }}
            errors={errors}
            field="profile_photo"
          />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.full_name_label")}    field="full_name"    placeholder="Fatima Ali"             formData={userForm} errors={errors} updateFormData={setU} rules={RULES.full_name} />
            <InputField label={t("staff.full_name_ar_label")} field="full_name_ar" placeholder="فاطمة علي"              required={false} formData={userForm} errors={errors} updateFormData={setU} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("users.email_label")} field="email"        type="email" placeholder="fatima@pfm.org.my" formData={userForm} errors={errors} updateFormData={setU} rules={RULES.email} />
            <InputField label={t("users.phone_label")} field="phone_number" placeholder="+60 19-876 5432" required={false} formData={userForm} errors={errors} updateFormData={setU} />
          </div>
          <ToggleInput label={t("staff.account_active")} field="is_active" formData={userForm} errors={errors} updateFormData={setU} />
        </div>

        {/* ── Employment details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("staff.section_employment")} subtitle={t("staff.section_employment_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_department")}      field="department"    placeholder="Programs"         required={false} formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label={t("staff.department_ar_label")}  field="department_ar" placeholder="البرامج"          required={false} formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_position")}     field="position"    placeholder="Program Manager"  required={false} formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label={t("staff.position_ar_label")} field="position_ar" placeholder="مدير البرامج"     required={false} formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_branch")}     field="branch"    placeholder="Kuala Lumpur HQ" required={false} formData={staffForm} errors={errors} updateFormData={setS} />
            <InputField label={t("staff.branch_ar_label")} field="branch_ar" placeholder="المقر الرئيسي"   required={false} formData={staffForm} errors={errors} updateFormData={setS} />
          </div>
          <InputField label={t("staff.info_joining_date")} field="joining_date" type="date" required={false} formData={staffForm} errors={errors} updateFormData={setS} />
        </div>

        {/* ── Banking Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title={t("staff.section_banking")} subtitle={t("staff.section_banking_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_bank_name")}      field="bank_name"           placeholder="e.g. Maybank"        required={false} formData={bankForm} errors={errors} updateFormData={setB} />
            <InputField label={t("staff.info_account_holder")} field="account_holder_name" placeholder="As per bank records" required={false} formData={bankForm} errors={errors} updateFormData={setB} />
          </div>
          <InputField label={t("staff.info_account_number")} field="account_number" placeholder="e.g. 1234567890" required={false} formData={bankForm} errors={errors} updateFormData={setB} />
        </div>

        {/* ── Financial Information ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAttachMoney className="h-5 w-5" />} title={t("staff.section_financial")} subtitle={t("staff.section_financial_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("staff.info_job_title")}     field="job_title"    placeholder="e.g. Senior Officer" required={false} formData={finForm} errors={errors} updateFormData={setF} />
            <InputField label={t("staff.job_title_ar_label")} field="job_title_ar" placeholder="مثلاً: كبير الموظفين"  required={false} formData={finForm} errors={errors} updateFormData={setF} />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField  label={t("staff.info_salary")}       field="salary"            placeholder="e.g. 3500.00" required={false} formData={finForm} errors={errors} updateFormData={setF} />
            <SelectField label={t("staff.info_pay_frequency")} field="payment_frequency" options={PAYMENT_FREQUENCY_OPTIONS} required={false} formData={finForm} errors={errors} updateFormData={setF} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("staff.cancel")} onClick={() => navigate(`${base}/staff/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("staff.save_changes")}
            loading={saving}
            disabled={!userForm.full_name.trim() || !userForm.email.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
