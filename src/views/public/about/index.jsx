import React from "react";
import AboutHero      from "components/public/about/AboutHero";
import MissionVision  from "components/public/about/MissionVision";
import CoverageMap    from "components/public/about/CoverageMap";
import Objectives     from "components/public/about/Objectives";
import CoreValues     from "components/public/about/CoreValues";
import PartnersGallery from "components/public/about/PartnersGallery";
import ReportsSection from "components/public/about/ReportsSection";
import CallToAction   from "components/public/about/CallToAction";

export default function About() {
  return (
    <>
      <AboutHero />
      <MissionVision />
      <CoverageMap />
      <Objectives />
      <CoreValues />
      <PartnersGallery />
      <ReportsSection />
      <CallToAction />
    </>
  );
}
