import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth         from "components/features/auth/hooks/useAuth";
import { getRoleHome } from "components/features/auth/utils";
import Loading         from "components/loading/Loading";

/**
 * Guards a route by authentication and optional role.
 *
 * Usage:
 *   <ProtectedRoute>               — auth only
 *   <ProtectedRoute role="admin">  — auth + exact role match
 */
const ProtectedRoute = ({ children, role }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading text={t("common.loading")} />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
