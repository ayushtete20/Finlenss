import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import FinancialBackground from '../components/FinancialBackground';
import Hero from '../components/Hero';
import ShowcaseGrid from '../components/ShowcaseGrid';
import SolutionsAccordion from '../components/SolutionsAccordion';
import ExperienceEducation from '../components/ExperienceEducation';
import Certifications from '../components/Certifications';
import Skills from '../components/Skills';
import Contact from '../components/Contact';
import WhatsAppFloatingBtn from '../components/WhatsAppFloatingBtn';
import { ExternalLink } from 'lucide-react';

export const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.pathname.replace('/', '') || location.hash.replace('#', '');
    if (sectionId) {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#EAF2F8]/60 text-[#1E3A8A] flex flex-col justify-between font-sans antialiased relative z-0">
      {/* 3D Candlestick & Line Graph Animated Canvas Background */}
      <FinancialBackground />

      {/* Sticky Top Navigation Bar with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#EAF2F8]/90 border-b border-[#BFDBFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left Side (Brand): Solid blue circle with white "TS" + Stacked text */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#1E3A8A] group-hover:bg-[#2563EB] flex items-center justify-center font-extrabold text-white text-sm shadow-sm shrink-0 transition-colors">
              TS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold uppercase tracking-widest leading-none group-hover:text-[#2563EB] transition-colors">
                Tushar Singh
              </span>
              <span className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wider mt-0.5 leading-none">
                Research Advisor
              </span>
            </div>
          </Link>

          {/* Center: React Router Link components using relative paths */}
          <div className="hidden md:flex items-center gap-8 text-xs font-extrabold uppercase tracking-widest">
            <Link to="/about" className="hover:text-[#2563EB] hover:scale-105 transform transition-all duration-200">
              ABOUT
            </Link>
            <Link to="/certifications" className="hover:text-[#2563EB] hover:scale-105 transform transition-all duration-200">
              CERTIFICATIONS
            </Link>
            <Link to="/skills" className="hover:text-[#2563EB] hover:scale-105 transform transition-all duration-200">
              SKILLS
            </Link>
            <Link to="/contact" className="hover:text-[#2563EB] hover:scale-105 transform transition-all duration-200">
              CONTACT
            </Link>
          </div>

          {/* Right Edge (CTA): Solid dark blue button */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://finlenss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1d4ed8] active:scale-95 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
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
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-6">
            <a
              href="https://linkedin.com/in/tushar-singh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] font-bold text-xs hover:scale-105 transition-all duration-200 flex items-center gap-1"
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://chat.whatsapp.com/K146aYYHkqLF7rAwEUNA1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] font-bold text-xs hover:scale-105 transition-all duration-200 flex items-center gap-1"
            >
              WhatsApp Group <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="mailto:tusharsingh@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1E3A8A] hover:text-[#2563EB] font-bold text-xs hover:scale-105 transition-all duration-200 flex items-center gap-1"
            >
              Email Advisor <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p>© 2026 Tushar Singh. All Rights Reserved. Legal &amp; Financial Advisory Portfolio.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Chat Button */}
      <WhatsAppFloatingBtn />
    </div>
  );
};

export default Index;

