import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Eye } from 'lucide-react';

export const ClayCard = ({ article }) => {
  const { id, title, excerpt, category, author, read_time, views, thumbnail_url } = article;

  return (
    <article className="bg-[#0D47A1] text-white border border-[#90CAF9] shadow-lg group flex flex-col h-full overflow-hidden relative rounded-2xl hover:border-[#2196F3] hover:-translate-y-1 transition-all duration-300">
      {/* Optional Picture Cover Header */}
      {thumbnail_url ? (
        <div className="relative w-full h-44 overflow-hidden bg-slate-900 shrink-0">
          <img
            src={thumbnail_url.includes('unsplash.com') ? thumbnail_url.replace(/&w=\d+/, '&w=600').replace(/&q=\d+/, '&q=75') : thumbnail_url}
            alt={title}
            loading="lazy"
            decoding="async"
            width="600"
            height="340"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1] via-transparent to-transparent opacity-60" />
          <span className="absolute bottom-3 left-4 px-3 py-1 text-[10px] font-bold rounded-md bg-[#2196F3] text-white uppercase tracking-wider shadow-sm">
            {category || 'FEATURED'}
          </span>
        </div>
      ) : null}

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Category Pill Tag & Live Views (if no thumbnail) */}
        {!thumbnail_url && (
          <div className="flex justify-between items-center mb-4">
            <span className="px-3 py-1 text-[10px] font-bold rounded-md bg-[#2196F3] text-white uppercase tracking-wider">
              {category || 'FEATURED'}
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-200/80 font-semibold">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                <Eye className="w-3 h-3 text-slate-200/90" />
                {views || 0} visits
              </span>
              <span>•</span>
              <span>{read_time || '6 MIN READ'}</span>
            </div>
          </div>
        )}

        {/* Live Views (when thumbnail is shown) */}
        {thumbnail_url && (
          <div className="flex justify-end items-center mb-3">
            <div className="flex items-center gap-2 text-[10px] text-slate-200/80 font-semibold">
              <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                <Eye className="w-3 h-3 text-slate-200/90" />
                {views || 0} visits
              </span>
              <span>•</span>
              <span>{read_time || '6 MIN READ'}</span>
            </div>
          </div>
        )}

        {/* Article Title - White Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight group-hover:text-[#90CAF9] transition-colors line-clamp-2 mb-3">
          <Link to={`/post/${id}`}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-xs text-slate-100/80 leading-relaxed line-clamp-3 mb-6 font-sans">
          {excerpt}
        </p>

        {/* Author & Footer */}
        <div className="mt-auto pt-4 border-t border-[#90CAF9]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-[#0D47A1] flex items-center justify-center font-extrabold text-xs uppercase shadow-sm">
              {author ? author.charAt(0) : 'T'}
            </div>
            <div>
              <span className="block text-xs font-bold text-white leading-tight">
                {author || 'Tushar Singh'}
              </span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-slate-200/60">
                LEAD ANALYST
              </span>
            </div>
          </div>

          <Link
            to={`/post/${id}`}
            className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#0D47A1] transition-all"
            title="Read post"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ClayCard;
