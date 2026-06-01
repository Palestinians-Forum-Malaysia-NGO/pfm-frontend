import React from "react";
import HeroSection       from "components/public/home/HeroSection";
import ImpactStats       from "components/public/home/ImpactStats";
import AboutPFM          from "components/public/home/AboutPFM";
import ProjectCategories from "components/public/home/ProjectCategories";
import ValuesVision      from "components/public/home/ValuesVision";
import NewsHighlights    from "components/public/home/NewsHighlights";
import Testimonials      from "components/public/home/Testimonials";
import PartnersCarousel  from "components/public/home/PartnersCarousel";
import WhatsAppFloatButton from "components/public/home/WhatsAppFloatButton";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ImpactStats />
      <AboutPFM />
      <ProjectCategories />
      <ValuesVision />
      <NewsHighlights />
      <Testimonials />
      <PartnersCarousel />
      <WhatsAppFloatButton phone="60123456789" />
    </>
  );
}
