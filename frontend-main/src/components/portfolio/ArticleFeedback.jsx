import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle2, Loader2, AlertCircle, MessageSquareHeart } from 'lucide-react';
import { createFeedback } from '../../services/api';

export const ArticleFeedback = () => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const ratingDescriptions = {
    1: 'Needs Improvement',
    2: 'Fair Insights',
    3: 'Good Quality',
    4: 'Very Insightful',
    5: 'Outstanding Research & Models!'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      setErrorMessage('Please provide your suggestions or feedback before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await createFeedback({
        rating,
        suggestion: suggestion.trim(),
        name: name.trim() || 'Anonymous Reader',
        email: email.trim() || ''
      });

      setSubmitted(true);
      setSuggestion('');
      setName('');
      setEmail('');
      setTimeout(() => {
        setSubmitted(false);
      }, 7000);
    } catch (err) {
      console.error('Feedback submission error:', err);
      setErrorMessage(err.message || 'Unable to submit feedback at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-14 md:py-20 bg-gradient-to-b from-[#EFF6FF]/60 to-[#EAF2F8] border border-[#BFDBFE] rounded-3xl relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <motion.div
          className="text-center space-y-2.5 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <span className="px-3.5 py-1 rounded-full bg-[#DBEAFE] text-[#1E3A8A] border border-[#BFDBFE] text-[11px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 shadow-xs">
            <MessageSquareHeart className="w-3.5 h-3.5 text-amber-500" />
            COMMUNITY &amp; READER VOICES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3A8A] font-serif tracking-tight">
            Article Feedback
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed font-sans">
            How was your reading experience? Rate our financial research and leave suggestions for upcoming valuation models or topics.
          </p>
        </motion.div>

        {/* Feedback Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-[#BFDBFE] rounded-2xl p-6 sm:p-8 shadow-md"
        >
          {submitted ? (
            <div className="py-10 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A] font-serif">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs text-[#475569] max-w-sm mx-auto">
                Your rating and suggestions have been recorded and will help us refine our future publications.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2563EB] transition-colors"
                >
                  Submit More Feedback
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating Interactive Selector */}
              <div className="text-center space-y-2 bg-[#EFF6FF]/70 p-5 rounded-xl border border-[#BFDBFE]">
                <label className="block text-xs font-extrabold text-[#1E3A8A] uppercase tracking-wider">
                  Rate the Quality of Insights
                </label>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1.5 focus:outline-none transition-transform duration-150 hover:scale-125 cursor-pointer"
                        title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors duration-200 ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-[#2563EB] font-mono tracking-wide pt-1">
                  {rating} of 5 Stars — {ratingDescriptions[hoverRating || rating]}
                </div>
              </div>

              {/* Suggestions Text Area */}
              <div>
                <label className="block text-xs font-bold text-[#1E3A8A] uppercase tracking-wider mb-2">
                  Suggestions &amp; Recommended Topics <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="What topics, financial models, or analyses would you like us to cover next? Share your suggestions..."
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#BFDBFE] bg-[#EAF2F8]/30 text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm font-sans transition-all resize-y"
                />
              </div>

              {/* Optional Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#BFDBFE] bg-white text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. priya@analytics.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#BFDBFE] bg-white text-[#1E3A8A] placeholder-[#475569]/50 focus:outline-none focus:border-[#2563EB] text-xs font-sans"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Solid Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1E3A8A] hover:bg-[#1d4ed8] active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Feedback...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Article Feedback</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default ArticleFeedback;
