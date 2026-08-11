import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  fetchArticleById,
  fetchArticles,
  fetchCertificationByArticleId,
  trackArticleClick,
  fetchComments,
  createComment,
  likeArticle
} from '../../../services/api';
import {
  ArrowLeft,
  Clock,
  Eye,
  User,
  Share2,
  Calendar,
  Check,
  FileSpreadsheet,
  Download,
  BadgeCheck,
  Heart,
  MessageCircle,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import ClayCard from '../../UI/ClayCard';

export const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [linkedCert, setLinkedCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Engagement state
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [copiedToast, setCopiedToast] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchArticleById(id);
        if (data.article) {
          // Increment and track article visit
          const nextViews = await trackArticleClick(id);
          const liveArticle = {
            ...data.article,
            views: nextViews || (data.article.views || 0) + 1
          };
          setArticle(liveArticle);
          setLikesCount(liveArticle.likes || 0);

          // Check if previously liked locally
          const likedKey = `article_liked_${id}`;
          if (localStorage.getItem(likedKey) === 'true') {
            setIsLiked(true);
          }

          if (liveArticle.category) {
            const relatedData = await fetchArticles({ category: liveArticle.category });
            setRelated((relatedData.articles || []).filter(a => a.id !== parseInt(id)).slice(0, 3));
          }
        } else {
          setError('Article not found.');
        }

        // Fetch linked certification (if any)
        const certData = await fetchCertificationByArticleId(id);
        setLinkedCert(certData.certification || null);

        // Fetch comments for this article
        loadCommentsData(id);
      } catch (err) {
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const loadCommentsData = async (articleId) => {
    setCommentsLoading(true);
    try {
      const data = await fetchComments(articleId);
      setComments(data.comments || []);
    } catch (err) {
      console.warn('Failed to load comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // ── Like Functionality ───────────────────────────────────────────────────────
  const handleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    const updatedCount = nextState ? likesCount + 1 : Math.max(0, likesCount - 1);
    setLikesCount(updatedCount);

    const likedKey = `article_liked_${id}`;
    if (nextState) {
      localStorage.setItem(likedKey, 'true');
    } else {
      localStorage.removeItem(likedKey);
    }

    try {
      if (nextState) {
        await likeArticle(id);
      }
    } catch (e) {
      console.warn('Like sync error:', e);
    }
  };

  // ── Share Functionality ──────────────────────────────────────────────────────
  const handleShare = () => {
    const liveUrl = window.location.href;
    navigator.clipboard.writeText(liveUrl);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // ── Comment Functionality ────────────────────────────────────────────────────
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setCommentError('Please write a comment before posting.');
      return;
    }
    setPostingComment(true);
    setCommentError(null);

    const authorName = newAuthor.trim() || 'Anonymous Reader';
    const commentContent = newComment.trim();

    const optimisticComment = {
      id: Date.now(),
      article_id: parseInt(id, 10),
      author: authorName,
      content: commentContent,
      created_at: new Date().toISOString()
    };

    // Optimistically render new comment immediately
    setComments(prev => [optimisticComment, ...prev]);
    setNewComment('');

    try {
      await createComment({
        article_id: id,
        author: authorName,
        content: commentContent
      });
    } catch (err) {
      console.warn('Failed to post comment to server:', err);
    } finally {
      setPostingComment(false);
    }
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

  const backendUrl = import.meta.env.VITE_API_URL || '';

  const rawExcelUrl = linkedCert?.excel_url || linkedCert?.attachment_url || article?.excel_url || article?.attachment_url || null;
  const excelUrl = rawExcelUrl && rawExcelUrl.startsWith('/uploads')
    ? `${backendUrl}${rawExcelUrl}`
    : rawExcelUrl;

  const excelFileName = linkedCert?.excel_name || linkedCert?.attachment_name || article?.excel_name || article?.attachment_name || (linkedCert?.title ? `${linkedCert.title} Model` : `${article?.title || 'Financial'} Model`);

  const rawCertDocUrl = linkedCert?.cert_doc_url || null;
  const certDocUrl = rawCertDocUrl && rawCertDocUrl.startsWith('/uploads')
    ? `${backendUrl}${rawCertDocUrl}`
    : rawCertDocUrl;

  const portfolioUrl = `/#portfolio`;

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1] bg-white border border-[#90CAF9] hover:bg-[#E3F2FD] rounded-xl shadow-md transition-all">
            <ArrowLeft className="w-4 h-4 text-[#0D47A1]" /> Back to Insights
          </button>
        </Link>

        {/* Top Quick Share */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] shadow-md hover:bg-[#E3F2FD] transition-all cursor-pointer"
        >
          {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#0D47A1]" />}
          {copiedToast ? 'Link Copied!' : 'Share Article'}
        </button>
      </div>

      {/* Floating Link Copied Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-fade-in border border-emerald-500">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Link Copied! Ready to share publicly.</span>
        </div>
      )}

      {/* Article Header */}
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

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-200/80 pt-2 border-t border-[#90CAF9]/40 py-3">
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
          <span className="flex items-center gap-1.5 text-white font-bold bg-[#2196F3]/40 px-2.5 py-1 rounded-md border border-white/20 shadow-xs">
            <Eye className="w-4 h-4 text-white" />
            {article.views || 0} {(article.views || 0) === 1 ? 'visit' : 'visits'}
          </span>
        </div>
      </header>

      {/* Featured Picture — Positioned between Header and Body */}
      {article.thumbnail_url && (
        <div className="rounded-2xl overflow-hidden border-2 border-[#90CAF9] shadow-xl max-h-[480px] bg-slate-900 relative">
          <img
            src={article.thumbnail_url}
            alt={article.title}
            className="w-full h-[280px] sm:h-[400px] md:h-[460px] object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Main Article Body */}
      <div className="mint-card p-6 sm:p-10 space-y-6 text-[#0D47A1] leading-relaxed text-sm sm:text-base">
        {article.content.split('\n').map((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          // In-Body Markdown Images: ![alt](url)
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const alt = imgMatch[1];
            const src = imgMatch[2];
            return (
              <figure key={index} className="my-6 rounded-2xl overflow-hidden border border-[#90CAF9]/60 shadow-md bg-white p-2">
                <img
                  src={src}
                  alt={alt || 'Article visual'}
                  className="w-full max-h-[520px] object-contain rounded-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                {alt && (
                  <figcaption className="text-center text-xs text-[#0D47A1]/70 italic mt-2 font-sans">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          }

          // In-Body Captions: *caption*
          if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**') && trimmed.length > 2) {
            return (
              <p key={index} className="text-center text-xs text-[#0D47A1]/70 italic font-sans -mt-3 mb-4">
                {trimmed.slice(1, -1)}
              </p>
            );
          }

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

        {/* Excel Download Banner */}
        {excelUrl && (
          <div className="mt-8 p-6 rounded-2xl bg-[#E3F2FD] border border-[#90CAF9] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#0D47A1] text-base font-serif">
                  {excelFileName}
                </h4>
                <p className="text-xs text-[#0D47A1]/80 font-sans">
                  Interactive forecast workbook / supporting document attached to this article.
                </p>
              </div>
            </div>

            <a
              href={excelUrl}
              download={excelFileName}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Model</span>
            </a>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: ARTICLE ENGAGEMENT ACTION BAR (Like, Comment, Share)          */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-4">
        {/* Action Bar Container */}
        <div className="bg-white border-2 border-[#90CAF9] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* 1. Like Button */}
            <button
              onClick={handleLike}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer border ${
                isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm scale-105'
                  : 'bg-white border-[#90CAF9] text-[#0D47A1] hover:bg-[#E3F2FD] hover:border-[#2196F3]'
              }`}
              title="Like this article"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 ${
                  isLiked ? 'fill-rose-600 text-rose-600 scale-110 animate-bounce' : 'text-[#0D47A1]'
                }`}
              />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </button>

            {/* 2. Comment Button */}
            <button
              onClick={() => setShowCommentBox(prev => !prev)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer border ${
                showCommentBox
                  ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-md'
                  : 'bg-white border-[#90CAF9] text-[#0D47A1] hover:bg-[#E3F2FD]'
              }`}
              title="Write or view comments"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </button>
          </div>

          {/* 3. Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1E88E5] active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            title="Share live article link"
          >
            {copiedToast ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
            <span>{copiedToast ? 'Link Copied!' : 'Share Article'}</span>
          </button>
        </div>

        {/* Conditionally Rendered Expandable Comment Box */}
        {showCommentBox && (
          <div className="bg-[#EFF6FF]/60 border-2 border-[#90CAF9] rounded-2xl p-6 sm:p-8 space-y-6 shadow-md animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#90CAF9]/60 pb-3">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0D47A1] font-serif flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#2196F3]" />
                Join the Discussion ({comments.length})
              </h3>
              <span className="text-[11px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">
                Public Comments
              </span>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1.5">
                  Your Name / Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma, Equity Strategist"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] placeholder-[#475569]/50 focus:outline-none focus:border-[#2196F3] text-xs sm:text-sm font-sans shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1.5">
                  Your Comment / Insight <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share your perspective on this valuation model, macroeconomic assumptions, or quantitative analysis..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] placeholder-[#475569]/50 focus:outline-none focus:border-[#2196F3] text-xs sm:text-sm font-sans shadow-2xs resize-y"
                />
              </div>

              {commentError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{commentError}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={postingComment || !newComment.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#2196F3] active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {postingComment ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* List of Comments Rendered Immediately Below */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider">
                Recent Reader Comments
              </h4>

              {commentsLoading ? (
                <div className="py-6 text-center text-xs text-[#0D47A1]/60">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="py-8 text-center bg-white/70 border border-[#BFDBFE] rounded-xl text-xs text-[#0D47A1]/70 italic">
                  Be the first to share an insight on this research!
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((c, idx) => (
                    <div
                      key={c.id || idx}
                      className="p-4 rounded-xl bg-white border border-[#BFDBFE] shadow-xs space-y-2 hover:border-[#2196F3] transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#0D47A1] text-white flex items-center justify-center font-bold text-[11px] uppercase">
                            {c.author ? c.author.charAt(0) : 'R'}
                          </div>
                          <span className="text-xs font-bold text-[#0D47A1]">
                            {c.author || 'Anonymous Reader'}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#475569] font-medium">
                          {new Date(c.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#334155] leading-relaxed font-sans pl-9">
                        {c.content || c.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Related Research */}
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
