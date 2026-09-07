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

/** ── DRF error parser ── */

/**
 * Extracts a human-readable error message from any Axios/DRF error.
 * Handles: detail string, non_field_errors, field-level errors, plain strings.
 */
const NETWORK_ERROR_MESSAGE = "Unable to connect. Check your internet connection and try again.";
const TIMEOUT_ERROR_MESSAGE = "The request timed out. Please try again.";
const SERVER_ERROR_MESSAGE  = "Something went wrong on our end. Please try again in a moment.";

export const extractError = (err, fallback = "Something went wrong. Please try again.") => {
  // Request never reached the server at all — offline, DNS failure, CORS block, server down.
  if (err?.code === "ERR_NETWORK" || (err?.request && !err?.response)) {
    return NETWORK_ERROR_MESSAGE;
  }
  // Client gave up waiting for a response.
  if (err?.code === "ECONNABORTED") {
    return TIMEOUT_ERROR_MESSAGE;
  }

  const res    = err?.response?.data;
  const status = err?.response?.status;

  if (!res) return err?.message ?? fallback;
  if (typeof res === "string") {
    if (!/^\s*<(!doctype html|html)/i.test(res)) return res;
    // An HTML error page (e.g. a gateway/proxy error) slipped through instead of JSON.
    return status >= 500 ? SERVER_ERROR_MESSAGE : fallback;
  }
  if (res.detail)                         return res.detail;
  if (res.non_field_errors?.[0])          return res.non_field_errors[0];
  // First field-level error
  const firstField = Object.values(res)[0];
  if (Array.isArray(firstField))          return firstField[0];
  if (typeof firstField === "string")     return firstField;
  if (status >= 500)                      return SERVER_ERROR_MESSAGE;
  return fallback;
};

/**
 * Like extractError, but keeps the field name a DRF error is attached to
 * instead of discarding it — needed by any multi-step form that must route
 * the user back to whichever step actually owns the invalid field, rather
 * than showing a message disconnected from where the problem is (e.g. a
 * duplicate-email error surfacing on the last step of a wizard when email
 * was collected on the first). Returns null for non-field errors (network,
 * 5xx, `detail`/`non_field_errors`) — those have nowhere more specific to go.
 */
export const extractFieldError = (err) => {
  const res = err?.response?.data;
  if (!res || typeof res !== "object" || Array.isArray(res)) return null;
  if (res.detail || res.non_field_errors) return null;
  for (const [field, value] of Object.entries(res)) {
    const message = Array.isArray(value) ? value[0] : (typeof value === "string" ? value : null);
    if (message) return { field, message };
  }
  return null;
};
