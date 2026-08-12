import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles, fetchCategories, fetchCertifications } from '../../../services/api';
import { supabase } from '../../../utils/supabaseClient';
import { logAudit } from '../../../utils/AuditLogger';
import ClayCard from '../../UI/ClayCard';
import Portfolio from '../../portfolio/Portfolio';
import { TrendingUp, RefreshCw, AlertCircle, Sparkles, Zap, Eye } from 'lucide-react';

const LATEST_LIMIT = 6;

export const Home = ({ searchTerm, setSearchTerm }) => {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liveUpdate, setLiveUpdate] = useState(false); // flashes badge when realtime fires

  // Track latest params in a ref so the realtime callback can call loadArticles correctly
  const paramsRef = useRef({ category: selectedCategory, search: searchTerm });
  useEffect(() => {
    paramsRef.current = { category: selectedCategory, search: searchTerm };
  }, [selectedCategory, searchTerm]);

  const handleCategorySelect = (cat) => {
    if (selectedCategory !== cat) {
      logAudit('CATEGORY_FILTER_CHANGED', selectedCategory, cat, { component: 'Home' });
      setSelectedCategory(cat);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      if (data && data.categories && data.categories.length > 0) {
        const names = data.categories.map(c => c.name);
        setCategories(['All', ...names]);
      } else {
        setCategories(['All', 'Stocks', 'Cryptocurrency', 'Macroeconomics', 'Wealth Management', 'DeFi 3.0']);
      }
    } catch (err) {
      setCategories(['All', 'Stocks', 'Cryptocurrency', 'Macroeconomics', 'Wealth Management', 'DeFi 3.0']);
    }
  };

  const loadArticles = async (params = paramsRef.current) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles(params);
      setArticles(data.articles || []);
    } catch (err) {
      setError('Unable to load financial insights from server.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadArticles({ category: selectedCategory, search: searchTerm });
  }, [selectedCategory, searchTerm]);

  // ── Supabase Realtime: auto-refresh when articles table changes ──────────────
  useEffect(() => {
    const channel = supabase
      .channel('home-articles-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        () => {
          logAudit('REALTIME_ARTICLES_SYNC', null, 'TRIGGERED', { component: 'Home', table: 'articles' });
          // Flash "Live Updated" badge
          setLiveUpdate(true);
          setTimeout(() => setLiveUpdate(false), 3000);
          // Re-fetch with the current active filter/search
          loadArticles(paramsRef.current);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sort articles for trending sidebar: owner-pinned first, then highest views
  const sortedByTrending = [...articles].sort((a, b) => {
    if ((b.is_trending || 0) !== (a.is_trending || 0)) {
      return (b.is_trending || 0) - (a.is_trending || 0);
    }
    return (b.views || 0) - (a.views || 0);
  });

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const trendingArticles = sortedByTrending.slice(0, 4);

  // Latest Insights: newest first, capped at LATEST_LIMIT (6)
  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, LATEST_LIMIT);

  return (
    <div className="space-y-16 py-4">
      {/* Hero Grid Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hero Card - Featured Selection */}
        <div className="lg:col-span-8">
          {featuredArticle ? (
            <div className="bg-[#0D47A1] text-white border border-[#90CAF9] shadow-xl rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              <div>
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-md bg-[#2196F3] text-white uppercase tracking-widest inline-block mb-6 shadow-sm">
                  FEATURED SELECTION
                </span>

                <h1 className="text-xl sm:text-3xl font-extrabold text-white font-serif leading-[1.15] mb-6">
                  <Link to={`/post/${featuredArticle.id}`} className="hover:text-[#90CAF9] transition-colors">
                    {featuredArticle.title}
                  </Link>
                </h1>

                <p className="text-sm sm:text-base text-slate-100/90 leading-relaxed max-w-2xl font-sans mb-8">
                  {featuredArticle.excerpt || 'Diving deep into the psychology of modern investing and why emotional intelligence is your highest ROI in 2026.'}
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-6 border-t border-[#90CAF9]/40">
                <div className="w-10 h-10 rounded-full bg-white text-[#0D47A1] flex items-center justify-center font-bold text-sm uppercase shadow-sm">
                  {featuredArticle.author ? featuredArticle.author.charAt(0) : 'T'}
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">
                    {featuredArticle.author || 'Tushar Singh'}
                  </span>
                  <span className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-slate-200/80">
                    <span>LEAD ANALYST • {featuredArticle.read_time || '8 MIN READ'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded text-white font-semibold">
                      <Eye className="w-3 h-3" />
                      {featuredArticle.views || 0} visits
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0D47A1]/95 text-white border border-[#90CAF9] shadow-xl rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col justify-between min-h-[460px] animate-pulse">
              <div className="space-y-5">
                <div className="w-36 h-6 bg-white/20 rounded-md"></div>
                <div className="space-y-3">
                  <div className="w-full h-8 bg-white/20 rounded-lg"></div>
                  <div className="w-3/4 h-8 bg-white/20 rounded-lg"></div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="w-full h-4 bg-white/10 rounded"></div>
                  <div className="w-5/6 h-4 bg-white/10 rounded"></div>
                  <div className="w-2/3 h-4 bg-white/10 rounded"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-6 border-t border-[#90CAF9]/40">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div className="space-y-2">
                  <div className="w-28 h-3.5 bg-white/20 rounded"></div>
                  <div className="w-44 h-2.5 bg-white/15 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Trending */}
        <div className="lg:col-span-4 space-y-6 pt-2">
          <div className="bg-[#0D47A1] text-white p-6 rounded-2xl border border-[#90CAF9] shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white bg-[#2196F3] px-4 py-1.5 rounded-lg shadow-sm font-serif inline-flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Trending .
              </h2>
              <span className="text-[10px] uppercase tracking-wider text-slate-200 font-bold bg-[#2196F3]/30 px-2 py-1 rounded">
                Live Views
              </span>
            </div>

            <div className="space-y-5">
              {trendingArticles.length > 0 ? (
                trendingArticles.map((art, idx) => (
                  <div key={art.id} className="space-y-1 group border-b border-[#90CAF9]/30 pb-4 last:border-none last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest">
                        0{idx + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {art.is_trending ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 fill-slate-950" /> Pinned
                          </span>
                        ) : null}
                        <span className="text-[10px] font-semibold text-slate-200 bg-white/10 px-2 py-0.5 rounded">
                          {art.views || 0} visits
                        </span>
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-[#90CAF9] transition-colors line-clamp-2">
                      <Link to={`/post/${art.id}`}>
                        {art.title}
                      </Link>
                    </h4>
                  </div>
                ))
              ) : (
                <>
                  <div className="space-y-1 border-b border-[#90CAF9]/30 pb-3">
                    <span className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest">01</span>
                    <h4 className="text-sm font-semibold text-white">The rise of decentralized credit unions in 2026.</h4>
                  </div>
                  <div className="space-y-1 border-b border-[#90CAF9]/30 pb-3">
                    <span className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest">02</span>
                    <h4 className="text-sm font-semibold text-white">SaaS burnout: How micro-investing changed the landscape.</h4>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#90CAF9] uppercase tracking-widest">03</span>
                    <h4 className="text-sm font-semibold text-white">Why 4% is no longer the magic number for retirement.</h4>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#0D47A1]/10 pb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white bg-[#0D47A1] px-6 py-2.5 rounded-xl shadow-md font-serif inline-block">
              Latest Insights
            </h2>

            {/* Live update flash badge */}
            {liveUpdate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-lg animate-pulse">
                <Zap className="w-3 h-3 fill-white" /> Live Updated
              </span>
            )}

            {/* Post count badge */}
            {!loading && articles.length > 0 && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D47A1]/60 border border-[#0D47A1]/15 px-2.5 py-1 rounded-full">
                Showing {latestArticles.length} of {articles.length}
              </span>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all ${
                    active
                      ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
                      : 'border-[#0D47A1]/20 text-[#0D47A1] hover:border-[#0D47A1]/50 bg-white/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white/80 border border-[#90CAF9]/60 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="w-20 h-5 bg-[#E3F2FD] rounded"></div>
                  <div className="w-16 h-4 bg-slate-100 rounded"></div>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="w-full h-6 bg-slate-200/80 rounded-md"></div>
                  <div className="w-3/4 h-6 bg-slate-200/80 rounded-md"></div>
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="w-full h-3.5 bg-slate-100 rounded"></div>
                  <div className="w-5/6 h-3.5 bg-slate-100 rounded"></div>
                  <div className="w-2/3 h-3.5 bg-slate-100 rounded"></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="w-24 h-4 bg-slate-200/70 rounded"></div>
                  <div className="w-16 h-4 bg-[#E3F2FD] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-6 rounded border border-rose-600/30 bg-rose-50 text-rose-900 text-xs">
            {error}
          </div>
        )}

        {/* Card Grid — latest 6 posts */}
        {!loading && !error && latestArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ClayCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && latestArticles.length === 0 && (
          <div className="py-20 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#0D47A1]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#0D47A1]/50">No articles found for this filter.</p>
          </div>
        )}
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="pt-8">
        <Portfolio />
      </section>
    </div>
  );
};

export default Home;
