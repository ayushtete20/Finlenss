import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { TrendingUp, Globe, Shield, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToTop = (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <footer className="bg-[#E3F2FD] border-t border-[#90CAF9] text-[#0D47A1] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1">
            <a href="/" onClick={handleScrollToTop} className="flex items-center gap-2.5 mb-4 group cursor-pointer" title="Finlenss — Back to top">
              <div className="w-7 h-7 rounded border-2 border-[#0D47A1] flex items-center justify-center text-[#0D47A1] font-bold group-hover:bg-[#0D47A1] group-hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-[#0D47A1] font-serif">
                Finlenss.
              </span>
            </a>
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
              <li><a href="/" onClick={handleScrollToTop} className="hover:text-[#0D47A1] transition-colors cursor-pointer">Macroeconomics</a></li>
              <li><a href="/" onClick={handleScrollToTop} className="hover:text-[#0D47A1] transition-colors cursor-pointer">Decentralized Credit</a></li>
              <li><a href="/" onClick={handleScrollToTop} className="hover:text-[#0D47A1] transition-colors cursor-pointer">Micro-Investing</a></li>
              <li><a href="/" onClick={handleScrollToTop} className="hover:text-[#0D47A1] transition-colors cursor-pointer">Personal Finance</a></li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="text-xs font-bold text-[#0D47A1] font-serif uppercase tracking-widest mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#0D47A1]/70">
              <li>
                <a
                  href="#portfolio"
                  className="hover:text-[#0D47A1] cursor-pointer transition-colors"
                >
                  Advisor Portfolio
                </a>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/K146aYYHkqLF7rAwEUNA1Y?s=cl&p=i&mlu=0&ilr=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1.5 font-bold text-[#25D366]"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.339c1.464.796 3.111 1.217 4.88 1.217h.005c5.503 0 9.987-4.478 9.989-9.985 0-2.667-1.037-5.176-2.926-7.065C17.185 3.038 14.679 2 12.012 2zm0 1.812c2.183 0 4.237.85 5.782 2.396 1.545 1.545 2.395 3.598 2.394 5.782 0 4.51-3.67 8.18-8.18 8.18-1.458 0-2.885-.389-4.141-1.127l-.297-.174-3.076.804.821-2.997-.193-.306A8.145 8.145 0 0 1 3.824 11.98c0-4.51 3.67-8.18 8.188-8.18zm-3.52 4.195c-.197 0-.518.074-.789.37-.271.296-1.035 1.011-1.035 2.466 0 1.455 1.06 2.86 1.208 3.057.147.197 2.086 3.184 5.053 4.464.706.304 1.258.486 1.688.623.709.226 1.354.194 1.864.118.568-.085 1.751-.715 1.997-1.405.247-.69.247-1.282.173-1.406-.074-.123-.271-.197-.567-.345-.296-.148-1.751-.863-2.022-.962-.271-.098-.468-.148-.665.148-.197.296-.764.962-.937 1.16-.173.197-.345.222-.641.074-.296-.148-1.252-.461-2.385-1.472-.882-.787-1.478-1.759-1.65-2.055-.173-.296-.018-.456.13-.603.134-.132.296-.345.444-.518.148-.173.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.912-2.193-.241-.577-.487-.499-.665-.508-.171-.008-.368-.01-.565-.01z"/>
                  </svg>
                  WhatsApp Community
                </a>
              </li>
              <li><Link to="/admin/login" className="hover:text-[#0D47A1] transition-colors">Admin Portal</Link></li>
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
          <p>© 2026 Finlenss Financial Platform by Tushar Singh. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Institutional Financial Insights & Analytics Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
