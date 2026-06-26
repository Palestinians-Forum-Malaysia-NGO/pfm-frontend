import React from "react";
import {
  MdPerson, MdLocationOn, MdCalendarToday, MdTranslate,
  MdFamilyRestroom, MdAccountBalance, MdFolder, MdOpenInNew,
  MdCategory,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";

const MARITAL_LABELS = { single: "Single", married: "Married", divorced: "Divorced", widowed: "Widowed" };
const GENDER_LABELS  = { male: "Male", female: "Female" };
const STATUS_BADGE   = {
  pending:   "bg-amber-50 text-amber-600 border border-amber-200",
  active:    "bg-green/10 text-green border border-green/20",
  suspended: "bg-red-50 text-red-500 border border-red-200",
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";

const SectionCard = ({ icon, title, subtitle, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6">
    <FormHeader icon={icon} title={title} subtitle={subtitle} />
    {children}
  </div>
);

const MemberInfoSection = ({ profile }) => {
  const p = profile?.profile;
  if (!p) return null;

  return (
    <>
      {/* ── Personal Info ── */}
      <SectionCard
        icon={<MdPerson className="h-5 w-5" />}
        title="Personal Information"
        subtitle="Your profile and identity details"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {p.full_name_arabic && (
            <InfoRow icon={<MdTranslate className="h-4 w-4" />} label="Full Name (Arabic)" value={p.full_name_arabic} />
          )}
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Passport No."      value={p.passport_number || "—"} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Gender"            value={GENDER_LABELS[p.gender] ?? p.gender ?? "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Date of Birth"     value={fmtDate(p.date_of_birth)} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label="Marital Status"    value={MARITAL_LABELS[p.marital_status] ?? p.marital_status ?? "—"} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label="Country of Origin" value={p.country_of_origin || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label="Arrived in Malaysia" value={fmtDate(p.date_arrived_in_malaysia)} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label="Current City"      value={p.current_city || "—"} />
          <InfoRow icon={<MdLocationOn className="h-4 w-4" />}    label="Address"           value={p.address || "—"} />
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Account Status</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_BADGE[p.account_status] ?? "bg-slate-100 text-slate-500"}`}>
              {p.account_status ?? "—"}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* ── Classification ── */}
      {p.classification_details && (
        <SectionCard
          icon={<MdCategory className="h-5 w-5" />}
          title="Classification"
          subtitle="Your assigned category"
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{p.classification_details.name}</p>
            {p.classification_details.description && (
              <p className="mt-0.5 text-xs text-slate-400">{p.classification_details.description}</p>
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Family Information ── */}
      {p.family_information && (
        <SectionCard
          icon={<MdFamilyRestroom className="h-5 w-5" />}
          title="Family Information"
          subtitle="Spouse and children details"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label="Family in Malaysia" value={p.family_information.family_in_malaysia ? "Yes" : "No"} />
            {p.family_information.spouse_name && (
              <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Name"         value={p.family_information.spouse_name} />
            )}
            {p.family_information.spouse_name_arabic && (
              <InfoRow icon={<MdTranslate className="h-4 w-4" />} label="Spouse Name (Arabic)" value={p.family_information.spouse_name_arabic} />
            )}
            {p.family_information.spouse_job && (
              <InfoRow icon={<MdPerson className="h-4 w-4" />} label="Spouse Occupation"   value={p.family_information.spouse_job} />
            )}
            <InfoRow icon={<MdFamilyRestroom className="h-4 w-4" />} label="No. of Children"  value={p.family_information.number_of_children ?? "—"} />
          </div>

          {p.family_information.children_information?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Children</p>
              <div className="flex flex-col gap-2">
                {p.family_information.children_information.map((child, i) => (
                  <div key={child.id ?? i} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">{child.child_name || `Child ${i + 1}`}</p>
                    {child.child_name_arabic && <p className="text-xs text-slate-400">{child.child_name_arabic}</p>}
                    {child.child_date_of_birth && (
                      <p className="mt-1 text-xs text-slate-400">DOB: {fmtDate(child.child_date_of_birth)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Banking Information ── */}
      {p.banking_information && (
        <SectionCard
          icon={<MdAccountBalance className="h-5 w-5" />}
          title="Banking Information"
          subtitle="Bank account details"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label="Bank Name"     value={p.banking_information.bank_name         || "—"} />
            <InfoRow icon={<MdAccountBalance className="h-4 w-4" />} label="Account No."   value={p.banking_information.account_number    || "—"} />
            <InfoRow icon={<MdPerson className="h-4 w-4" />}         label="Account Holder" value={p.banking_information.account_holder_name || "—"} />
          </div>
        </SectionCard>
      )}

      {/* ── Supporting Documents ── */}
      {p.supporting_documents?.length > 0 && (
        <SectionCard
          icon={<MdFolder className="h-5 w-5" />}
          title="Supporting Documents"
          subtitle="Uploaded documents for your account"
        >
          <div className="flex flex-col gap-2">
            {p.supporting_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.document_name || doc.document_type}</p>
                  {doc.remarks && <p className="mt-0.5 text-xs text-slate-400">{doc.remarks}</p>}
                </div>
                {doc.document_file && (
                  <a
                    href={doc.document_file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-green/50 hover:text-green"
                  >
                    <MdOpenInNew className="h-3.5 w-3.5" /> View
                  </a>
                )}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </>
  );
};

export default MemberInfoSection;
