import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider }   from "components/features/auth/context/AuthContext";
import { ToastProvider }  from "components/ui/toast/ToastContext";
import PublicLayout        from "layouts/public";

// No page is public right now — every route (auth, admin, staff, beneficiary
// included) funnels through PublicLayout, which itself only renders Home at
// "/" and redirects anything else back to "/".
const App = () => (
  <ToastProvider>
  <AuthProvider>
    <Routes>
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  </AuthProvider>
  </ToastProvider>
);

export default App;
