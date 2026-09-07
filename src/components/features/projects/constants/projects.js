export const PROJECT_STATUS_LABELS = {
  active:    "Active",
  completed: "Completed",
  on_hold:   "On Hold",
  cancelled: "Cancelled",
};

export const PROJECT_STATUS_BADGE = {
  active:    "bg-green/10 text-green border border-green/20",
  completed: "bg-blue-50 text-blue-700 border border-blue-100",
  on_hold:   "bg-amber-50 text-amber-700 border border-amber-100",
  cancelled: "bg-red-50 text-red-600 border border-red-100",
};

export const PROJECT_STATUS_OPTIONS = [
  { value: "",          label: "Select status" },
  { value: "active",    label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "on_hold",   label: "On Hold" },
  { value: "cancelled", label: "Cancelled" },
];
