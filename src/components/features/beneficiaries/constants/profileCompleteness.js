// What a beneficiary must have on their profile before submitting a project
// application — the same fields registration requires, so older or
// staff-created accounts get prompted for anything they skipped.
// `me` is the /accounts/me response (beneficiary fields live under `me.profile`).
// `draft` holds values typed into the completion form but not saved yet, so
// conditional fields (visa type, situation, region) follow the new answers.

import { documentProblems } from "./family";

const blank = (v) => v === undefined || v === null || String(v).trim() === "";

export const profileValues = (me) => {
  const p = me?.profile ?? {};
  return {
    profile_photo:     me?.profile_photo ?? "",
    phone_number:      me?.phone_number ?? "",
    gender:            p.gender ?? "",
    date_of_birth:     p.date_of_birth ? p.date_of_birth.slice(0, 10) : "",
    has_visa:          p.has_visa === true ? "true" : p.has_visa === false ? "false" : "",
    visa_type:         p.visa_type ?? "",
    situation:         p.situation ?? "",
    country_of_origin: p.country_of_origin ?? "",
    palestine_region:  p.palestine_region ?? "",
    state:             p.state ?? "",
    address:           p.address ?? "",
    background:        p.background ?? "",
  };
};

// Fields required for these answers (visa status and country decide the
// conditional ones), in display order.
export const requiredProfileFields = (v) => [
  "profile_photo", "phone_number", "gender", "date_of_birth", "has_visa",
  ...(v.has_visa === "true"  ? ["visa_type"] : []),
  ...(v.has_visa === "false" ? ["situation"] : []),
  "country_of_origin",
  ...(v.country_of_origin === "PS" ? ["palestine_region"] : []),
  "state", "address", "background",
];

// Field names still missing, in display order.
export const missingProfileFields = (me, draft = {}) => {
  const v = { ...profileValues(me), ...draft };
  return requiredProfileFields(v).filter((f) => blank(v[f]));
};

// Fields the completion form shows: required under the current answers and
// not already saved on the profile. Kept visible while being typed into.
export const profileFieldsToAsk = (me, draft = {}) => {
  const saved = profileValues(me);
  return requiredProfileFields({ ...saved, ...draft }).filter((f) => blank(saved[f]));
};

// Identity documents the beneficiary's status requires (passport + visa for
// visa holders, UNHCR card for refugees) that aren't on file. Returns
// beneficiaries.* i18n keys. Beneficiaries can't upload these themselves —
// staff add them — so this is reported, not fixed, in the apply flow.
const REQUIRED_DOC_RULES = ["doc_rule_passport_and_visa", "doc_rule_unhcr"];

export const missingIdentityDocuments = (me) => {
  const v = profileValues(me);
  if (v.has_visa === "") return []; // status unknown yet — asked for in the profile form first
  return documentProblems({
    hasVisa: v.has_visa, situation: v.situation, documents: me?.profile?.supporting_documents ?? [],
  }).filter((key) => REQUIRED_DOC_RULES.includes(key));
};
