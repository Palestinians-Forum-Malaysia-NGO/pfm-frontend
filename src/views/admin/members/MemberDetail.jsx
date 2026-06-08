import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdPeople,
  MdEmail, MdPhone, MdCalendarToday, MdShield, MdVerified,
  MdPerson, MdFlag, MdLocationCity, MdHome, MdFlight,
  MdAccountBalance, MdFamilyRestroom, MdBadge, MdUpdate, MdClose,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import MemberDeleteModal from "components/features/members/components/MemberDeleteModal";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";
import { useGetMember, useDeleteMember, useUpdateMember } from "components/features/members/hooks";
import {
  MEMBERSHIP_STATUS_BADGE, MEMBERSHIP_STATUS_LABELS, MEMBERSHIP_STATUS_FORM_OPTIONS,
  GENDER_LABELS, MARITAL_STATUS_LABELS,
} from "components/features/members/constants/membership";
import { useToast } from "components/ui/toast/ToastContext";

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function MemberDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { member, execute: fetchMember, loading, error } = useGetMember();
  const { execute: deleteMember, loading: deleteLoading, error: deleteError } = useDeleteMember();
  const { execute: updateMember, loading: statusSaving } = useUpdateMember();
  const { success, error: toastError } = useToast();
  const [deleteOpen,      setDeleteOpen]      = useState(false);
  const [editingStatus,   setEditingStatus]   = useState(false);
  const [selectedStatus,  setSelectedStatus]  = useState("");

  useEffect(() => { fetchMember(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusEdit = () => {
    setSelectedStatus(member.membership_status ?? "");
    setEditingStatus(true);
  };

  const handleStatusSave = async () => {
    try {
      await updateMember(id, { membership_status: selectedStatus });
      success("Status updated", `Membership status changed to ${MEMBERSHIP_STATUS_LABELS[selectedStatus]}.`);
      fetchMember(id);
      setEditingStatus(false);
    } catch (err) {
      toastError("Failed to update status", err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMember(id);
      success("Member deleted", `${member?.user?.full_name} has been removed.`);
      navigate("/admin/members");
    } catch (err) {
      toastError("Failed to delete member", err?.message);
    }
  };

  if (loading) return <Loading text="Loading member…" />;
  if (error)   return <AlertBanner message={error} />;
  if (!member) return null;

  const u  = member.user ?? {};
  const fi = member.family_information ?? {};
  const bi = member.banking_information ?? {};
  const cd = member.classification_details ?? {};

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPeople className="h-5 w-5" />}
        title={u.full_name}
        subtitle="Member Details"
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Members" onClick={() => navigate("/admin/members")} />
            <DropdownButton
              label="Actions"
              items={[
                { label: "Edit Member",   icon: <MdEdit className="h-4 w-4" />,          onClick: () => navigate(`/admin/members/${id}/edit`) },
                { divider: true },
                { label: "Delete Member", icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Profile card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div
          className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #007A3D18 0%, #007A3D08 50%, #e2f5eb 100%)" }}
        >
          <div className="h-full w-full opacity-40"
            style={{ backgroundImage: "radial-gradient(circle, #007A3D22 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-green/10 text-2xl font-black ring-4 ring-white shadow-md text-green">
              {member.profile_photo
                ? <img src={member.profile_photo} alt={u.full_name} className="h-full w-full object-cover" />
                : getInitials(u.full_name)
              }
            </div>
            <div className="flex items-center gap-1.5">
              {!editingStatus ? (
                <>
                  {member.membership_status && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${MEMBERSHIP_STATUS_BADGE[member.membership_status] ?? "bg-slate-100 text-slate-500"}`}>
                      <MdVerified className="h-3.5 w-3.5" />
                      {MEMBERSHIP_STATUS_LABELS[member.membership_status] ?? member.membership_status}
                    </span>
                  )}
                  <button
                    onClick={handleStatusEdit}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                    title="Change membership status"
                  >
                    <MdEdit className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                  >
                    {MEMBERSHIP_STATUS_FORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusSave}
                    disabled={statusSaving}
                    className="flex h-6 items-center rounded-full bg-green/10 px-2.5 text-xs font-semibold text-green transition-colors duration-150 hover:bg-green/20 disabled:opacity-50"
                  >
                    {statusSaving ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingStatus(false)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <MdClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{u.full_name}</h2>
          {member.full_name_arabic && (
            <p className="mt-0.5 text-sm font-medium text-slate-500" dir="rtl">{member.full_name_arabic}</p>
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
          <InfoRow icon={<MdEmail className="h-4 w-4" />}         label="Email"       value={u.email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}         label="Phone"       value={u.phone_number || "—"} />
          <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Role"        value="Member" />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Registered"  value={fmtDate(u.created_at)} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label="Last Updated" value={fmtDate(u.updated_at)} />
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Personal Information" subtitle="Identity and personal details" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdBadge className="h-4 w-4" />}         label="Passport No."    value={member.passport_number || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Date of Birth"   value={fmtDate(member.date_of_birth)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Gender"          value={GENDER_LABELS[member.gender] ?? member.gender ?? "—"} />
          <InfoRow icon={<MdPeople className="h-4 w-4" />}        label="Marital Status"  value={MARITAL_STATUS_LABELS[member.marital_status] ?? member.marital_status ?? "—"} />
        </div>
      </div>

      {/* ── Location & Travel ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdFlight className="h-5 w-5" />} title="Location & Travel" subtitle="Country of origin and residence in Malaysia" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdFlag className="h-4 w-4" />}           label="Country of Origin"       value={member.country_of_origin || "—"} />
          <InfoRow icon={<MdFlight className="h-4 w-4" />}         label="Date Arrived in Malaysia" value={fmtDate(member.date_arrived_in_malaysia)} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />}   label="Current City"            value={member.current_city || "—"} />
          <InfoRow icon={<MdHome className="h-4 w-4" />}           label="Address"                 value={member.address || "—"} />
        </div>
      </div>

      {/* ── Classification ── */}
      {cd.name && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdShield className="h-5 w-5" />} title="Classification" subtitle="Membership category details" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdShield className="h-4 w-4" />}        label="Category"    value={cd.name} />
            <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Assigned"    value={fmtDate(cd.assigned_at)} />
            {cd.description && <InfoRow icon={<MdBadge className="h-4 w-4" />} label="Description" value={cd.description} />}
            {cd.assigned_by && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Assigned By" value={cd.assigned_by?.full_name || cd.assigned_by?.email} />}
          </div>
        </div>
      )}

      {/* ── Family Information ── */}
      {member.family_information && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdFamilyRestroom className="h-5 w-5" />} title="Family Information" subtitle="Family details and dependants" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label="Family in Malaysia"  value={fi.family_in_malaysia ? "Yes" : "No"} />
            <InfoRow icon={<MdPeople className="h-4 w-4" />}         label="No. of Children"     value={fi.number_of_children ?? "—"} />
            {fi.spouse_name        && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Name"           value={fi.spouse_name} />}
            {fi.spouse_name_arabic && <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Name (Arabic)"  value={fi.spouse_name_arabic} />}
            {fi.spouse_job         && <InfoRow icon={<MdBadge className="h-4 w-4" />}  label="Spouse Occupation"     value={fi.spouse_job} />}
          </div>
        </div>
      )}

      {/* ── Banking Information ── */}
      {member.banking_information && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAccountBalance className="h-5 w-5" />} title="Banking Information" subtitle="Bank account for payments and donations" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label="Bank Name"          value={bi.bank_name || "—"} />
            <InfoRow icon={<MdBadge className="h-4 w-4" />}          label="Account Number"     value={bi.account_number || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}         label="Account Holder"     value={bi.account_holder_name || "—"} />
          </div>
        </div>
      )}

      {/* ── Supporting Documents ── */}
      {member.supporting_documents?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title="Supporting Documents" subtitle="Uploaded identity and verification documents" />
          <div className="flex flex-col gap-2">
            {member.supporting_documents.map((doc) => (
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

      <MemberDeleteModal
        open={deleteOpen}
        member={member}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
