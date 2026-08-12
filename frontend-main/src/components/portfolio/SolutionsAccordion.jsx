import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TrendingUp, ShieldCheck, FileText } from 'lucide-react';
import { logAudit } from '../../utils/AuditLogger';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

export const SolutionsAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const solutions = [
    {
      number: '01',
      title: 'Digital & Financial Strategy',
      subtitle: 'Data-driven capital allocation & quantitative growth models',
      description: 'Developing high-level corporate finance strategies, discounted cash flow (DCF) models, and valuation benchmarks designed to optimize capital allocation, assess risk parameters, and accelerate market expansion.',
      pills: ['Strategy', 'Analytics', 'Growth', 'Financial Modeling'],
      icon: TrendingUp
    },
    {
      number: '02',
      title: 'Corporate Brand & Wealth Development',
      subtitle: 'Wealth management frameworks & tax-efficient asset location',
      description: 'Building long-term wealth location strategies, working capital structures, and executive brand authority for institutional clients and high-net-worth portfolio management.',
      pills: ['Wealth', 'Branding', 'Structure', 'Tax Efficiency'],
      icon: ShieldCheck
    },
    {
      number: '03',
      title: 'Content & Legal Advisory',
      subtitle: 'High Court legal research, affidavit filings & regulatory compliance',
      description: 'Providing comprehensive legal case study analyses, drafting court affidavit documentation, and ensuring full statutory compliance across Indian securities market regulations.',
      pills: ['Compliance', 'Filings', 'Research', 'Case Analysis'],
      icon: FileText
    }
  ];

  const toggleAccordion = (idx) => {
    const nextIndex = openIndex === idx ? null : idx;
    logAudit('ACCORDION_TOGGLED', openIndex, nextIndex, {
      component: 'SolutionsAccordion',
      solutionTitle: nextIndex !== null ? solutions[nextIndex]?.title : 'None (Collapsed)'
    });
    setOpenIndex(nextIndex);
  };

  return (
    <section id="solutions" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative rounded-3xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Global Centered Section Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="px-3.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[11px] font-extrabold uppercase tracking-widest inline-block shadow-xs">
            SERVICE CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Tailored Growth Solutions
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Full-spectrum advisory services bridging legal research, quantitative finance, and corporate strategy.
          </p>
        </motion.div>

        {/* Numbered Interactive Accordion Rows */}
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {solutions.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-[#2563EB] shadow-md' : 'border-[#BFDBFE] hover:border-[#2563EB]/60 shadow-xs'
                }`}
              >
                {/* Accordion Row Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none bg-white hover:bg-[#EFF6FF]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xl sm:text-2xl font-black text-[#2563EB] font-mono shrink-0">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#475569] font-medium hidden sm:block mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'bg-[#1E3A8A] text-white rotate-180' : 'bg-[#DBEAFE] text-[#1E3A8A]'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expandable Accordion Body */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden border-t border-[#BFDBFE]/60 bg-[#EFF6FF]/40"
                    >
                      <div className="p-6 space-y-4">
                        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed font-sans">
                          {item.description}
                        </p>

                        {/* Interactive Pill Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {item.pills.map((pill, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-3 py-1 rounded-full bg-white border border-[#BFDBFE] text-[#1E3A8A] text-[11px] font-bold shadow-2xs"
                            >
                              #{pill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default SolutionsAccordion;
