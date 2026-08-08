import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Financial Valuation',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.from('consultations').insert([{
        ...formData,
        status: 'Pending',
        created_at: new Date().toISOString()
      }]);

      if (error) {
        console.warn('Supabase insertion notice, using API fallback:', error.message);
        const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
        await fetch(`${baseUrl}/consultations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', topic: 'Financial Valuation', message: '' });
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);
    } catch (err) {
      console.error('Consultation submission error:', err);
      setErrorMessage(err.message || 'Unable to submit advisory reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative rounded-3xl">
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
            ONLINE RESERVATION
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Connect with Tushar
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Reserve an executive consultation for financial advisory, equity valuation models, or legal affidavit research.
          </p>
        </motion.div>

        {/* 2-Column Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-white border border-[#BFDBFE] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch"
        >
          {/* Left Column: Contact Graphics & Direct Details */}
          <div className="lg:col-span-5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#1E3A8A] font-serif">
                  Tushar Singh
                </h3>
                <p className="text-xs text-[#2563EB] font-bold uppercase tracking-widest mt-1">
                  Legal &amp; Financial Advisory
                </p>
              </div>

              <p className="text-xs text-[#475569] leading-relaxed font-sans">
                Available for quantitative finance consultations, high court statutory case analyses, and corporate restructuring engagements.
              </p>

              {/* Direct Info List */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#475569] uppercase font-bold tracking-wider">Direct Email</span>
                    <a
                      href="mailto:tusharsingh@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1E3A8A] hover:text-[#2563EB] hover:scale-105 inline-block transition-all duration-200"
                    >
                      tusharsingh@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#475569] uppercase font-bold tracking-wider">Office Jurisdiction</span>
                    <span className="text-xs font-bold text-[#1E3A8A]">Lucknow & Delhi NCR, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#475569] uppercase font-bold tracking-wider">Advisory Hours</span>
                    <span className="text-xs font-bold text-[#1E3A8A]">Mon - Fri: 09:00 - 18:00 IST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="pt-6 border-t border-[#BFDBFE] text-[11px] text-[#475569] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Response guaranteed within 24 business hours.</span>
            </div>
          </div>

          {/* Right Column: Contact & Reservation Form */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">
                Reserve Consultation Slot
              </h3>
              <p className="text-xs text-[#475569] mt-1 font-sans">
                Fill in your details below to request a confidential advisory meeting.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Reservation Request Received</h4>
                <p className="text-xs text-emerald-800">
                  Thank you! Tushar Singh will review your request and get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs sm:text-sm font-sans w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs sm:text-sm font-sans w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs sm:text-sm font-sans w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1.5">
                      Advisory Domain
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="px-4 py-3 rounded-xl border border-[#BFDBFE] bg-white text-[#1E3A8A] focus:outline-none focus:border-[#2563EB] text-xs sm:text-sm font-sans w-full cursor-pointer"
                    >
                      <option value="Financial Valuation">Financial Modeling & Valuation</option>
                      <option value="Legal Affidavit">High Court Legal Research</option>
                      <option value="Corporate Risk">Working Capital Optimization</option>
                      <option value="General Inquiry">General Advisory Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-1.5">
                    Brief Inquiry / Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your advisory requirements or project scope..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs sm:text-sm font-sans w-full"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1d4ed8] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Reserve Consultation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
