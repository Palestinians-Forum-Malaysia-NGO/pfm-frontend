import React from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import routes from "routes.js";

import PublicNavbar from "components/navbar/PublicNavbar";
import Footer from "components/footer/Footer";
import ProjectDetail from "views/public/projects/ProjectDetail";
import NewsDetail from "views/public/news/NewsDetail";
import EventDetail from "views/public/events/EventDetail";
import NewsletterUnsubscribe from "views/public/newsletter/Unsubscribe";

export default function PublicLayout() {
  const { i18n } = useTranslation();

  React.useEffect(() => {
    document.documentElement.dir  = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/newsletter/unsubscribe/:token" element={<NewsletterUnsubscribe />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
