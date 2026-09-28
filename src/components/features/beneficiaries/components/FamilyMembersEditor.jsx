import React from "react";
import { useTranslation } from "react-i18next";
import { MdPersonAdd, MdDeleteOutline } from "react-icons/md";
import { InputField, SelectField } from "components/form";
import SupportingDocumentsEditor from "./SupportingDocumentsEditor";
import {
  RELATIONSHIPS, EMPTY_MEMBER, rowKey, memberProblems, documentProblems, starterDocuments, documentsUntouched,
} from "components/features/beneficiaries/constants/family";

const VISA_TYPES = ["student", "work", "dependent", "social_visit", "refugee_pass", "other"];
const SITUATIONS = ["refugee", "asylum_seeker", "undocumented", "overstayed"];

const MemberCard = ({ member, index, onChange, onRemove, publicEndpoint, folder }) => {
  const { t } = useTranslation();

  const set = (f, v) => {
    const next = { ...member, [f]: v };
    // Pre-fill the documents this status requires — and re-seed them on a
    // status change, as long as the user hasn't filled any row in yet.
    if ((f === "has_visa" || f === "situation") && documentsUntouched(next.documents)) {
      next.documents = starterDocuments(next.has_visa, next.situation);
    }
    onChange(next);
  };

  const opts = (values, prefix) => values.map((v) => ({ value: v, label: t(`beneficiaries.${prefix}${v}`) }));
  const HAS_VISA = [
    { value: "true",  label: t("beneficiaries.visa_status_yes") },
    { value: "false", label: t("beneficiaries.visa_status_no") },
  ];
  const docProblems = documentProblems({
    hasVisa: member.has_visa, situation: member.situation, documents: member.documents, isMember: true,
  });
  const fieldProblems = memberProblems(member).filter((p) => !docProblems.includes(p));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          {member.full_name?.trim() || t("beneficiaries.member_n", { n: index + 1 })}
        </p>
        <button type="button" onClick={onRemove}
          className="inline-flex items-center gap-1 text-xs font-medium text-red-400 transition-colors hover:text-red-600">
          <MdDeleteOutline className="h-3.5 w-3.5" /> {t("beneficiaries.member_remove")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        <SelectField label={t("beneficiaries.member_relationship")} field="relationship"
          options={opts(RELATIONSHIPS, "relationship_")} formData={member} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.member_full_name")} field="full_name"
          formData={member} errors={{}} updateFormData={set} />
      </div>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-3">
        <InputField label={t("beneficiaries.member_occupation")} field="occupation" required={false}
          formData={member} errors={{}} updateFormData={set} />
        <InputField label={t("beneficiaries.date_of_birth")} field="date_of_birth" type="date" required={false}
          formData={member} errors={{}} updateFormData={set} />
        <SelectField label={t("beneficiaries.gender")} field="gender" required={false}
          options={[{ value: "male", label: t("beneficiaries.gender_male") }, { value: "female", label: t("beneficiaries.gender_female") }]}
          formData={member} errors={{}} updateFormData={set} />
      </div>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        <SelectField label={t("beneficiaries.visa_status")} field="has_visa" options={HAS_VISA}
          formData={member} errors={{}} updateFormData={set} />
        {member.has_visa === "true" && (
          <SelectField label={t("beneficiaries.visa_type")} field="visa_type" options={opts(VISA_TYPES, "visa_type_")}
            formData={member} errors={{}} updateFormData={set} />
        )}
        {member.has_visa === "false" && (
          <SelectField label={t("beneficiaries.situation")} field="situation" options={opts(SITUATIONS, "situation_")}
            formData={member} errors={{}} updateFormData={set} />
        )}
      </div>

      {member.has_visa !== "" && (
        <>
          <p className="mb-2 mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{t("beneficiaries.member_documents")}</p>
          <SupportingDocumentsEditor
            documents={member.documents ?? []}
            onChange={(documents) => onChange({ ...member, documents })}
            publicEndpoint={publicEndpoint}
            folder={folder}
            problems={docProblems}
          />
        </>
      )}
      {fieldProblems.length > 0 && (
        <ul className="mt-2 list-disc ps-5 text-xs text-amber-700">
          {fieldProblems.map((p) => <li key={p}>{t(`beneficiaries.${p}`)}</li>)}
        </ul>
      )}
    </div>
  );
};

/**
 * Editable list of family members — spouse, children and other relatives are
 * all entries here (the API has no separate spouse/children fields).
 */
export default function FamilyMembersEditor({ members, onChange, publicEndpoint, folder }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4">
      {members.map((m, i) => (
        <MemberCard
          key={m._key ?? i}
          member={m}
          index={i}
          publicEndpoint={publicEndpoint}
          folder={folder}
          onChange={(next) => onChange(members.map((x, idx) => (idx === i ? next : x)))}
          onRemove={() => onChange(members.filter((_, idx) => idx !== i))}
        />
      ))}
      <button type="button" onClick={() => onChange([...members, { ...EMPTY_MEMBER, _key: rowKey() }])}
        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-green transition-colors hover:text-green-600">
        <MdPersonAdd className="h-4 w-4" /> {t("beneficiaries.member_add")}
      </button>
    </div>
  );
}
