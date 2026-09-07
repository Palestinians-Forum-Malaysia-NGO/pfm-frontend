import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider }    from "components/features/auth/context/AuthContext";
import { ToastProvider }  from "components/ui/toast/ToastContext";
import ProtectedRoute      from "components/features/auth/components/ProtectedRoute";
import AdminLayout         from "layouts/admin";
import StaffLayout         from "layouts/staff";
import BeneficiaryLayout   from "layouts/beneficiary";
import AuthLayout          from "layouts/auth";
import PublicLayout        from "layouts/public";

const RedirectToAuth = ({ to }) => {
  const { search } = useLocation();
  return <Navigate to={`${to}${search}`} replace />;
};

const App = () => (
  <ToastProvider>
  <AuthProvider>
    <Routes>
      {/* Public — no auth required */}
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Deep-link redirects from API emails → auth pages */}
      <Route path="reset-password"  element={<RedirectToAuth to="/auth/reset-password" />} />
      <Route path="set-password"    element={<RedirectToAuth to="/auth/reset-password" />} />

      {/* Old register URL → new /apply */}
      <Route path="register" element={<Navigate to="/apply" replace />} />

      <Route path="/*" element={<PublicLayout />} />

      {/* Protected by role */}
      <Route
        path="admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="staff/*"
        element={
          <ProtectedRoute role="staff">
            <StaffLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="beneficiary/*"
        element={
          <ProtectedRoute role="beneficiary">
            <BeneficiaryLayout />
          </ProtectedRoute>
        }
      />

    </Routes>
  </AuthProvider>
  </ToastProvider>
);

export default App;
