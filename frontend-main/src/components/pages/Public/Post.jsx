import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchArticleById, fetchArticles, fetchCertificationByArticleId } from '../../../services/api';
import { ArrowLeft, Clock, Eye, User, Share2, Calendar, Check, FileSpreadsheet, Download, BadgeCheck, Award, ExternalLink } from 'lucide-react';
import ClayCard from '../../UI/ClayCard';

export const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [linkedCert, setLinkedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(id);
        setArticle(data.article);

        if (data.article && data.article.category) {
          const relatedData = await fetchArticles({ category: data.article.category });
          setRelated((relatedData.articles || []).filter(a => a.id !== parseInt(id)).slice(0, 3));
        }

        // Fetch linked certification (if any)
        const certData = await fetchCertificationByArticleId(id);
        setLinkedCert(certData.certification || null);
      } catch (err) {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-navy-900/60 font-bold uppercase tracking-wider text-xs">
        Loading post...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-[#0D47A1] font-serif">Article Not Found</h2>
        <Link to="/">
          <button className="px-5 py-2.5 bg-white text-[#0D47A1] border border-[#90CAF9] hover:bg-[#E3F2FD] rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all">
            Back to Insights
          </button>
        </Link>
      </div>
    );
  }

  const rawExcelUrl = linkedCert?.excel_url || linkedCert?.attachment_url || null;
  const excelUrl = rawExcelUrl && rawExcelUrl.startsWith('/uploads')
    ? `http://localhost:5000${rawExcelUrl}`
    : rawExcelUrl;

  const rawCertDocUrl = linkedCert?.cert_doc_url || null;
  const certDocUrl = rawCertDocUrl && rawCertDocUrl.startsWith('/uploads')
    ? `http://localhost:5000${rawCertDocUrl}`
    : rawCertDocUrl;

  const portfolioUrl = `/portfolio/#certifications`;

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1] bg-white border border-[#90CAF9] hover:bg-[#E3F2FD] rounded-xl shadow-md transition-all">
            <ArrowLeft className="w-4 h-4 text-[#0D47A1]" /> Back to Insights
          </button>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] shadow-md hover:bg-[#E3F2FD] transition-all"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#0D47A1]" />}
          {copied ? 'Copied' : 'Share'}
        </button>
      </div>

      {/* ── Verified Credential Banner ── shown when a cert is linked to this post */}
      {linkedCert && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-400/60 shadow-md">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-white shrink-0 shadow-md">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                  Verified Credential
                </span>
                {linkedCert.dates && (
                  <span className="text-[10px] font-semibold text-amber-700/70">
                    {linkedCert.dates}
                  </span>
                )}
              </div>
              <h4 className="font-extrabold text-[#92400E] text-sm mt-0.5 leading-snug truncate">
                {linkedCert.title}
              </h4>
              {linkedCert.issuer && (
                <p className="text-xs text-amber-800/70 font-semibold">
                  Issued by {linkedCert.issuer}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {excelUrl && (
              <a
                href={excelUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Download Model
              </a>
            )}
            {certDocUrl && (
              <a
                href={certDocUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Certificate
              </a>
            )}
            <a
              href={portfolioUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#2563EB] text-white text-xs font-bold shadow transition-all"
            >
              View All Credentials
            </a>
          </div>
        </div>
      )}

      <header className="bg-[#0D47A1] text-white p-8 sm:p-10 rounded-2xl border border-[#90CAF9] shadow-xl space-y-6">
        <span className="px-3.5 py-1 text-xs font-extrabold rounded-md bg-[#2196F3] text-white uppercase tracking-widest inline-block shadow-sm">
          {article.category}
        </span>

        <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-base sm:text-lg text-slate-100/90 leading-relaxed font-sans italic border-l-4 border-[#2196F3] pl-4 py-1">
            "{article.excerpt}"
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-200/80 pt-2 border-t border-[#90CAF9]/40 py-3">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <User className="w-4 h-4 text-white" />
            {article.author || 'Tushar Singh'}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(article.created_at || Date.now()).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {article.read_time || '8 min read'}
          </span>
        </div>
      </header>

      <div className="mint-card p-6 sm:p-10 space-y-6 text-[#0D47A1] leading-relaxed text-sm sm:text-base">
        {article.content.split('\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={index} className="text-2xl sm:text-3xl font-extrabold text-[#0D47A1] font-serif pt-4 border-b border-[#0D47A1]/10 pb-2">
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
            return (
              <h2 key={index} className="text-xl sm:text-2xl font-bold text-[#0D47A1] font-serif pt-3">
                {trimmed.replace(/^###?\s+/, '')}
              </h2>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            return (
              <li key={index} className="ml-4 list-disc text-[#0D47A1]/90 pl-2 font-sans font-medium">
                {trimmed.replace(/^[-*•]\s+/, '')}
              </li>
            );
          }

          return (
            <p key={index} className="text-[#0D47A1]/90 leading-relaxed font-sans">
              {trimmed}
            </p>
          );
        })}

        {/* Excel Download Banner for Financial Valuation Articles */}
        <div className="mt-8 p-6 rounded-2xl bg-[#E3F2FD] border border-[#90CAF9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-[#0D47A1] text-base font-serif">
                Dabur India 3-Statement Financial Model
              </h4>
              <p className="text-xs text-[#0D47A1]/80 font-sans">
                Interactive forecast workbook (.xlsx) with Income Statement, Balance Sheet, & Cash Flow linking.
              </p>
            </div>
          </div>

          <a
            href="/Dabur_India_3_Statement_Financial_Model.xlsx"
            download="Dabur_India_3_Statement_Financial_Model.xlsx"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Model (.xlsx)</span>
          </a>
        </div>
      </div>

      {related.length > 0 && (
        <section className="pt-8 border-t border-navy-900/10 space-y-6">
          <h3 className="text-2xl font-bold text-navy-900 font-serif">
            Related Research
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(rel => (
              <ClayCard key={rel.id} article={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default Post;
