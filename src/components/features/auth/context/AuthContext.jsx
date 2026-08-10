import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService              from "components/features/auth/services/authService";
import { OTP_PURPOSE }          from "components/features/auth/types";
import { setTokens, clearTokens, isTokenStored, getRoleHome } from "components/features/auth/utils";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

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

  /* ── Refresh user (e.g. after self-profile edits) — keeps navbar/sidebar in sync ── */
  const refreshUser = useCallback(async () => {
    const me = await authService.getMe();
    setUser(me);
    return me;
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate("/auth/sign-in");
  }, [navigate]);

  /* ── Logout with transition overlay ── */
  const handleLogout = useCallback(() => {
    setLoggingOut(true);
    setTimeout(() => {
      clearTokens();
      setUser(null);
      setLoggingOut(false);
      navigate("/auth/sign-in");
    }, 350);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, completeLogin, verifyOtp, loginDirect, logout, handleLogout, refreshUser,
      isAuthenticated: !!user,
    }}>
      {children}
      {loggingOut && (
        <div className="animate-logout-fade pointer-events-none fixed inset-0 z-[9999] bg-white" />
      )}
    </AuthContext.Provider>
  );
};
