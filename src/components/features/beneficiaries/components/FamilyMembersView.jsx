import React from "react";
import { useTranslation } from "react-i18next";
import StorageFileActions from "components/ui/StorageFileActions";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : null;

/* Read-only list of a person's typed documents with a link to each file. */
export const DocumentList = ({ documents = [], ownerName }) => {
  const { t } = useTranslation();
  if (!documents.length) return <p className="text-xs text-slate-400">{t("beneficiaries.no_documents")}</p>;
  return (
    <div className="flex flex-col gap-1.5">
      {documents.map((d, i) => (
        <div key={d.id ?? i} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
              {d.document_name || t(`beneficiaries.doc_type_${d.document_type}`, { defaultValue: d.document_type })}
              {d.document_number && <span className="ms-2 font-mono text-xs text-slate-500">{d.document_number}</span>}
            </p>
            {(d.document_issued_date || d.document_expiry_date) && (
              <p className="text-xs text-slate-400">
                {d.document_issued_date && `${t("beneficiaries.doc_issued")}: ${fmtDate(d.document_issued_date)}`}
                {d.document_issued_date && d.document_expiry_date && " · "}
                {d.document_expiry_date && `${t("beneficiaries.doc_expiry")}: ${fmtDate(d.document_expiry_date)}`}
              </p>
            )}
          </div>
          {d.document_file && (
            <StorageFileActions fileKey={d.document_file} ownerName={ownerName}
              name={d.document_name || t(`beneficiaries.doc_type_${d.document_type}`, { defaultValue: d.document_type })} />
          )}
        </div>
      ))}
    </div>
  );
};

/* Read-only view of family_information: { family_in_malaysia, members[] }. */
export default function FamilyMembersView({ family, beneficiaryName }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const members = family?.members ?? [];

  const status = (m) => {
    if (m.has_visa === true)  return `${t("beneficiaries.visa_status_yes")} · ${t(`beneficiaries.visa_type_${m.visa_type}`, { defaultValue: m.visa_type })}`;
    if (m.has_visa === false) return t(`beneficiaries.situation_${m.situation}`, { defaultValue: m.situation });
    return null;
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">
        {t("beneficiaries.info_family_malaysia")}:{" "}
        <span className="font-semibold text-slate-800">
          {family?.family_in_malaysia ? t("beneficiaries.info_yes") : t("beneficiaries.info_no")}
        </span>
      </p>
      {members.length === 0 ? (
        <p className="text-sm text-slate-400">{t("beneficiaries.no_members")}</p>
      ) : members.map((m, i) => (
        <div key={m.id ?? i} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{(isAr && m.full_name_ar) || m.full_name}</p>
            <span className="rounded-full bg-green/10 px-2 py-0.5 text-[11px] font-semibold text-green">
              {t(`beneficiaries.relationship_${m.relationship}`, { defaultValue: m.relationship })}
            </span>
            {status(m) && <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">{status(m)}</span>}
          </div>
          {(m.occupation || m.date_of_birth || m.gender) && (
            <p className="mb-2 text-xs text-slate-500">
              {[m.occupation, m.date_of_birth && fmtDate(m.date_of_birth), m.gender && t(`beneficiaries.gender_${m.gender}`)]
                .filter(Boolean).join(" · ")}
            </p>
          )}
          <DocumentList documents={m.documents}
            ownerName={beneficiaryName ? `${m.full_name} (${beneficiaryName})` : m.full_name} />
        </div>
      ))}
    </div>
  );
}
