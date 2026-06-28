export const ROLE_VALUES = {
  ADMIN:  "admin",
  STAFF:  "staff",
  BENEFICIARY: "beneficiary",
};

export const ROLE_LABELS = {
  admin:  "Admin",
  staff:  "Staff",
  beneficiary: "Member",
};

export const ROLE_BADGE = {
  admin:  "bg-green/10 text-green",
  staff:  "bg-blue-50 text-blue-600",
  beneficiary: "bg-amber-50 text-amber-600",
};

export const ROLE_BADGE_BORDER = {
  admin:  "bg-green/10 text-green border-green/20",
  staff:  "bg-blue-50 text-blue-600 border-blue-100",
  beneficiary: "bg-amber-50 text-amber-600 border-amber-100",
};

export const ROLE_AVATAR_BG = {
  admin:  "bg-green/15 text-green",
  staff:  "bg-blue-50 text-blue-600",
  beneficiary: "bg-amber-50 text-amber-600",
};

export const ROLE_AVATAR_GRADIENT = {
  admin:  "from-green/20 to-green/10 text-green",
  staff:  "from-blue-100 to-blue-50 text-blue-600",
  beneficiary: "from-amber-100 to-amber-50 text-amber-600",
};

export const ROLE_OPTIONS = [
  { value: "admin",  label: "Admin" },
  { value: "staff",  label: "Staff" },
  { value: "beneficiary", label: "Beneficiary" },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "all",   label: "All Roles" },
  ...ROLE_OPTIONS,
];
