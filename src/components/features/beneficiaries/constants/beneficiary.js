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
