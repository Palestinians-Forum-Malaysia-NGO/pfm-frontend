import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "routes.js";

export default function PublicLayout() {
  const getRoutes = () =>
    routes
      .filter((r) => r.layout === "/")
      .map((route, key) => (
        <Route path={route.path} element={route.component} key={key} />
      ));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1">
        <Routes>
          {getRoutes()}
        </Routes>
      </main>
    </div>
  );
}
