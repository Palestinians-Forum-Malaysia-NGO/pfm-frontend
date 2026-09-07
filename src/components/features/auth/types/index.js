/**
 * Auth feature — type constants and role definitions.
 */

export const ROLES = {
  ADMIN:       "admin",
  STAFF:       "staff",
  MEMBER:      "member",
  BENEFICIARY: "beneficiary",
};

/** Default dashboard route for each role */
export const ROLE_HOME = {
  [ROLES.ADMIN]:       "/admin/default",
  [ROLES.STAFF]:       "/staff/default",
  [ROLES.MEMBER]:      "/member/default",
  [ROLES.BENEFICIARY]: "/beneficiary/default",
};

/** OTP purposes */
export const OTP_PURPOSE = {
  LOGIN:          "login",
  PASSWORD_RESET: "password_reset",
  REGISTER:       "register",
};
