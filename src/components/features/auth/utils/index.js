import { ROLE_HOME } from "../types";

/** ── Token helpers ── */

export const getAccessToken  = ()      => localStorage.getItem("access");
export const getRefreshToken = ()      => localStorage.getItem("refresh");

export const setTokens = ({ access, refresh }) => {
  if (access)  localStorage.setItem("access",  access);
  if (refresh) localStorage.setItem("refresh", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const isTokenStored = () => !!localStorage.getItem("access");

/** ── Role helpers ── */

/** Returns the home route for a given role */
export const getRoleHome = (role) => ROLE_HOME[role] ?? "/auth/sign-in";

/** Returns true if the user's role matches the required role */
export const hasRole = (user, role) => user?.role === role;

/** ── JWT decode (no library needed) ── */

/**
 * Decode a JWT payload without verifying signature.
 * Useful for reading expiry or role from the token client-side.
 */
export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/** Returns true if the access token is expired */
export const isTokenExpired = (token) => {
  const decoded = decodeJwt(token);
  if (!decoded?.exp) return true;
  return Date.now() >= decoded.exp * 1000;
};
