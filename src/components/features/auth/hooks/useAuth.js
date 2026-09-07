import { useContext } from "react";
import { AuthContext } from "components/features/auth/context/AuthContext";

/**
 * Returns auth context: { user, loading, error, isAuthenticated,
 *   login, verifyOtp, loginDirect, logout }
 */
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default useAuth;
