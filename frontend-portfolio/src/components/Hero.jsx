import React from 'react';
import { motion } from 'framer-motion';
import { Eye, TrendingUp, Sparkles, Target, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

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

export const Hero = () => {
  const featureCards = [
    {
      icon: TrendingUp,
      title: 'Growth Analytics',
      category: 'Growth Strategy',
      description: 'Data-driven forecasting and performance metrics to accelerate market positioning.'
    },
    {
      icon: Sparkles,
      title: 'Legal & Financial Risk',
      category: 'Corporate Advisory',
      description: 'Comprehensive risk mitigation and statutory affidavit compliance.'
    },
    {
      icon: Target,
      title: 'Equity Valuation',
      category: 'Capital Allocation',
      description: 'Quantitative modeling and discounted cash flow valuation frameworks.'
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-[#EAF2F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 2-Column Desktop Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: 2x2 Grid of Staggered, Floating Feature Cards */}
          <motion.div
            className="order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {featureCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={cardItemVariants}
                    whileHover={{ y: -4 }}
                    className={`bg-white border border-[#BFDBFE] p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2563EB] transition-all duration-300 flex flex-col justify-between ${
                      idx % 2 === 1 ? 'sm:mt-6' : ''
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E3A8A] text-[10px] font-bold uppercase tracking-wider inline-block">
                        {card.category}
                      </span>
                      <h3 className="text-base font-bold text-[#1E3A8A]">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#475569] leading-relaxed font-sans">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Meet Tushar Singh Content */}
          <motion.div
            className="order-1 lg:order-2 space-y-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E3A8A] text-xs font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" /> LEGAL & FINANCIAL STRATEGIST
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E3A8A] leading-[1.15] tracking-tight">
              Meet Tushar Singh: <br />
              <span className="text-[#2563EB]">Your Growth Catalyst</span>
            </h1>

            <p className="text-[#334155] text-sm sm:text-base leading-relaxed font-sans">
              Detailing data-driven financial modeling, equity valuation, and statutory legal research frameworks designed to solve complex business challenges, optimize capital allocation, and unlock sustainable enterprise value.
            </p>

            {/* Bullet Points with Eye / Check Icons */}
            <ul className="space-y-3.5 pt-2">
              <li className="flex items-center gap-3 text-[#1E3A8A] text-xs sm:text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Data-driven quantitative modeling & equity research.</span>
              </li>
              <li className="flex items-center gap-3 text-[#1E3A8A] text-xs sm:text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <span>High Court legal research & statutory affidavit filings.</span>
              </li>
              <li className="flex items-center gap-3 text-[#1E3A8A] text-xs sm:text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Working capital optimization and risk management.</span>
              </li>
            </ul>

            {/* Action CTA Button */}
            <div className="pt-4">
              <a
                href="#experience-education"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E3A8A] hover:bg-[#1d4ed8] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all duration-300"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

