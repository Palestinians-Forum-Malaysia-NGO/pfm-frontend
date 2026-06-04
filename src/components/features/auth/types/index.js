/**
 * Auth feature — type constants and role definitions.
 */

export const ROLES = {
  ADMIN:       "admin",
  MANAGER:     "manager",
  BENEFICIARY: "beneficiary",
  MEMBER:      "member",
};

/** Default dashboard route for each role */
export const ROLE_HOME = {
  [ROLES.ADMIN]:       "/admin/default",
  [ROLES.MANAGER]:     "/manager/default",
  [ROLES.BENEFICIARY]: "/beneficiary/default",
  [ROLES.MEMBER]:      "/member/default",
};

/** OTP purposes */
export const OTP_PURPOSE = {
  LOGIN:          "login",
  PASSWORD_RESET: "password_reset",
  REGISTER:       "register",
};
