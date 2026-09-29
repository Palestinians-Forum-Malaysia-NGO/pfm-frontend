import { Navigate } from "react-router-dom";
import useAuth from "components/features/auth/hooks/useAuth";
import Loading from "components/loading/Loading";
import { getRoleProfile } from "components/features/auth/utils";

// Changing a password is now a popup on the profile page (Security section)
// and in the navbar menu — this old URL just forwards there.
export default function ChangePassword() {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/auth/sign-in" replace />;
  return <Navigate to={getRoleProfile(user?.role)} replace />;
}
