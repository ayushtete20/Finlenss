import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchArticleById, createArticle, updateArticle, isAdminLoggedIn, fetchCategories, uploadFile, createCertification } from '../../../services/api';
import { ArrowLeft, Save, Eye, FileEdit, Sparkles, Image as ImageIcon, CheckCircle, Upload, FileSpreadsheet, Paperclip, Award, Check } from 'lucide-react';
import ClayButton from '../../UI/ClayButton';

export const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Stocks',
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    excerpt: '',
    content: '',
    author: 'Tushar Singh',
    read_time: '6 min read'
  });

  // License & Certification attachment state
  const [linkCert, setLinkCert] = useState(false);
  const [certData, setCertData] = useState({
    title: 'Equity valuation and Financial modelling',
    issuer: 'Caplexus Capital',
    dates: 'Issued Jul 2026 – Expires Jul 2030',
    attachment_url: '',
    attachment_name: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);

  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['Stocks', 'Cryptocurrency', 'Macroeconomics', 'Wealth Management']);

  const presetImages = [
    { label: 'Markets / Stock Chart', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Crypto & Blockchain', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Wealth Management', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Quantitative Data', url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80' },
  ];

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }

    const loadCats = async () => {
      try {
        const data = await fetchCategories();
        if (data && data.categories && data.categories.length > 0) {
          const names = data.categories.map(c => c.name);
          setCategories(names);
          if (!isEditing && names.length > 0) {
            setFormData(prev => ({ ...prev, category: names[0] }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCats();

    if (isEditing) {
      const loadArticle = async () => {
        try {
          const data = await fetchArticleById(id);
          if (data.article) {
            setFormData({
              title: data.article.title || '',
              category: data.article.category || 'Macroeconomics',
              thumbnail_url: data.article.thumbnail_url || '',
              excerpt: data.article.excerpt || '',
              content: data.article.content || '',
              author: data.article.author || 'Tushar Singh',
              read_time: data.article.read_time || '6 min read'
            });
          }
        } catch (err) {
          setError('Failed to fetch article details for editing.');
        } finally {
          setFetching(false);
        }
      };
      loadArticle();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const result = await uploadFile(file);
      setCertData(prev => ({
        ...prev,
        attachment_url: result.url,
        attachment_name: result.originalName || file.name
      }));
    } catch (err) {
      alert('File upload failed: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError('Article Title and Content are required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let savedArticle;
      if (isEditing) {
        savedArticle = await updateArticle(id, formData);
      } else {
        savedArticle = await createArticle(formData);
      }

      // If linking to a certification, save certification linked to this article & file
      if (linkCert && certData.title && certData.issuer) {
        await createCertification({
          title: certData.title,
          issuer: certData.issuer,
          dates: certData.dates,
          article_id: isEditing ? parseInt(id) : (savedArticle.article ? savedArticle.article.id : null),
          article_title: formData.title,
          article_content: formData.excerpt || formData.content.slice(0, 200),
          attachment_url: certData.attachment_url,
          attachment_name: certData.attachment_name,
          status: 'Verified'
        });
      }

      navigate('/admin/dashboard');
    } catch (err) {
      console.warn('Article save notice:', err);
      if (err && err.message && (err.message.includes('JSON') || err.message.includes('Unexpected token') || err.message.includes('valid JSON'))) {
        navigate('/admin/dashboard');
        return;
      }
      setError(err.message || 'Error saving article.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-24 text-center text-slate-400 font-semibold">
        Loading article editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-4">
        <div>
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#0D47A1]/80 hover:text-[#2196F3] mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D47A1] font-serif">
            {isEditing ? 'Edit Published Article' : 'Create New Financial Post'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-white border border-[#90CAF9] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'write' ? 'bg-[#0D47A1] text-white font-bold' : 'text-[#0D47A1]/70 hover:text-[#0D47A1]'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'preview' ? 'bg-[#0D47A1] text-white font-bold' : 'text-[#0D47A1]/70 hover:text-[#0D47A1]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      )}

      {/* Editor Main Form */}
      {activeTab === 'write' ? (
        <form onSubmit={handleSubmit} className="mint-card p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
              Article Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Macro Analysis: Sovereign Debt Yield Spreads & Rate Pivot"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base font-bold text-[#0D47A1] rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 placeholder-[#0D47A1]/40 font-serif focus:outline-none focus:border-[#2196F3]"
              required
            />
          </div>

          {/* Grid Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
                Domain Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#90CAF9] text-[#0D47A1] bg-white focus:outline-none focus:border-[#2196F3]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
                Author Byline
              </label>
              <input
                type="text"
                name="author"
                placeholder="Tushar Singh"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
                Read Time Indicator
              </label>
              <input
                type="text"
                name="read_time"
                placeholder="6 min read"
                value={formData.read_time}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
              />
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider flex items-center justify-between">
              <span>Thumbnail Image URL</span>
              <span className="text-[10px] text-[#2196F3] font-normal">Click preset below to auto-fill</span>
            </label>
            <input
              type="url"
              name="thumbnail_url"
              placeholder="https://images.unsplash.com/..."
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] font-mono focus:outline-none focus:border-[#2196F3]"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetImages.map((p, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: p.url }))}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] hover:border-[#2196F3] hover:text-[#2196F3]"
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
              Summary Excerpt (Card Snippet)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              placeholder="Brief 1-2 sentence overview for post preview cards..."
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full p-3 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
            />
          </div>

          {/* Full Markdown Content Body */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
              Full Content Article Body (Markdown supported) *
            </label>
            <textarea
              name="content"
              rows={12}
              placeholder="# Article Headline&#10;&#10;Write your in-depth financial analysis here using Markdown headers (#), lists (-), and paragraphs..."
              value={formData.content}
              onChange={handleChange}
              className="w-full p-4 text-xs font-mono rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] leading-relaxed focus:outline-none focus:border-[#2196F3]"
              required
            />
          </div>

          {/* LICENSE & CERTIFICATION LINKING AND FILE UPLOADER SECTION */}
          <div className="p-5 rounded-2xl bg-[#E3F2FD]/50 border border-[#90CAF9] space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={linkCert}
                  onChange={(e) => setLinkCert(e.target.checked)}
                  className="w-4 h-4 text-[#2196F3] rounded border-[#90CAF9] focus:ring-[#2196F3]"
                />
                <span className="text-xs font-bold text-[#0D47A1] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#2196F3]" /> Link to License & Certification Credential
                </span>
              </label>
              <span className="text-[10px] text-[#0D47A1]/70 italic">Optional asset integration</span>
            </div>

            {linkCert && (
              <div className="space-y-4 pt-2 border-t border-[#90CAF9]/60 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                      Certification / License Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Equity valuation and Financial modelling"
                      value={certData.title}
                      onChange={(e) => setCertData({ ...certData, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                      Issuing Body / Organization
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Caplexus Capital / PwC India"
                      value={certData.issuer}
                      onChange={(e) => setCertData({ ...certData, issuer: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                    Credential Validity Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Issued Jul 2026 – Expires Jul 2030"
                    value={certData.dates}
                    onChange={(e) => setCertData({ ...certData, dates: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  />
                </div>

                {/* Excel & Supporting Document File Uploader */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Upload Financial Model (Excel / PDF / Document)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">Supports .xlsx, .xls, .pdf, .csv, .docx</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 rounded-xl bg-white border border-[#90CAF9] text-[#0D47A1] hover:bg-[#E3F2FD] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs hover:border-[#2196F3]">
                      <Upload className="w-4 h-4 text-[#2196F3]" />
                      <span>{uploadingFile ? 'Uploading File...' : 'Choose Excel / Document File'}</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>

                    {certData.attachment_name ? (
                      <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2 shadow-xs">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-bold">{certData.attachment_name}</span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : (
                      <span className="text-xs text-[#0D47A1]/60 italic">No file attached yet.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#90CAF9] flex items-center justify-end gap-4">
            <Link to="/admin/dashboard">
              <ClayButton variant="secondary" size="md">
                Cancel
              </ClayButton>
            </Link>
            <ClayButton
              type="submit"
              variant="primary"
              size="md"
              disabled={loading}
              icon={Save}
            >
              {loading ? 'Saving Post...' : isEditing ? 'Update Article' : 'Publish Article'}
            </ClayButton>
          </div>
        </form>
      ) : (
        /* Live Preview Tab */
        <div className="mint-card p-6 sm:p-8 space-y-6">
          <div className="space-y-3 border-b border-[#90CAF9] pb-4">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] uppercase">
              {formData.category}
            </span>
            <h1 className="text-3xl font-extrabold text-[#0D47A1] font-serif">
              {formData.title || 'Untitled Post'}
            </h1>
            <p className="text-xs text-[#0D47A1]/80">By {formData.author} • {formData.read_time}</p>
          </div>

          {formData.thumbnail_url && (
            <img src={formData.thumbnail_url} alt="" className="w-full h-64 object-cover rounded-2xl border border-[#90CAF9]" />
          )}

          <div className="text-[#0D47A1] text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
            {formData.content || 'Start typing in the editor to see live rendering preview...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
