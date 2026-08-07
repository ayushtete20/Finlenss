import React, { useState } from 'react';

export const WhatsAppFloatingBtn = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = "https://chat.whatsapp.com/K146aYYHkqLF7rAwEUNA1Y?s=cl&p=i&mlu=0&ilr=0";

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Hover Card / Tooltip Box */}
      <div 
        className={`transition-all duration-300 transform origin-bottom-right mb-3 ${
          isHovered 
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border border-emerald-200/80 rounded-2xl shadow-2xl p-4 w-72 text-slate-800 relative overflow-hidden">
          {/* Subtle Accent Background Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54]"></div>

          {/* Header info */}
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-md">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.339c1.464.796 3.111 1.217 4.88 1.217h.005c5.503 0 9.987-4.478 9.989-9.985 0-2.667-1.037-5.176-2.926-7.065C17.185 3.038 14.679 2 12.012 2zm0 1.812c2.183 0 4.237.85 5.782 2.396 1.545 1.545 2.395 3.598 2.394 5.782 0 4.51-3.67 8.18-8.18 8.18-1.458 0-2.885-.389-4.141-1.127l-.297-.174-3.076.804.821-2.997-.193-.306A8.145 8.145 0 0 1 3.824 11.98c0-4.51 3.67-8.18 8.188-8.18zm-3.52 4.195c-.197 0-.518.074-.789.37-.271.296-1.035 1.011-1.035 2.466 0 1.455 1.06 2.86 1.208 3.057.147.197 2.086 3.184 5.053 4.464.706.304 1.258.486 1.688.623.709.226 1.354.194 1.864.118.568-.085 1.751-.715 1.997-1.405.247-.69.247-1.282.173-1.406-.074-.123-.271-.197-.567-.345-.296-.148-1.751-.863-2.022-.962-.271-.098-.468-.148-.665.148-.197.296-.764.962-.937 1.16-.173.197-.345.222-.641.074-.296-.148-1.252-.461-2.385-1.472-.882-.787-1.478-1.759-1.65-2.055-.173-.296-.018-.456.13-.603.134-.132.296-.345.444-.518.148-.173.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.912-2.193-.241-.577-.487-.499-.665-.508-.171-.008-.368-.01-.565-.01z"/>
                </svg>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 leading-tight">Tushar Singh</h4>
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                WhatsApp Advisory Group
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Join our official financial advisory community for market updates, valuation models & consultation!
          </p>

          {/* Action options */}
          <div className="flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#1ebd5b] active:bg-[#128C7E] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.339c1.464.796 3.111 1.217 4.88 1.217h.005c5.503 0 9.987-4.478 9.989-9.985 0-2.667-1.037-5.176-2.926-7.065C17.185 3.038 14.679 2 12.012 2zm0 1.812c2.183 0 4.237.85 5.782 2.396 1.545 1.545 2.395 3.598 2.394 5.782 0 4.51-3.67 8.18-8.18 8.18-1.458 0-2.885-.389-4.141-1.127l-.297-.174-3.076.804.821-2.997-.193-.306A8.145 8.145 0 0 1 3.824 11.98c0-4.51 3.67-8.18 8.188-8.18zm-3.52 4.195c-.197 0-.518.074-.789.37-.271.296-1.035 1.011-1.035 2.466 0 1.455 1.06 2.86 1.208 3.057.147.197 2.086 3.184 5.053 4.464.706.304 1.258.486 1.688.623.709.226 1.354.194 1.864.118.568-.085 1.751-.715 1.997-1.405.247-.69.247-1.282.173-1.406-.074-.123-.271-.197-.567-.345-.296-.148-1.751-.863-2.022-.962-.271-.098-.468-.148-.665.148-.197.296-.764.962-.937 1.16-.173.197-.345.222-.641.074-.296-.148-1.252-.461-2.385-1.472-.882-.787-1.478-1.759-1.65-2.055-.173-.296-.018-.456.13-.603.134-.132.296-.345.444-.518.148-.173.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.912-2.193-.241-.577-.487-.499-.665-.508-.171-.008-.368-.01-.565-.01z"/>
              </svg>
              <span>Join Group on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Floating Button Container with Label Pill on Left */}
      <div className="flex items-center gap-3">
        {/* Tooltip Label Pill on Hover */}
        <span 
          className={`px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-lg backdrop-blur-md border border-slate-700/50 transition-all duration-300 whitespace-nowrap ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
          }`}
        >
          Chat on WhatsApp
        </span>

        {/* Main WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white shadow-xl hover:shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          {/* Soft ping pulse animation */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>

          {/* WhatsApp Icon */}
          <svg className="w-7 h-7 fill-current relative z-10" viewBox="0 0 24 24">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.483 1.332 5.001L2 22l5.127-1.339c1.464.796 3.111 1.217 4.88 1.217h.005c5.503 0 9.987-4.478 9.989-9.985 0-2.667-1.037-5.176-2.926-7.065C17.185 3.038 14.679 2 12.012 2zm0 1.812c2.183 0 4.237.85 5.782 2.396 1.545 1.545 2.395 3.598 2.394 5.782 0 4.51-3.67 8.18-8.18 8.18-1.458 0-2.885-.389-4.141-1.127l-.297-.174-3.076.804.821-2.997-.193-.306A8.145 8.145 0 0 1 3.824 11.98c0-4.51 3.67-8.18 8.188-8.18zm-3.52 4.195c-.197 0-.518.074-.789.37-.271.296-1.035 1.011-1.035 2.466 0 1.455 1.06 2.86 1.208 3.057.147.197 2.086 3.184 5.053 4.464.706.304 1.258.486 1.688.623.709.226 1.354.194 1.864.118.568-.085 1.751-.715 1.997-1.405.247-.69.247-1.282.173-1.406-.074-.123-.271-.197-.567-.345-.296-.148-1.751-.863-2.022-.962-.271-.098-.468-.148-.665.148-.197.296-.764.962-.937 1.16-.173.197-.345.222-.641.074-.296-.148-1.252-.461-2.385-1.472-.882-.787-1.478-1.759-1.65-2.055-.173-.296-.018-.456.13-.603.134-.132.296-.345.444-.518.148-.173.197-.296.296-.493.098-.197.049-.37-.025-.518-.074-.148-.665-1.602-.912-2.193-.241-.577-.487-.499-.665-.508-.171-.008-.368-.01-.565-.01z"/>
          </svg>

          {/* Active Status Badge */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#25D366] border-2 border-white rounded-full z-20 shadow-sm"></span>
        </a>
      </div>
    </div>
  );
};

export default WhatsAppFloatingBtn;
