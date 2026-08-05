import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowUpRight, User } from 'lucide-react';

export const ClayCard = ({ article }) => {
  const { id, title, excerpt, category, thumbnail_url, author, read_time, views, created_at } = article;

  return (
    <article className="bg-[#0D47A1] text-white border border-[#90CAF9] shadow-lg group flex flex-col h-full overflow-hidden p-6 sm:p-7 relative rounded-2xl hover:border-[#2196F3] hover:-translate-y-1 transition-all duration-300">
      {/* Category Pill Tag */}
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 text-[10px] font-bold rounded-md bg-[#2196F3] text-white uppercase tracking-wider">
          {category || 'FEATURED'}
        </span>
        <span className="text-[10px] text-slate-200/80 font-semibold">
          {read_time || '6 MIN READ'}
        </span>
      </div>

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
    </article>
  );
};

export default ClayCard;

