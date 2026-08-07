import React from 'react';
import Hero from './Hero';
import ShowcaseGrid from './ShowcaseGrid';
import SolutionsAccordion from './SolutionsAccordion';
import ExperienceEducation from './ExperienceEducation';
import Certifications from './Certifications';
import Skills from './Skills';
import Contact from './Contact';

export const Portfolio = () => {
  return (
    <div className="space-y-16">
      <Hero />
      <ShowcaseGrid />
      <SolutionsAccordion />
      <ExperienceEducation />
      <Certifications />
      <Skills />
      <Contact />
    </div>
  );
};

export default Portfolio;
