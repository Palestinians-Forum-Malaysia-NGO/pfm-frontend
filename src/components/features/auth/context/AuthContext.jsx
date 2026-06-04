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

  /* ── Login (step 1) — returns raw response so caller can check requires_otp ── */
  const login = useCallback(async ({ email, password }) => {
    setError(null);
    const data = await authService.login({ email, password });
    setTokens({ access: data.access, refresh: data.refresh });
    return data;
  }, []);

  /* ── OTP verify (step 2) ── */
  const verifyOtp = useCallback(async ({ email, otp }) => {
    setError(null);
    const data = await authService.verifyOtp({ email, otp, purpose: OTP_PURPOSE.LOGIN });
    if (data.access) setTokens({ access: data.access, refresh: data.refresh });

    const me = await authService.getMe();
    setUser(me);
    navigate(getRoleHome(me.role));
    return me;
  }, [navigate]);

  /* ── Direct login (no OTP) ── */
  const loginDirect = useCallback(async ({ email, password }) => {
    setError(null);
    const data = await authService.login({ email, password });
    setTokens({ access: data.access, refresh: data.refresh });

    const me = await authService.getMe();
    setUser(me);
    navigate(getRoleHome(me.role));
    return me;
  }, [navigate]);

  /* ── Logout ── */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    navigate("/auth/sign-in");
  }, [navigate]);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, verifyOtp, loginDirect, logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
