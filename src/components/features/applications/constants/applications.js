export const APPLICATION_STATUS_LABELS = {
  pending:  "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const APPLICATION_STATUS_BADGE = {
  pending:  "bg-amber-50 text-amber-700 border border-amber-100",
  approved: "bg-green/10 text-green border border-green/20",
  rejected: "bg-red-50 text-red-600 border border-red-100",
};

export const APPLICATION_STATUS_OPTIONS = [
  { value: "",         label: "Select status" },
  { value: "pending",  label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];
