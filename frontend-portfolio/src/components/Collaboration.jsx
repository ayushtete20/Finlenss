import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Loader2, AlertCircle, Sparkles, Briefcase } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const Collaboration = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_type: 'Financial Modeling & Valuation',
    message: ''
  });

  const projectOptions = [
    'Financial Modeling & Valuation',
    'Equity Research & DCF',
    'Strategic Advisory & Growth',
    'Data Analytics & Automation',
    'Full-Stack Web App Development',
    'Quantitative Research & Consulting',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill in your name and email address.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        project_type: formData.project_type,
        message: formData.message,
        status: 'Pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('collaborations').insert([payload]);

      if (error) {
        console.warn('Supabase collaboration insert note:', error.message);
        const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
        await fetch(`${baseUrl}/collaborations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        project_type: 'Financial Modeling & Valuation',
        message: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err) {
      console.error('Collaboration submission error:', err);
      setErrorMessage(err.message || 'Unable to submit collaboration request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative rounded-3xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Horizontally Centered Section Header */}
        <motion.div
          className="text-center space-y-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="px-3.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[11px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            PARTNERSHIP &amp; ENGAGEMENTS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight font-serif">
            Let's Collaborate
          </h2>
          <p className="text-[#334155] text-xs sm:text-sm font-sans leading-relaxed">
            Have a project in mind or looking for tailored financial models, valuation research, or quantitative advisory? Send over your requirements to start the conversation.
          </p>
        </motion.div>

        {/* Horizontally Centered Standard Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white border border-[#BFDBFE] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-lg max-w-3xl mx-auto"
        >
          {submitted ? (
            <div className="py-12 px-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-3 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-900 font-serif">
                Collaboration Request Received!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. We will review your project scope and get back to you within 24 business hours.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm font-sans transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm font-sans transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                  Project Type
                </label>
                <div className="relative">
                  <select
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#BFDBFE] bg-white text-[#1E3A8A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm font-sans cursor-pointer transition-all appearance-none"
                  >
                    {projectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#1E3A8A]">
                    <Briefcase className="w-4 h-4 opacity-70" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us about your project goals, timelines, or specific analytical models needed..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm font-sans transition-all resize-y"
                />
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Solid-Colored Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Collaboration Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Collaboration;
