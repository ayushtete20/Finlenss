import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, BadgeCheck, Check, FileSpreadsheet, Download, ExternalLink, X, FileText } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

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

const defaultCertifications = [
  {
    id: 'equity-valuation-dabur',
    title: 'Equity valuation and Financial modelling',
    issuer: 'Caplexus Capital',
    dates: 'Issued Jul 2026 – Expires Jul 2030',
    icon: 'Award',
    article_id: 5,
    article_title: 'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
    excel_url: '/Dabur_India_3_Statement_Financial_Model.xlsx',
    excel_name: 'Dabur_India_3_Statement_Financial_Model.xlsx',
    cert_doc_url: '/uploads/ECC-CEH-Certificate_page-0001__1__1785995910796.jpg',
    cert_doc_name: 'CEH_Certificate.jpg',
    article_content: `Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company's financial performance.`,
    insights: [
      "Revenue growth remains steady, supported by the strength of Dabur's FMCG portfolio.",
      "Gross margins stay resilient despite fluctuations in raw material costs.",
      "Operating margins improve gradually through better cost management and efficiency.",
      "Working capital assumptions play a crucial role in determining free cash flow generation.",
      "Capital expenditure remains disciplined, reflecting an asset-light growth approach.",
      "Operating cash flow continues to be the primary source of liquidity.",
      "Debt levels remain manageable, indicating a strong and stable financial position.",
      "The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.",
      "Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions."
    ]
  },
  { title: 'Financial modelling and analysis', issuer: 'PwC India', dates: 'Verified Credential', icon: 'BadgeCheck' },
  { title: 'Microsoft Excel 2013 Certification', issuer: 'Great Learning', dates: 'Issued Jul 2022 – Expired Jul 2022', icon: 'Award' },
  { title: 'Fundamentals accounting', issuer: 'National Skill Development Corporation', dates: 'Issued Jun 2026', icon: 'BadgeCheck' },
  { title: 'NISM Certifications (NISM-securities market foundation certification)', issuer: 'National Institute of Securities Markets (NISM)', dates: 'Issued Apr 2026 – Expires Apr 2029', icon: 'BadgeCheck' },
  { title: 'UpGrad (Financial Analysis / Working Capital Management)', issuer: 'UpGrad', dates: 'Issued Feb 2026 – Expires Mar 2028', icon: 'Award' },
  { title: 'skill india certificate for finance', issuer: 'Government of India', dates: 'Issued Feb 2026 – Expired Jun 2026', icon: 'Award' }
];

