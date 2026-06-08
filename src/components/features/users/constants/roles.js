export const ROLE_VALUES = {
  ADMIN:  "admin",
  STUFF:  "stuff",
  MEMBER: "member",
};

export const ROLE_LABELS = {
  admin:  "Admin",
  stuff:  "Staff",
  member: "Member",
};

export const ROLE_BADGE = {
  admin:  "bg-green/10 text-green",
  stuff:  "bg-blue-50 text-blue-600",
  member: "bg-amber-50 text-amber-600",
};

export const ROLE_BADGE_BORDER = {
  admin:  "bg-green/10 text-green border-green/20",
  stuff:  "bg-blue-50 text-blue-600 border-blue-100",
  member: "bg-amber-50 text-amber-600 border-amber-100",
};

export const ROLE_AVATAR_BG = {
  admin:  "bg-green/15 text-green",
  stuff:  "bg-blue-50 text-blue-600",
  member: "bg-amber-50 text-amber-600",
};

export const ROLE_AVATAR_GRADIENT = {
  admin:  "from-green/20 to-green/10 text-green",
  stuff:  "from-blue-100 to-blue-50 text-blue-600",
  member: "from-amber-100 to-amber-50 text-amber-600",
};

export const ROLE_OPTIONS = [
  { value: "admin",  label: "Admin" },
  { value: "stuff",  label: "Staff" },
  { value: "member", label: "Member" },
];

export const ROLE_FILTER_OPTIONS = [
  { value: "all",    label: "All Roles" },
  ...ROLE_OPTIONS,
];
