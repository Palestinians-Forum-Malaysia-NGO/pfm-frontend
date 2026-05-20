import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminLayout from "layouts/admin";
import ManagerLayout from "layouts/manager";
import MemberLayout from "layouts/member";
import AuthLayout from "layouts/auth";
import PublicLayout from "layouts/public";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*"    element={<AuthLayout />} />
      <Route path="admin/*"   element={<AdminLayout />} />
      <Route path="manager/*" element={<ManagerLayout />} />
      <Route path="member/*"  element={<MemberLayout />} />
      <Route path="/*"        element={<PublicLayout />} />
    </Routes>
  );
};

export default App;
