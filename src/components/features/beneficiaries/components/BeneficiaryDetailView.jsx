import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdPeople,
  MdEmail, MdPhone, MdCalendarToday, MdShield, MdVerified,
  MdPerson, MdFlag, MdLocationCity, MdHome, MdFlight,
  MdFamilyRestroom, MdBadge, MdUpdate, MdClose,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import BeneficiaryDeleteModal from "./BeneficiaryDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import { useGetBeneficiary, useDeleteBeneficiary, useUpdateBeneficiary } from "components/features/beneficiaries/hooks";
import {
  ACCOUNT_STATUS_BADGE, ACCOUNT_STATUS_LABELS, ACCOUNT_STATUS_FORM_OPTIONS,
  GENDER_LABELS, MARITAL_STATUS_LABELS,
} from "components/features/beneficiaries/constants/beneficiary";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function BeneficiaryDetailView() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { beneficiary, execute: fetchBeneficiary, loading, error } = useGetBeneficiary();
  const { execute: deleteBeneficiary, loading: deleteLoading, error: deleteError } = useDeleteBeneficiary();
  const { execute: updateBeneficiary, loading: statusSaving } = useUpdateBeneficiary();
  const { success, error: toastError } = useToast();
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [editingStatus,  setEditingStatus]  = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => { fetchBeneficiary(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusEdit = () => {
    setSelectedStatus(beneficiary.account_status ?? "");
    setEditingStatus(true);
  };

  const handleStatusSave = async () => {
    try {
      await updateBeneficiary(id, { account_status: selectedStatus });
      success("Status updated", `Account status changed to ${ACCOUNT_STATUS_LABELS[selectedStatus]}.`);
      fetchBeneficiary(id);
      setEditingStatus(false);
    } catch (err) {
      toastError("Failed to update status", err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBeneficiary(id);
      success("Beneficiary deleted", `${beneficiary?.user?.full_name} has been removed.`);
      navigate(`${base}/beneficiaries`);
    } catch (err) {
      toastError("Failed to delete beneficiary", err?.message);
    }
  };

  if (loading) return <Loading text="Loading beneficiary…" />;
  if (error)   return <AlertBanner message={error} />;
  if (!beneficiary) return null;

  const u  = beneficiary.user ?? {};
  const fi = beneficiary.family_information ?? {};
  const cd = beneficiary.classification_details ?? {};

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title={u.full_name}
        subtitle="Beneficiary Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Beneficiaries" onClick={() => navigate(`${base}/beneficiaries`)} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Beneficiary",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`${base}/beneficiaries/${id}/edit`) },
                { divider: true },
                { label: "Delete Beneficiary", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}>
          <div className="h-full w-full opacity-40"
            style={{ backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-green/10 text-2xl font-black ring-4 ring-white shadow-md text-green">
              {u.profile_photo
                ? <img src={u.profile_photo} alt={u.full_name} className="h-full w-full object-cover" />
                : getInitials(u.full_name)
              }
            </div>
            <div className="flex items-center gap-1.5">
              {!editingStatus ? (
                <>
                  {beneficiary.account_status && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ACCOUNT_STATUS_BADGE[beneficiary.account_status] ?? "bg-slate-100 text-slate-500"}`}>
                      <MdVerified className="h-3.5 w-3.5" />
                      {ACCOUNT_STATUS_LABELS[beneficiary.account_status] ?? beneficiary.account_status}
                    </span>
                  )}
                  <button onClick={handleStatusEdit}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                    title="Change account status">
                    <MdEdit className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green">
                    {ACCOUNT_STATUS_FORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button onClick={handleStatusSave} disabled={statusSaving}
                    className="flex h-6 items-center rounded-full bg-green/10 px-2.5 text-xs font-semibold text-green transition-colors duration-150 hover:bg-green/20 disabled:opacity-50">
                    {statusSaving ? "Saving…" : "Save"}
                  </button>
                  <button onClick={() => setEditingStatus(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600">
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{u.full_name}</h2>
          {beneficiary.full_name_arabic && (
            <p className="mt-0.5 text-sm font-medium text-slate-500" dir="rtl">{beneficiary.full_name_arabic}</p>
          )}
          <p className="mt-0.5 text-sm text-slate-400">{u.email}</p>
          {cd.name && <p className="mt-1 text-xs font-medium text-green">{cd.name}</p>}
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              u.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${u.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {u.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title="Account Information" subtitle="Login credentials and access details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"        value={u.email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"        value={u.phone_number || "—"} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"         value="Beneficiary" />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Registered"   value={fmtDate(u.created_at)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Last Updated" value={fmtDate(u.updated_at)} />
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Personal Information" subtitle="Identity and personal details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdBadge className="h-4 w-4" />}         label="Passport No."   value={beneficiary.passport_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Date of Birth"  value={fmtDate(beneficiary.date_of_birth)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Gender"         value={GENDER_LABELS[beneficiary.gender] ?? beneficiary.gender ?? "—"} />
          <InfoRow icon={<MdPeople className="h-4 w-4" />}        label="Marital Status" value={MARITAL_STATUS_LABELS[beneficiary.marital_status] ?? beneficiary.marital_status ?? "—"} />
        </div>
        {beneficiary.background && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-medium text-slate-400">Background</p>
            <p className="text-sm text-slate-700 leading-relaxed">{beneficiary.background}</p>
          </div>
        )}
        {beneficiary.id_document && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <MdBadge className="h-5 w-5 shrink-0 text-green" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">ID Document</p>
              <p className="truncate text-sm text-slate-700">{beneficiary.id_document}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Location & Travel ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdFlight className="h-5 w-5" />} title="Location & Travel" subtitle="Country of origin and residence in Malaysia" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdFlag className="h-4 w-4" />}           label="Country of Origin"        value={beneficiary.country_of_origin || "—"} />
          <InfoRow icon={<MdFlight className="h-4 w-4" />}         label="Date Arrived in Malaysia" value={fmtDate(beneficiary.date_arrived_in_malaysia)} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />}   label="Current City"             value={beneficiary.current_city || "—"} />
          <InfoRow icon={<MdHome className="h-4 w-4" />}           label="Address"                  value={beneficiary.address || "—"} />
        </div>
      </div>

      {/* ── Classification ── */}
      {cd.name && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdShield className="h-5 w-5" />} title="Classification" subtitle="Assigned beneficiary category" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Category"    value={cd.name} />
            <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Assigned"    value={fmtDate(cd.assigned_at)} />
            {cd.description && <InfoRow icon={<MdBadge className="h-4 w-4" />}  label="Description" value={cd.description} />}
            {cd.assigned_by && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Assigned By"  value={cd.assigned_by?.full_name || cd.assigned_by?.email} />}
          </div>
        </div>
      )}

      {/* ── Family Information ── */}
      {beneficiary.family_information && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title="Family Information" subtitle="Family details and dependants" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label="Family in Malaysia" value={fi.family_in_malaysia ? "Yes" : "No"} />
            <InfoRow icon={<MdPeople className="h-4 w-4" />}         label="No. of Children"    value={fi.number_of_children ?? "—"} />
            {fi.spouse_name        && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Name"          value={fi.spouse_name} />}
            {fi.spouse_name_arabic && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Name (Arabic)" value={fi.spouse_name_arabic} />}
            {fi.spouse_job         && <InfoRow icon={<MdBadge className="h-4 w-4" />}  label="Spouse Occupation"    value={fi.spouse_job} />}
          </div>
        </div>
      )}

      {/* ── Supporting Documents ── */}
      {beneficiary.supporting_documents?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Supporting Documents" subtitle="Uploaded identity and verification documents" />
          <div className="flex flex-col gap-2">
            {beneficiary.supporting_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                  <p className="text-xs text-slate-400">{doc.document_type}</p>
                </div>
                {doc.document_file && (
                  <a href={doc.document_file} target="_blank" rel="noreferrer" className="text-xs font-medium text-green hover:underline">
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <BeneficiaryDeleteModal
        open={deleteOpen}
        beneficiary={beneficiary}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
