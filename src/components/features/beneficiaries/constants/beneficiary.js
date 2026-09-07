export const ACCOUNT_STATUS_VALUES = {
  ACTIVE:    "active",
  PENDING:   "pending",
  SUSPENDED: "suspended",
  REJECTED:  "rejected",
};

export const ACCOUNT_STATUS_LABELS = {
  active:    "Active",
  pending:   "Pending",
  suspended: "Suspended",
  rejected:  "Rejected",
};

export const ACCOUNT_STATUS_BADGE = {
  active:    "bg-green/10 text-green",
  pending:   "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-500",
  rejected:  "bg-slate-100 text-slate-500",
};

export const ACCOUNT_STATUS_OPTIONS = [
  { value: "all",       label: "All Status" },
  { value: "active",    label: "Active" },
  { value: "pending",   label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected",  label: "Rejected" },
];

export const ACCOUNT_STATUS_FORM_OPTIONS = [
  { value: "active",    label: "Active" },
  { value: "pending",   label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "rejected",  label: "Rejected" },
];

export const HAS_VISA_OPTIONS = [
  { value: "",      label: "Not specified" },
  { value: "true",  label: "Has Visa" },
  { value: "false", label: "No Visa / Undocumented" },
];

export const VISA_TYPE_OPTIONS = [
  { value: "student",      label: "Student" },
  { value: "work",         label: "Work" },
  { value: "dependent",    label: "Dependent" },
  { value: "social_visit", label: "Social Visit" },
  { value: "refugee_pass", label: "Refugee Pass" },
  { value: "other",        label: "Other" },
];

export const SITUATION_OPTIONS = [
  { value: "refugee",       label: "Refugee" },
  { value: "asylum_seeker", label: "Asylum Seeker" },
  { value: "undocumented",  label: "Undocumented" },
  { value: "overstayed",    label: "Overstayed" },
];

export const PALESTINE_REGION_OPTIONS = [
  { value: "gaza",             label: "Gaza" },
  { value: "west_bank",        label: "West Bank" },
  { value: "refugee_outside",  label: "Refugee Outside Palestine" },
];

export const VISA_TYPE_LABELS     = { student: "Student", work: "Work", dependent: "Dependent", social_visit: "Social Visit", refugee_pass: "Refugee Pass", other: "Other" };
export const SITUATION_LABELS     = { refugee: "Refugee", asylum_seeker: "Asylum Seeker", undocumented: "Undocumented", overstayed: "Overstayed" };
export const PALESTINE_REGION_LABELS = { gaza: "Gaza", west_bank: "West Bank", refugee_outside: "Refugee Outside Palestine" };

export const GENDER_OPTIONS = [
  { value: "male",   label: "Male" },
  { value: "female", label: "Female" },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: "single",   label: "Single" },
  { value: "married",  label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed",  label: "Widowed" },
];

export const GENDER_LABELS = { male: "Male", female: "Female" };
export const MARITAL_STATUS_LABELS = {
  single: "Single", married: "Married", divorced: "Divorced", widowed: "Widowed",
};
