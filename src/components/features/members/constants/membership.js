export const MEMBERSHIP_STATUS_VALUES = {
  ACTIVE:    "active",
  PENDING:   "pending",
  SUSPENDED: "suspended",
  EXPIRED:   "expired",
};

export const MEMBERSHIP_STATUS_LABELS = {
  active:    "Active",
  pending:   "Pending",
  suspended: "Suspended",
  expired:   "Expired",
};

export const MEMBERSHIP_STATUS_BADGE = {
  active:    "bg-green/10 text-green",
  pending:   "bg-amber-50 text-amber-600",
  suspended: "bg-red-50 text-red-500",
  expired:   "bg-slate-100 text-slate-500",
};

export const MEMBERSHIP_STATUS_OPTIONS = [
  { value: "all",       label: "All Status" },
  { value: "active",    label: "Active" },
  { value: "pending",   label: "Pending" },
  { value: "suspended", label: "Suspended" },
  { value: "expired",   label: "Expired" },
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
