import React from "react";
import HeroSection         from "components/public/home/HeroSection";
import ImpactStats         from "components/public/home/ImpactStats";
import AboutPFM            from "components/public/home/AboutPFM";
import FeaturedProjects    from "components/public/home/FeaturedProjects";
import ProjectCategories   from "components/public/home/ProjectCategories";
import NewsHighlights      from "components/public/home/NewsHighlights";
import UpcomingEvents      from "components/public/home/UpcomingEvents";
import ValuesVision        from "components/public/home/ValuesVision";
import Testimonials        from "components/public/home/Testimonials";
import JoinRoadmap         from "components/public/home/JoinRoadmap";
import PartnersCarousel    from "components/public/home/PartnersCarousel";
import NewsletterSection   from "components/public/home/NewsletterSection";
import WhatsAppFloatButton from "components/public/home/WhatsAppFloatButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <AboutPFM />
      <FeaturedProjects />
      <ProjectCategories />
      <NewsHighlights />
      <UpcomingEvents />
      <ValuesVision />
      <Testimonials />
      <JoinRoadmap />
      <PartnersCarousel />
      <NewsletterSection />
      <WhatsAppFloatButton phone="601156563044" />
    </>
  );
}
