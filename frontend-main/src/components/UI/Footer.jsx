import React from 'react';
import { TrendingUp, Globe, Shield } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#E3F2FD] border-t border-[#90CAF9] text-[#0D47A1] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded border-2 border-[#0D47A1] flex items-center justify-center text-[#0D47A1] font-bold">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-[#0D47A1] font-serif">
                MINT.
              </span>
            </div>
            <p className="text-xs text-[#0D47A1]/70 leading-relaxed mb-4">
              Institutional financial analysis, micro-investing trends, and personal wealth psychology.
            </p>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold text-white bg-[#0D47A1] px-3.5 py-1 rounded-lg shadow-sm font-serif uppercase tracking-widest mb-4 inline-block">
              Topics
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#0D47A1]/70">
              <li><a href="/" className="hover:text-[#0D47A1] transition-colors">Macroeconomics</a></li>
              <li><a href="/" className="hover:text-[#0D47A1] transition-colors">Decentralized Credit</a></li>
              <li><a href="/" className="hover:text-[#0D47A1] transition-colors">Micro-Investing</a></li>
              <li><a href="/" className="hover:text-[#0D47A1] transition-colors">Personal Finance</a></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-bold text-[#0D47A1] font-serif uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#0D47A1]/70">
              <li><a href="http://localhost:5174" target="_blank" rel="noreferrer" className="hover:text-[#0D47A1] transition-colors flex items-center gap-1">Advisor Portfolio <Globe className="w-3 h-3 text-[#2196F3]" /></a></li>
              <li><a href="/admin/login" className="hover:text-[#0D47A1] transition-colors">Admin Portal</a></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="text-xs font-bold text-[#0D47A1] font-serif uppercase tracking-widest mb-4">
              Weekly Dispatch
            </h4>
            <p className="text-xs text-[#0D47A1]/70 mb-3">
              Join our weekly dispatch on modern financial intelligence.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="email@domain.com"
                className="w-full px-3 py-1.5 text-xs rounded border border-[#90CAF9] bg-white text-[#0D47A1] placeholder-[#0D47A1]/40 focus:border-[#0D47A1] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded bg-[#0D47A1] text-white hover:bg-[#2196F3] transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#90CAF9] text-center md:flex md:justify-between md:items-center text-xs text-[#0D47A1]/60 font-medium">
          <p>© 2026 MINT Financial Platform by Tushar Singh. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Institutional Financial Insights & Analytics Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
