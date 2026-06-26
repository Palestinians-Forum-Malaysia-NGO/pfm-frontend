import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "routes.js";

import PublicNavbar from "components/navbar/PublicNavbar";
import Footer from "components/footer/Footer";
import ProjectDetail from "views/public/projects/ProjectDetail";

export default function PublicLayout() {
  const getRoutes = () =>
    routes
      .filter((r) => r.layout === "/")
      .map((route, key) => (
        <Route path={route.path} element={route.component} key={key} />
      ));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main className="flex-1">
        <Routes>
          {getRoutes()}
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
