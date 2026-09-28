// Family members and typed supporting documents — shared by registration,
// the beneficiary's own profile editor and the admin read-only views.
// The rule functions mirror the backend validators in
// apps/accounts/serializers/beneficiary.py so problems surface in the form
// instead of as a 400 after submitting.

export const SUPPORTING_DOC_TYPES = [
  "passport", "national_id", "visa", "unhcr_document", "entrance_stump", "other",
];

export const RELATIONSHIPS = ["spouse", "child", "other"];

// Which document types a person may upload, by status: a visa document only
// for visa holders, a UNHCR card only for refugees.
export const allowedDocTypes = (hasVisa, situation) => SUPPORTING_DOC_TYPES.filter((type) => {
  if (type === "visa") return hasVisa === "true";
  if (type === "unhcr_document") return hasVisa === "false" && situation === "refugee";
  return true;
});

// Stable React key for list rows (never sent to the API).
let seq = 0;
export const rowKey = () => `row-${++seq}`;

export const EMPTY_DOCUMENT = {
  document_type: "", document_file: null, document_number: "",
  document_issued_date: "", document_expiry_date: "", document_name: "",
};

export const EMPTY_MEMBER = {
  relationship: "", full_name: "", occupation: "", date_of_birth: "", gender: "",
  has_visa: "", visa_type: "", situation: "", documents: [],
};

const hasType = (docs, type) => docs.some((d) => d.document_type === type && d.document_file);
const passportComplete = (d) => d.document_number && d.document_issued_date && d.document_expiry_date;

/**
 * Document rules for one person. Returns i18n keys (beneficiaries.* namespace)
 * describing what's missing — empty array when the documents are complete.
 *   hasVisa   – "true" | "false" | ""   (form string, as the selects store it)
 *   situation – "" | "refugee" | …
 *   isMember  – family members also need passport number + dates for visa holders
 */
export const documentProblems = ({ hasVisa, situation, documents, isMember = false }) => {
  const docs = documents ?? [];
  const problems = [];
  if (docs.some((d) => !d.document_type || !d.document_file)) problems.push("doc_rule_incomplete");
  const allowed = allowedDocTypes(hasVisa, situation);
  if (docs.some((d) => d.document_type && !allowed.includes(d.document_type))) problems.push("doc_rule_type_not_allowed");

  if (hasVisa === "true") {
    if (!hasType(docs, "passport") || !hasType(docs, "visa")) problems.push("doc_rule_passport_and_visa");
    if (isMember && docs.some((d) => d.document_type === "passport" && !passportComplete(d))) {
      problems.push("doc_rule_passport_details");
    }
  } else if (hasVisa === "false") {
    // Only refugees need a document (their UNHCR card); other statuses
    // without a visa have no required documents.
    if (situation === "refugee"
      && !docs.some((d) => d.document_type === "unhcr_document" && d.document_file && d.document_number)) {
      problems.push("doc_rule_unhcr");
    }
  }
  return problems;
};

export const memberProblems = (m) => {
  const problems = [];
  if (!m.relationship) problems.push("member_rule_relationship");
  if (!m.full_name?.trim()) problems.push("member_rule_name");
  if (m.has_visa === "") problems.push("member_rule_visa_status");
  if (m.has_visa === "true" && !m.visa_type) problems.push("member_rule_visa_type");
  if (m.has_visa === "false" && !m.situation) problems.push("member_rule_situation");
  return [...problems, ...documentProblems({
    hasVisa: m.has_visa, situation: m.situation, documents: m.documents, isMember: true,
  })];
};

// Rows nobody has filled in yet (no file, no number) — safe to replace when
// the person's status changes.
export const documentsUntouched = (docs = []) =>
  docs.every((d) => !d.document_file && !d.document_number?.trim());

// Documents a person starts with for their status, so the required rows are
// already on screen (the user can still add more). Empty until the status is
// fully chosen — "no visa" alone doesn't say whether a UNHCR card is needed.
// Visa holders: passport + visa. Refugees: UNHCR card. Anyone else: none.
export const starterDocuments = (hasVisa, situation) => {
  if (hasVisa === "true") return [
    { ...EMPTY_DOCUMENT, _key: rowKey(), document_type: "passport" },
    { ...EMPTY_DOCUMENT, _key: rowKey(), document_type: "visa" },
  ];
  if (hasVisa === "false" && situation === "refugee") {
    return [{ ...EMPTY_DOCUMENT, _key: rowKey(), document_type: "unhcr_document" }];
  }
  return []; // nothing required — the user can still add documents
};

// ── Payload shaping: drop blanks so optional dates aren't sent as "" ────────
export const toDocumentPayload = (d) => Object.fromEntries(
  Object.entries({
    document_type:        d.document_type,
    document_file:        d.document_file,
    document_name:        d.document_name?.trim(),
    document_number:      d.document_number?.trim(),
    document_issued_date: d.document_issued_date,
    document_expiry_date: d.document_expiry_date,
  }).filter(([, v]) => v !== "" && v != null)
);

const boolOf = (v) => (v === "true" ? true : v === "false" ? false : null);

export const toMemberPayload = (m) => {
  const hasVisa = boolOf(m.has_visa);
  return Object.fromEntries(
    Object.entries({
      relationship:  m.relationship,
      full_name:     m.full_name.trim(),
      occupation:    m.occupation?.trim(),
      date_of_birth: m.date_of_birth,
      gender:        m.gender,
      has_visa:      hasVisa,
      visa_type:     hasVisa === true  ? m.visa_type : undefined,
      situation:     hasVisa === false ? m.situation : undefined,
      documents:     (m.documents ?? []).map(toDocumentPayload),
    }).filter(([, v]) => v !== "" && v !== undefined)
  );
};

// API member/document → form state (strings for selects, "" for blanks)
export const documentFromApi = (d) => ({
  ...EMPTY_DOCUMENT,
  _key:                 d.id ?? rowKey(),
  document_type:        d.document_type ?? "",
  document_file:        d.document_file ?? null,
  document_number:      d.document_number ?? "",
  document_issued_date: d.document_issued_date ?? "",
  document_expiry_date: d.document_expiry_date ?? "",
  document_name:        d.document_name ?? "",
});

export const memberFromApi = (m) => ({
  ...EMPTY_MEMBER,
  _key:          m.id ?? rowKey(),
  relationship:  m.relationship ?? "",
  full_name:     m.full_name ?? "",
  occupation:    m.occupation ?? "",
  date_of_birth: m.date_of_birth ?? "",
  gender:        m.gender ?? "",
  has_visa:      m.has_visa == null ? "" : String(m.has_visa),
  visa_type:     m.visa_type ?? "",
  situation:     m.situation ?? "",
  documents:     (m.documents ?? []).map(documentFromApi),
});
