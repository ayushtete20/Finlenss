import React from 'react';
import { motion } from 'framer-motion';
import { Layers, BarChart2, ShieldAlert, FileText, Scale, PieChart, ArrowUpRight } from 'lucide-react';

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

const cardItemVariants = {
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

export const ShowcaseGrid = () => {
  const showcaseItems = [
    {
      title: 'Quantitative Equity Valuation',
      category: 'DCF & Multiples',
      description: 'Institutional-grade financial modeling with scenario analysis and sensitivity matrix.',
      icon: BarChart2,
      metric: '+24.5% ROI Model'
    },
    {
      title: 'High Court Affidavit Filings',
      category: 'Statutory Research',
      description: 'Comprehensive legal case analysis, court documentation, and affidavit drafting.',
      icon: Scale,
      metric: '100% Compliant'
    },
    {
      title: 'Corporate Risk Mitigation',
      category: 'Capital Advisory',
      description: 'Identifying structural working capital bottlenecks and liquidity optimization.',
      icon: ShieldAlert,
      metric: 'Minimized Variance'
    },
    {
      title: 'Mergers & Acquisitions Framework',
      category: 'Strategic M&A',
      description: 'Transaction structuring, buy-side due diligence, and enterprise valuation.',
      icon: Layers,
      metric: 'Structured Deal Flow'
    },
    {
      title: 'Working Capital Optimization',
      category: 'Cash Flow Analysis',
      description: 'Operating cycle compression, inventory management, and receivables control.',
      icon: PieChart,
      metric: 'Optimal Liquidity'
    },
    {
      title: 'Regulatory & Securities Compliance',
      category: 'NISM Certified',
      description: 'Adhering to Indian financial market standards and statutory regulatory frameworks.',
      icon: FileText,
      metric: 'Securities Certified'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative overflow-hidden rounded-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Global Centered Section Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="px-3.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[11px] font-extrabold uppercase tracking-widest inline-block shadow-xs">
            FEATURED CASE SHOWCASE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Strategic Advisory Showcase
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Pop-in interactive showcase demonstrating strategic advisory, financial valuation models, and legal case study methodologies.
          </p>
        </motion.div>

        {/* Staggered Floating Multi-Card Showcase Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {showcaseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={cardItemVariants}
                whileHover={{ y: -6 }}
                className={`bg-white border border-[#BFDBFE] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#2563EB] transition-all duration-300 flex flex-col justify-between h-full group ${
                  idx % 2 === 1 ? 'lg:translate-y-4' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-sm group-hover:bg-[#2563EB] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] text-[10px] font-bold">
                      {item.metric}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#BFDBFE]/50 flex items-center justify-between text-xs font-bold text-[#1E3A8A] group-hover:text-[#2563EB]">
                  <span>View Case Overview</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default ShowcaseGrid;
