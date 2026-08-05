import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Services = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const accordionItems = [
    {
      number: '01',
      title: '01 Digital Strategy',
      description: 'Comprehensive digital roadmaps aligned with market dynamics, leveraging quantitative modeling, audience targeting, and customer acquisition frameworks to drive sustainable growth and business transformation.',
      tags: ['strategy', 'analytics', 'growth']
    },
    {
      number: '02',
      title: '02 AI Automation',
      description: 'Custom AI integration, algorithmic workflow automation, and predictive intelligence engines designed to streamline operations and maximize team productivity at enterprise scale.',
      tags: ['automation', 'ai-models', 'efficiency']
    },
    {
      number: '03',
      title: '03 Brand Development',
      description: 'Strategic visual identity, brand positioning, and value proposition alignment that build trust, differentiate your offering, and command premium authority in competitive markets.',
      tags: ['positioning', 'identity', 'branding']
    },
    {
      number: '04',
      title: '04 Content Marketing',
      description: 'High-converting editorial strategy, technical whitepapers, and multi-channel messaging tailored for institutional audiences and high-intent customer segments.',
      tags: ['editorial', 'engagement', 'conversion']
    },
    {
      number: '05',
      title: '05 SEO Optimization',
      description: 'Technical search optimization, semantic content structure, and organic authority building to ensure dominant search presence for key strategic keywords.',
      tags: ['search', 'visibility', 'ranking']
    },
    {
      number: '06',
      title: '06 Performance Analytics',
      description: 'Real-time data telemetry, attribution modeling, and executive KPI dashboards for transparent, data-verified return on marketing investment.',
      tags: ['metrics', 'attribution', 'roi']
    }
  ];

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="solutions" className="py-16 bg-mint-300 border-t border-navy-900/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Horizontally Centered Title & Subtitle */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="mint-badge">
            Strategic Offerings
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 font-serif tracking-tight">
            Tailored Growth Solutions
          </h2>
          <p className="text-navy-900/80 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            Unlock your business potential with strategic marketing and AI-driven insights designed for sustainable growth and success.
          </p>
        </div>

        {/* Vertical Accordion-Style Interactive List */}
        <div className="w-full space-y-3">
          {accordionItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`mint-card overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-navy-900/40 shadow-md' : 'hover:border-navy-900/30'
                }`}
              >
                {/* Accordion Row Header */}
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-serif text-lg sm:text-xl font-extrabold tracking-tight ${
                      isOpen ? 'text-navy-900' : 'text-navy-900/80 group-hover:text-navy-900'
                    } transition-colors`}>
                      {item.title}
                    </span>
                  </div>

                  <div className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                    isOpen
                      ? 'bg-navy-900 text-white border-navy-900 rotate-180'
                      : 'bg-white text-navy-900 border-navy-900/30 group-hover:bg-navy-900 group-hover:text-white'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Expanded Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-navy-900/10 space-y-4">
                    <p className="text-sm text-navy-900/80 leading-relaxed font-sans">
                      {item.description}
                    </p>

                    {/* Row of Three Small Pill-Shaped Background Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {item.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-3.5 py-1 rounded border border-navy-900/25 bg-navy-900/5 text-navy-900 text-[10px] font-bold uppercase tracking-widest font-sans"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;

