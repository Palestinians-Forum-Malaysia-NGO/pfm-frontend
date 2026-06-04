import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService              from "components/features/auth/services/authService";
import { OTP_PURPOSE }          from "components/features/auth/types";
import { setTokens, clearTokens, isTokenStored, getRoleHome } from "components/features/auth/utils";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  /* ── Hydrate user on mount if tokens exist ── */
  useEffect(() => {
    if (!isTokenStored()) { setLoading(false); return; }

    authService.getMe()
      .then((data) => setUser(data))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  /* ── Step 1: Login — stores tokens, returns raw response ──
     Caller checks requires_otp:
       true  → show OTP step → call verifyOtp()
       false → call completeLogin()                          */
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const data = await authService.login({ email, password });
    setTokens({ access: data.access, refresh: data.refresh });
    return data;
  }, []);

  /* ── Step 2a: Complete login when no OTP required ── */
  const completeLogin = useCallback(async () => {
    const me = await authService.getMe();
    setUser(me);
    navigate(getRoleHome(me.role));
    return me;
  }, [navigate]);

  /* ── Step 2b: Verify OTP (6-char code) — works for login & register ── */
  const verifyOtp = useCallback(async ({ email, code, purpose = OTP_PURPOSE.LOGIN }) => {
    setError(null);
    const data = await authService.verifyOtp({ email, code, purpose });
    if (data.access) setTokens({ access: data.access, refresh: data.refresh });
    return completeLogin();
  }, [completeLogin]);

  /* ── Direct login (no OTP — single call) ── */
  const loginDirect = useCallback(async ({ email, password }) => {
    setError(null);
    const data = await authService.login({ email, password });
    setTokens({ access: data.access, refresh: data.refresh });
    return completeLogin();
  }, [completeLogin]);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate("/auth/sign-in");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, completeLogin, verifyOtp, loginDirect, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
