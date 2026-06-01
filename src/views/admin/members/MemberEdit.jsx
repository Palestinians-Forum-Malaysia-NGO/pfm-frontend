import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdVerified } from "react-icons/md";
import { memberService } from "components/features/members/services/memberService";
import { InputField, SelectField, ToggleInput } from "components/form";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";

const TYPE_OPTIONS = [
  { value: "regular",  label: "Regular" },
  { value: "student",  label: "Student" },
  { value: "honorary", label: "Honorary" },
  { value: "lifetime", label: "Lifetime" },
];

const NATIONALITY_OPTIONS = [
  { value: "Malaysian",   label: "Malaysian" },
  { value: "Palestinian", label: "Palestinian" },
  { value: "Other",       label: "Other" },
];

const TYPE_LABELS = { regular: "Regular", student: "Student", honorary: "Honorary", lifetime: "Lifetime" };
const TYPE_BADGE  = {
  regular:  "bg-blue-50 text-blue-600 border-blue-100",
  student:  "bg-purple-50 text-purple-600 border-purple-100",
  honorary: "bg-amber-50 text-amber-600 border-amber-100",
  lifetime: "bg-green/10 text-green border-green/20",
};
const AVATAR_BG = {
  regular:  "from-blue-100 to-blue-50 text-blue-600",
  student:  "from-purple-100 to-purple-50 text-purple-600",
  honorary: "from-amber-100 to-amber-50 text-amber-600",
  lifetime: "from-green/20 to-green/10 text-green",
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

export default function MemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [formData, setFormData]   = useState({
    name: "", email: "", phone: "", ic_number: "",
    membership_type: "regular", nationality: "Malaysian", is_active: true,
  });
  const [errors, setErrors]       = useState({});
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await memberService.getById(id);
        if (!data) { setLoadError("Member not found"); return; }
        setFormData({
          name: data.name, email: data.email, phone: data.phone,
          ic_number: data.ic_number, membership_type: data.membership_type,
          nationality: data.nationality, is_active: data.is_active,
        });
      } catch (err) {
        setLoadError(err.message ?? "Failed to load member");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveError(null);
      setErrors({});
      await memberService.update(id, formData);
      navigate(`/admin/members/${id}`);
    } catch (err) {
      setSaveError(err.message ?? "Failed to update member");
    } finally {
      setSaving(false);
    }
  };

  if (loading)   return <Loading text="Loading member..." />;
  if (loadError) return <AlertBanner message={loadError} />;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Member"
        subtitle={formData.name || "Update member details"}
        actions={
          <Button
            variant="ghost"
            icon={<MdArrowBack className="h-4 w-4" />}
            text="Back to Member"
            onClick={() => navigate(`/admin/members/${id}`)}
          />
        }
      />

      {/* ── Profile preview ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}
        >
          <div className="h-full w-full opacity-40"
            style={{ backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="px-6 pb-5">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[formData.membership_type]}`}>
              {getInitials(formData.name) || "?"}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_BADGE[formData.membership_type]}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {TYPE_LABELS[formData.membership_type]}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{formData.name || <span className="text-slate-300">Full Name</span>}</h2>
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
        <FormHeader title="Edit Details" subtitle="Update member information" />

        <AlertBanner message={saveError} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Full Name"    field="name"  placeholder="Ahmad Faris" formData={formData} errors={errors} updateFormData={updateFormData} />
            <InputField label="Email"        field="email" type="email" placeholder="ahmad@email.com" formData={formData} errors={errors} updateFormData={updateFormData} />
          </div>

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Phone"        field="phone" placeholder="+60123456789" formData={formData} errors={errors} updateFormData={updateFormData} />
            <InputField label="IC / Passport" field="ic_number" placeholder="900101-14-1234" formData={formData} errors={errors} updateFormData={updateFormData} />
          </div>

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label="Membership Type" field="membership_type" options={TYPE_OPTIONS} formData={formData} errors={errors} updateFormData={updateFormData} />
            <SelectField label="Nationality"     field="nationality"     options={NATIONALITY_OPTIONS} formData={formData} errors={errors} updateFormData={updateFormData} />
          </div>

          <ToggleInput label="Active Status" field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />

          <div className="mt-4 flex gap-3">
            <Button variant="ghost" text="Cancel" onClick={() => navigate(`/admin/members/${id}`)} className="flex-1" />
            <Button type="submit" variant="primary" text="Save Changes" loading={saving} className="flex-1" />
          </div>
        </form>
      </div>

    </div>
  );
}
