import React from 'react';
import { motion } from 'framer-motion';
import { Dot } from 'lucide-react';

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

const pillItemVariants = {
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

export const Skills = () => {
  const skills = [
    'Filing',
    'Case Studies',
    'legder',
    'Financial Accounting',
    'Market Analysis',
    'Security Analysis (Securities)',
    'Working Capital Management',
    'Finance',
    'Financial Analysis',
    'Power bi',
    'Microsoft Excel',
    'Financial Modeling',
    'Corporate Finance'
  ];

  return (
    <section id="skills" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative">
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
            CORE COMPETENCIES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Technical & Professional Skills
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Specialized toolkit combining quantitative finance, equity research, financial modeling, and legal case analysis.
          </p>
        </motion.div>

        {/* Centered Wrapping Flexbox Container of Skill Tag Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skills.map((skill, idx) => (
            <motion.div
              key={idx}
              variants={pillItemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white border border-[#BFDBFE] hover:border-[#2563EB] px-4 py-2.5 rounded-full text-[#1E3A8A] hover:text-[#2563EB] text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-colors duration-200 shadow-xs hover:shadow-md cursor-pointer group"
            >
              {/* Left Iconography: Small Solid Blue Dot */}
              <div className="w-2 h-2 rounded-full bg-[#2563EB] group-hover:scale-125 transition-transform shrink-0" />
              <span>{skill}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Skills;
