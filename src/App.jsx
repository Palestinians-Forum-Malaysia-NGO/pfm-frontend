import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider }    from "components/features/auth/context/AuthContext";
import { ToastProvider }  from "components/ui/toast/ToastContext";
import ProtectedRoute      from "components/features/auth/components/ProtectedRoute";
import AdminLayout         from "layouts/admin";
import ManagerLayout       from "layouts/manager";
import MemberLayout        from "layouts/member";
import BeneficiaryLayout   from "layouts/beneficiary";
import AuthLayout          from "layouts/auth";
import PublicLayout        from "layouts/public";

const App = () => (
  <ToastProvider>
  <AuthProvider>
    <Routes>
      {/* Public — no auth required */}
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/*"     element={<PublicLayout />} />

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
        path="manager/*"
        element={
          <ProtectedRoute role="manager">
            <ManagerLayout />
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
      <Route
        path="member/*"
        element={
          <ProtectedRoute role="member">
            <MemberLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  </AuthProvider>
  </ToastProvider>
);

export default App;
