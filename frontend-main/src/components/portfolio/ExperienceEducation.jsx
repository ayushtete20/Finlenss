import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Building2 } from 'lucide-react';

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

export const ExperienceEducation = () => {
  const experiences = [
    {
      role: 'Lawyer',
      company: 'High Court Of Judicature at Allahabad, Lucknow Bench',
      date: 'May 2025 - Jul 2025',
      description: 'Assisted in cases as well as involved in research activity and case studies.'
    },
    {
      role: 'Affidavit filing',
      company: 'High Court Of Judicature at Allahabad, Lucknow Bench',
      date: 'May 2024 - Jul 2024',
      description: 'Case study analysis, filing reports, and research work.'
    },
    {
      role: 'Customer Service Representative',
      company: 'Niftel Communications',
      date: 'Feb 2023 - Dec 2023',
      description: 'Customer handling and third-party representation.'
    }
  ];

  const educations = [
    {
      degree: 'PGDM in Banking, Corporate, Finance, and Securities Law',
      institution: 'School of Inspired Leadership',
      date: 'Apr 2026 – Jun 2028'
    },
    {
      degree: 'Bachelor in Commerce',
      institution: 'Lucknow Christian College',
      date: '2021 – 2023'
    },
    {
      degree: 'Bachelor of Laws - LLB, Accounting and Finance',
      institution: 'Amity University',
      date: 'Completed'
    }
  ];

  return (
    <section id="experience-education" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative rounded-3xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Global Centered Section Header */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="px-3.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[11px] font-extrabold uppercase tracking-widest inline-block shadow-xs">
            CAREER BACKGROUND
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Experience & Education
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            A combined record of professional legal & customer engagement experience alongside specialized financial & corporate law education.
          </p>
        </motion.div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Experience Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#BFDBFE] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shrink-0 shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A8A]">
                Professional Experience
              </h3>
            </div>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {experiences.map((exp, idx) => (
                <motion.div
                  key={idx}
                  variants={cardItemVariants}
                  className="bg-white border border-[#BFDBFE] p-6 rounded-xl space-y-3 hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-lg font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors">
                      {exp.role}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE] self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      {exp.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{exp.company}</span>
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed font-sans pt-1">
                    {exp.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Education Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[#BFDBFE] pb-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] flex items-center justify-center text-white shrink-0 shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-[#1E3A8A]">
                Academic Qualifications
              </h3>
            </div>

            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {educations.map((edu, idx) => (
                <motion.div
                  key={idx}
                  variants={cardItemVariants}
                  className="bg-white border border-[#BFDBFE] p-6 rounded-xl space-y-3 hover:border-[#2563EB] shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-lg font-bold text-[#1E3A8A] group-hover:text-[#2563EB] transition-colors">
                      {edu.degree}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE] self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      {edu.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#475569]">
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{edu.institution}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ExperienceEducation;
