import React from 'react';
import FinancialBackground from '../components/FinancialBackground';
import Hero from '../components/Hero';
import ShowcaseGrid from '../components/ShowcaseGrid';
import SolutionsAccordion from '../components/SolutionsAccordion';
import ExperienceEducation from '../components/ExperienceEducation';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import { ExternalLink } from 'lucide-react';

export const Index = () => {
  return (
    <div className="min-h-screen bg-[#EAF2F8]/60 text-[#1E3A8A] flex flex-col justify-between font-sans antialiased relative z-0">
      {/* 3D Candlestick & Line Graph Animated Canvas Background */}
      <FinancialBackground />

      {/* Sticky Top Navigation Bar with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#EAF2F8]/90 border-b border-[#BFDBFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left Side (Brand): Solid blue circle with white "TS" + Stacked text */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1E3A8A] flex items-center justify-center font-extrabold text-white text-sm shadow-sm shrink-0">
              TS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#1E3A8A] tracking-tight text-lg leading-tight uppercase">
                TUSHAR SINGH
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#2563EB] uppercase">
                LAW & FINANCIAL ADVISORY
              </span>
            </div>
          </div>

          {/* Middle/Right Side (Anchor Links) */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
            <a href="#experience-education" className="hover:text-[#2563EB] transition-colors">
              EXPERIENCE & EDUCATION
            </a>
            <a href="#solutions" className="hover:text-[#2563EB] transition-colors">
              SOLUTIONS
            </a>
            <a href="#certifications" className="hover:text-[#2563EB] transition-colors">
              CERTIFICATIONS
            </a>
            <a href="#skills" className="hover:text-[#2563EB] transition-colors">
              SKILLS
            </a>
            <a href="#contact" className="hover:text-[#2563EB] transition-colors">
              CONTACT
            </a>
          </div>

          {/* Right Edge (CTA): Solid dark blue button with ExternalLink icon */}
          <div>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              MAIN BLOG PLATFORM <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Sections (7 Total Sections) */}
      <main className="flex-grow">
        <Hero />
        <ShowcaseGrid />
        <SolutionsAccordion />
        <ExperienceEducation />
        <Certifications />
        <Skills />
        <Contact />
      </main>

      {/* Centered Portfolio Footer */}
      <footer className="border-t border-[#BFDBFE] py-8 bg-[#EAF2F8] text-xs text-[#1E3A8A]/80 font-medium text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Tushar Singh. All Rights Reserved. Legal & Financial Advisory Portfolio.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