export const Certifications = () => {
  const [selectedCert, setSelectedCert] = useState(null);
  const [certifications, setCertifications] = useState(defaultCertifications);

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const apiTarget = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/certifications` : '/api/certifications';
        const response = await fetch(apiTarget);
        const data = await response.json();
        if (data && data.certifications && data.certifications.length > 0) {
          setCertifications(data.certifications);
        } else {
          setCertifications(defaultCertifications);
        }
      } catch (err) {
        console.warn('Backend certifications load failed, using fallback:', err);
        setCertifications(defaultCertifications);
      }
    };
    loadCerts();
  }, []);

  return (
    <section id="certifications" className="py-16 md:py-24 bg-[#EAF2F8] border-t border-[#BFDBFE] relative">
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
            VERIFIED CREDENTIALS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">
            Licenses &amp; Certifications
          </h2>
          <p className="text-[#334155] text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Accredited credentials across financial modeling, securities markets, corporate valuation, and accounting.
          </p>
        </motion.div>

        {/* 3-Column Responsive Desktop Grid with Staggered Motion */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {certifications.map((cert, idx) => {
            const Icon = cert.icon === 'BadgeCheck' ? BadgeCheck : Award;
            // Support both old attachment_url field and new separate fields
            const rawExcelUrl = cert.excel_url || cert.attachment_url || null;
            const backendUrl = import.meta.env.VITE_API_URL || '';
            const mainAppUrl = 'https://finlenss.com';

            const excelUrl = rawExcelUrl && rawExcelUrl.startsWith('/uploads')
              ? `${backendUrl}${rawExcelUrl}`
              : rawExcelUrl;

            const rawCertDocUrl = cert.cert_doc_url || null;
            const certDocUrl = rawCertDocUrl && rawCertDocUrl.startsWith('/uploads')
              ? `${backendUrl}${rawCertDocUrl}`
              : rawCertDocUrl;

            let blogUrl = cert.blogUrl || cert.blog_url;
            if (cert.article_id) {
              blogUrl = `${mainAppUrl}/post/${cert.article_id}`;
            } else if (blogUrl && typeof blogUrl === 'string') {
              if (blogUrl.startsWith('/')) {
                blogUrl = `${mainAppUrl}${blogUrl}`;
              } else {
                blogUrl = blogUrl.replace(/^http:\/\/localhost:\d+/, mainAppUrl);
              }
            } else {
              blogUrl = `${mainAppUrl}/post/1`;
            }

            const hasAsset = Boolean(excelUrl || certDocUrl || cert.article_id || cert.article_content || blogUrl);

            // Detect if cert doc is an image
            const isImage = certDocUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(certDocUrl);
            const isPdf = certDocUrl && /\.pdf$/i.test(certDocUrl);

            return (
              <motion.div
                key={cert.id || idx}
                variants={cardItemVariants}
                whileHover={{ y: -4 }}
                onClick={() => hasAsset && setSelectedCert({ ...cert, excelUrl, certDocUrl, blogUrl, isImage, isPdf })}
                className={`bg-white border rounded-xl p-6 shadow-sm transition-all duration-300 group flex flex-col justify-between h-full ${
                  hasAsset
                    ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 cursor-pointer hover:shadow-md hover:bg-[#EFF6FF]/40'
                    : 'border-[#BFDBFE] hover:shadow-md hover:border-[#2563EB]'
                }`}
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white shrink-0 shadow-sm group-hover:bg-[#2563EB] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {certDocUrl && (
                        <span className="px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-2.5 h-2.5 text-[#2563EB]" /> Cert
                        </span>
                      )}
                      {excelUrl && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                          <FileSpreadsheet className="w-2.5 h-2.5 text-emerald-600" /> Excel
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="text-base font-bold text-[#1E3A8A] mt-4 mb-1 group-hover:text-[#2563EB] transition-colors leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-[#475569] text-xs font-semibold">{cert.issuer}</p>
                  <p className="text-[#64748B] text-[11px] mt-1.5 font-medium font-mono">{cert.dates}</p>

                  {/* Certificate image thumbnail preview */}
                  {isImage && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-[#BFDBFE]">
                      <img src={certDocUrl} alt="Certificate" className="w-full h-28 object-cover" />
                    </div>
                  )}

                  {hasAsset && cert.article_content && (
                    <div className="mt-3 p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A] font-medium space-y-1">
                      <div className="font-bold flex items-center justify-between text-[11px] text-[#2563EB] uppercase tracking-wider">
                        <span>{cert.article_title ? 'Linked Financial Article' : 'Financial Case Study'}</span>
                        <span>View →</span>
                      </div>
                      <p className="text-[11px] text-[#475569] line-clamp-2">{cert.article_content}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Row */}
                <div className="pt-4 mt-4 border-t border-[#BFDBFE]/60 flex items-center justify-between">
                  <span className="text-[10px] text-[#475569] uppercase font-bold tracking-wider">
                    {hasAsset ? 'View Details' : 'Status'}
                  </span>

                  {hasAsset ? (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-[#1E3A8A] text-white hover:bg-[#2563EB] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  ) : (
                    <span className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                      <Check className="w-3.5 h-3.5 text-[#2563EB] stroke-[3]" />
                      <span className="text-[11px] font-bold text-[#1E3A8A]">Verified</span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>

      {/* ARTICLE & FINANCIAL MODEL DETAIL POPUP MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A8A]/50 backdrop-blur-md">
          <div className="bg-white border border-[#BFDBFE] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-[#475569] hover:bg-[#EFF6FF] hover:text-[#1E3A8A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-[#BFDBFE] pb-4 pr-8">
              <span className="px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[10px] font-extrabold uppercase tracking-widest inline-block">
                License &amp; Certification Case Study
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A] font-serif">
                {selectedCert.title}
              </h3>
              <p className="text-xs text-[#2563EB] font-bold uppercase tracking-wider">
                Issued by {selectedCert.issuer} ({selectedCert.dates})
              </p>
            </div>

            {/* Article Content */}
            <div className="space-y-4 text-xs sm:text-sm text-[#334155] leading-relaxed font-sans">
              <p className="font-medium text-[#1E3A8A] bg-[#EFF6FF] p-4 rounded-xl border border-[#BFDBFE]">
                {selectedCert.article_content || selectedCert.content}
              </p>

              {selectedCert.insights && selectedCert.insights.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-[#1E3A8A] font-serif">
                    Key Insights:
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {selectedCert.insights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0 mt-1.5" />
                        <span className="text-[#334155] font-normal leading-relaxed">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Uploaded Certificate Image Preview */}
            {selectedCert.isImage && selectedCert.certDocUrl && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#1E3A8A] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#2563EB]" /> Uploaded Certificate
                </p>
                <img
                  src={selectedCert.certDocUrl}
                  alt="Certificate Document"
                  className="w-full rounded-xl border border-[#BFDBFE] shadow-sm object-contain max-h-72"
                />
              </div>
            )}

            {/* PDF Certificate Link */}
            {selectedCert.isPdf && selectedCert.certDocUrl && (
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#2563EB] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#1E3A8A]">Uploaded Certificate Document</p>
                  <p className="text-[10px] text-[#475569] truncate">{selectedCert.cert_doc_name || 'certificate.pdf'}</p>
                </div>
                <a
                  href={selectedCert.certDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#1E3A8A] text-white text-[11px] font-bold hover:bg-[#2563EB] hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
                >
                  View PDF
                </a>
              </div>
            )}

            {/* Footer — Excel download via standard HTML <a> tag + Article link */}
            {(selectedCert.excelUrl || selectedCert.article_id) && (
              <div className="pt-4 border-t border-[#BFDBFE] flex flex-col sm:flex-row items-center gap-3">
                {selectedCert.excelUrl && (
                  <a
                    href={(() => {
                      const filename = selectedCert.excel_name || 'Dabur_Model.xlsx';
                      const { data } = supabase.storage.from('financial-models').getPublicUrl(filename);
                      return data?.publicUrl || selectedCert.excelUrl;
                    })()}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={selectedCert.excel_name || 'Dabur_Model.xlsx'}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <Download className="w-4 h-4 text-white" />
                    <span>Download Financial Model (.xlsx)</span>
                  </a>
                )}
                {selectedCert.blogUrl && (
                  <a
                    href={selectedCert.blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-105 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Read Full Article on Blog</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};

export default Certifications;
