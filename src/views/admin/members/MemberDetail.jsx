import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack, MdEdit, MdDeleteOutline,
  MdEmail, MdPhone, MdCalendarToday, MdShield,
  MdVerified, MdPerson, MdFlag,
} from "react-icons/md";
import { memberService } from "components/features/members/services/memberService";
import MemberDeleteModal from "components/features/members/components/MemberDeleteModal";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading from "components/loading/Loading";

const TYPE_LABELS = {
  regular:  "Regular",
  student:  "Student",
  honorary: "Honorary",
  lifetime: "Lifetime",
};

const TYPE_BADGE = {
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

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await memberService.getById(id);
        if (!data) { setError("Member not found"); return; }
        setMember(data);
      } catch (err) {
        setError(err.message ?? "Failed to load member");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await memberService.remove(id);
      navigate("/admin/members");
    } catch (err) {
      setError(err.message ?? "Failed to delete member");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loading text="Loading member..." />;
  if (error)   return <AlertBanner message={error} />;
  if (!member) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdPerson className="h-5 w-5" />}
        title={member.name}
        subtitle="Member Details"
        actions={
          <>
            <Button
              variant="ghost"
              icon={<MdArrowBack className="h-4 w-4" />}
              text="Members"
              onClick={() => navigate("/admin/members")}
            />
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

      {/* ── Profile card ── */}
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
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-black ring-4 ring-white shadow-md ${AVATAR_BG[member.membership_type]}`}>
              {getInitials(member.name)}
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TYPE_BADGE[member.membership_type]}`}>
              <MdVerified className="h-3.5 w-3.5" />
              {TYPE_LABELS[member.membership_type]}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
          <p className="mt-0.5 text-sm text-slate-400">{member.email}</p>
          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              member.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
              {member.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Account details ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoRow icon={<MdEmail className="h-4 w-4" />}       label="Email"       value={member.email} />
        <InfoRow icon={<MdPhone className="h-4 w-4" />}       label="Phone"       value={member.phone} />
        <InfoRow icon={<MdShield className="h-4 w-4" />}      label="IC / Passport" value={member.ic_number} />
        <InfoRow icon={<MdFlag className="h-4 w-4" />}        label="Nationality" value={member.nationality} />
        <InfoRow icon={<MdVerified className="h-4 w-4" />}    label="Membership"  value={TYPE_LABELS[member.membership_type]} />
        <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Joined"    value={new Date(member.joined_date).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })} />
      </div>

      <MemberDeleteModal
        open={deleteOpen}
        member={member}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={actionLoading}
      />
    </div>
  );
}
