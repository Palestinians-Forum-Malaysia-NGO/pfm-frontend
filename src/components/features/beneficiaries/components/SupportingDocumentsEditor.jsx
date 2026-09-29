import React from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { InputField, SelectField, StorageDocumentField } from "components/form";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { SUPPORTING_DOC_TYPES, EMPTY_DOCUMENT, rowKey } from "components/features/beneficiaries/constants/family";

// Types that carry a document number / issue + expiry dates.
const NUMBERED = ["passport", "national_id", "visa", "unhcr_document"];
const DATED    = ["passport", "visa"];

const DocumentRow = ({ doc, index, onChange, onRemove, publicEndpoint, folder, typeOptions, locked }) => {
  const { t } = useTranslation();
  const { url } = useStorageUrl(publicEndpoint ? null : doc.document_file, { forcePresigned: true });
  const set = (f, v) => onChange({ ...doc, [f]: v });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">{t("beneficiaries.doc_n", { n: index + 1 })}</p>
        {locked ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">{t("beneficiaries.doc_required_badge")}</span>
        ) : (
          <button type="button" onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs font-medium text-red-400 transition-colors hover:text-red-600">
            <MdDeleteOutline className="h-3.5 w-3.5" /> {t("beneficiaries.doc_remove")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
        {locked ? (
          <div className="mb-4">
            <p className="mb-1.5 text-sm font-medium text-slate-700">{t("beneficiaries.doc_type")}</p>
            <p className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700">
              {t(`beneficiaries.doc_type_${doc.document_type}`)}
            </p>
          </div>
        ) : (
          <SelectField label={t("beneficiaries.doc_type")} field="document_type" options={typeOptions}
            formData={doc} errors={{}} updateFormData={set} />
        )}
        {NUMBERED.includes(doc.document_type) ? (
          <InputField label={t(`beneficiaries.doc_number_${doc.document_type}`)} field="document_number"
            required={doc.document_type === "unhcr_document"} formData={doc} errors={{}} updateFormData={set} />
        ) : (
          <InputField label={t("beneficiaries.doc_name")} field="document_name" required={false}
            formData={doc} errors={{}} updateFormData={set} />
        )}
      </div>
      {DATED.includes(doc.document_type) && (
        <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
          <InputField label={t("beneficiaries.doc_issued")} field="document_issued_date" type="date" required={false}
            formData={doc} errors={{}} updateFormData={set} />
          <InputField label={t("beneficiaries.doc_expiry")} field="document_expiry_date" type="date" required={false}
            formData={doc} errors={{}} updateFormData={set} />
        </div>
      )}
      <StorageDocumentField
        label={t("beneficiaries.doc_file")}
        required
        publicEndpoint={publicEndpoint}
        folder={folder}
        accept=".pdf,.jpg,.jpeg,.png"
        currentName={doc.document_file ? t("common.uploaded_file") : undefined}
        currentUrl={doc.document_file ? url : undefined}
        onUpload={(key) => set("document_file", key)}
        onRemove={() => set("document_file", null)}
      />
    </div>
  );
};

/**
 * Editable list of typed documents ({ document_type, document_file, number, dates… }).
 *   documents      – current list (form state)
 *   onChange       – (nextList) => void
 *   publicEndpoint – "register" during registration (no auth yet); otherwise pass `folder`
 *   problems       – i18n keys from documentProblems(), shown under the list
 *   allowedTypes   – types offered for this person's status (allowedDocTypes());
 *                    a row whose type is no longer allowed keeps it so it can be fixed
 *   requiredTypes  – types the status requires (requiredDocTypes()); the first
 *                    row of each is locked: it can't be removed or retyped
 */
export default function SupportingDocumentsEditor({
  documents, onChange, publicEndpoint, folder, problems = [], allowedTypes = SUPPORTING_DOC_TYPES,
  requiredTypes = [],
}) {
  const { t } = useTranslation();
  const optionsFor = (current) => SUPPORTING_DOC_TYPES
    .filter((v) => allowedTypes.includes(v) || v === current)
    .map((v) => ({ value: v, label: t(`beneficiaries.doc_type_${v}`) }));

  return (
    <div className="flex flex-col gap-3">
      {documents.map((doc, i) => (
        <DocumentRow
          key={doc._key ?? i}
          doc={doc}
          index={i}
          typeOptions={optionsFor(doc.document_type)}
          locked={requiredTypes.includes(doc.document_type)
            && documents.findIndex((d) => d.document_type === doc.document_type) === i}
          publicEndpoint={publicEndpoint}
          folder={folder}
          onChange={(next) => onChange(documents.map((d, idx) => (idx === i ? next : d)))}
          onRemove={() => onChange(documents.filter((_, idx) => idx !== i))}
        />
      ))}
      {problems.length > 0 && (
        <ul className="list-disc ps-5 text-xs text-amber-700">
          {problems.map((p) => <li key={p}>{t(`beneficiaries.${p}`)}</li>)}
        </ul>
      )}
      <button type="button" onClick={() => onChange([...documents, { ...EMPTY_DOCUMENT, _key: rowKey() }])}
        className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-green transition-colors hover:text-green-600">
        <MdAdd className="h-4 w-4" /> {t("beneficiaries.doc_add")}
      </button>
    </div>
  );
}
