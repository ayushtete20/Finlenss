import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchArticleById,
  createArticle,
  updateArticle,
  isAdminLoggedIn,
  fetchCategories,
  uploadFile,
  uploadImage,
  createCertification
} from '../../../services/api';
import {
  ArrowLeft,
  Save,
  Eye,
  FileEdit,
  Sparkles,
  Image as ImageIcon,
  CheckCircle,
  Upload,
  FileSpreadsheet,
  Paperclip,
  Award,
  Check,
  Link2,
  UploadCloud,
  X,
  PlusCircle,
  Maximize2,
  RefreshCw,
  FileImage,
  ExternalLink
} from 'lucide-react';
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

  // Picture posting state: 'upload' | 'link'
  const [imageMode, setImageMode] = useState('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageName, setUploadedImageName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const imageFileInputRef = useRef(null);

  // In-body image inserter state
  const [showInBodyImageModal, setShowInBodyImageModal] = useState(false);
  const [inBodyImageMode, setInBodyImageMode] = useState('upload');
  const [inBodyImageUrl, setInBodyImageUrl] = useState('');
  const [inBodyImageAlt, setInBodyImageAlt] = useState('');
  const [inBodyUploading, setInBodyUploading] = useState(false);
  const contentTextareaRef = useRef(null);

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
    { label: 'Financial Valuation', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Banking & Global Economy', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80' }
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
            if (data.article.thumbnail_url) {
              if (data.article.thumbnail_url.startsWith('http')) {
                setImageMode('link');
              } else {
                setImageMode('upload');
              }
            }
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

  // Direct Picture File Upload Handler
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      alert('Please select an image file (.png, .jpg, .jpeg, .webp, .svg, .gif).');
      return;
    }
    setUploadingImage(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnail_url: result.url }));
      setUploadedImageName(result.originalName || file.name);
    } catch (err) {
      alert('Picture upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  // In-body image upload and insertion
  const handleInBodyImageUpload = async (file) => {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    setInBodyUploading(true);
    try {
      const result = await uploadImage(file);
      setInBodyImageUrl(result.url);
      if (!inBodyImageAlt) {
        setInBodyImageAlt(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setInBodyUploading(false);
    }
  };

  const insertInBodyImage = () => {
    if (!inBodyImageUrl) {
      alert('Please provide an image link or upload a file first.');
      return;
    }
    const altText = inBodyImageAlt.trim() || 'Article chart / visual';
    const markdownImg = `\n\n![${altText}](${inBodyImageUrl})\n*${altText}*\n\n`;

    setFormData(prev => ({
      ...prev,
      content: prev.content ? `${prev.content}${markdownImg}` : markdownImg.trimStart()
    }));

    setShowInBodyImageModal(false);
    setInBodyImageUrl('');
    setInBodyImageAlt('');
  };

  const handleCertificationDocUpload = async (e) => {
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
      <div className="py-24 text-center text-slate-400 font-semibold flex items-center justify-center gap-2">
        <RefreshCw className="w-5 h-5 animate-spin text-[#2196F3]" /> Loading article editor...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-4">
        <div>
          <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs text-[#0D47A1]/80 hover:text-[#2196F3] mb-2 font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D47A1] font-serif">
            {isEditing ? 'Edit Published Article' : 'Create New Financial Post'}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 rounded-xl bg-white border border-[#90CAF9] text-xs font-semibold shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'write' ? 'bg-[#0D47A1] text-white font-bold shadow-xs' : 'text-[#0D47A1]/70 hover:text-[#0D47A1]'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview' ? 'bg-[#0D47A1] text-white font-bold shadow-xs' : 'text-[#0D47A1]/70 hover:text-[#0D47A1]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
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

          {/* ========================================================================= */}
          {/* ARTICLE PICTURE / COVER IMAGE OPTION: DIRECT FILE UPLOAD OR LINK        */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-2xl bg-[#E3F2FD]/40 border-2 border-[#90CAF9] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#90CAF9]/60 pb-3">
              <div>
                <span className="text-xs font-extrabold text-[#0D47A1] uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#2196F3]" /> Article Cover Picture / Image
                </span>
                <p className="text-[11px] text-[#0D47A1]/70">
                  Post a picture with this article using a direct file upload from your device or an image link.
                </p>
              </div>

              {/* Mode Selector Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#90CAF9] shadow-2xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setImageMode('upload')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    imageMode === 'upload'
                      ? 'bg-[#0D47A1] text-white shadow-xs'
                      : 'text-[#0D47A1] hover:bg-[#E3F2FD]'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" /> Direct File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('link')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    imageMode === 'link'
                      ? 'bg-[#0D47A1] text-white shadow-xs'
                      : 'text-[#0D47A1] hover:bg-[#E3F2FD]'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" /> Image Link / URL
                </button>
              </div>
            </div>

            {/* Mode 1: Direct File Upload */}
            {imageMode === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    dragOver
                      ? 'border-[#2196F3] bg-[#E3F2FD]'
                      : 'border-[#90CAF9] bg-white hover:bg-[#E3F2FD]/30'
                  }`}
                  onClick={() => imageFileInputRef.current && imageFileInputRef.current.click()}
                >
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-[#E3F2FD] border border-[#90CAF9] flex items-center justify-center text-[#2196F3] mb-3 shadow-xs">
                    {uploadingImage ? (
                      <RefreshCw className="w-6 h-6 animate-spin text-[#0D47A1]" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>

                  <span className="text-xs font-bold text-[#0D47A1]">
                    {uploadingImage ? 'Uploading Picture...' : 'Click to Browse or Drag & Drop Picture File'}
                  </span>
                  <span className="text-[10px] text-[#0D47A1]/60 mt-1">
                    Supports PNG, JPG, JPEG, WEBP, SVG, GIF (Cloud storage &amp; high-res preserved)
                  </span>

                  <button
                    type="button"
                    disabled={uploadingImage}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#2196F3] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Choose Picture File'}</span>
                  </button>
                </div>

                {uploadedImageName && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                    <span className="flex items-center gap-2 truncate font-mono">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      Uploaded: {uploadedImageName}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImageName('');
                        setFormData(prev => ({ ...prev, thumbnail_url: '' }));
                      }}
                      className="text-rose-600 hover:text-rose-800 text-[11px] font-bold ml-2 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mode 2: Image Link / URL */}
            {imageMode === 'link' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider">
                      Paste Picture Web Link (URL)
                    </label>
                    <span className="text-[10px] text-[#2196F3]">Click quick presets below to auto-fill</span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      name="thumbnail_url"
                      placeholder="https://images.unsplash.com/... or https://..."
                      value={formData.thumbnail_url}
                      onChange={handleChange}
                      className="w-full pl-3 pr-10 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] font-mono focus:outline-none focus:border-[#2196F3]"
                    />
                    {formData.thumbnail_url && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-rose-600"
                        title="Clear URL"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#0D47A1]/60 tracking-wider">
                    Quick Financial Cover Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {presetImages.map((p, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: p.url }))}
                        className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white text-[#0D47A1] border border-[#90CAF9] hover:border-[#2196F3] hover:text-[#2196F3] transition-all cursor-pointer shadow-2xs"
                      >
                        + {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Active Picture Live Preview Card */}
            {formData.thumbnail_url && (
              <div className="pt-3 border-t border-[#90CAF9]/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#0D47A1] uppercase tracking-wider flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Active Post Cover Picture:
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                    className="text-[11px] text-rose-600 hover:underline font-bold"
                  >
                    Remove Picture
                  </button>
                </div>
                <div className="relative rounded-xl overflow-hidden border-2 border-[#90CAF9] max-h-48 bg-slate-900 group shadow-sm">
                  <img
                    src={formData.thumbnail_url}
                    alt="Article cover"
                    className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-[#0D47A1]/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    Cover Preview
                  </div>
                </div>
              </div>
            )}
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

          {/* Full Markdown Content Body with Image Inserter Toolbar */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
                Full Content Article Body (Markdown supported) *
              </label>

              {/* In-Body Picture Inserter Tool */}
              <button
                type="button"
                onClick={() => setShowInBodyImageModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] hover:bg-[#90CAF9]/40 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
                title="Add charts, diagrams, or visual pictures inside the markdown article body"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#2196F3]" />
                <span>Insert Picture Into Body</span>
              </button>
            </div>

            <textarea
              ref={contentTextareaRef}
              name="content"
              rows={12}
              placeholder="# Article Headline&#10;&#10;Write your in-depth financial analysis here using Markdown headers (#), lists (-), charts, and paragraphs..."
              value={formData.content}
              onChange={handleChange}
              className="w-full p-4 text-xs font-mono rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] leading-relaxed focus:outline-none focus:border-[#2196F3]"
              required
            />
          </div>

          {/* In-Body Image Inserter Modal */}
          {showInBodyImageModal && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <FileImage className="w-4 h-4 text-indigo-600" /> Insert In-Body Picture / Chart
                </span>
                <button
                  type="button"
                  onClick={() => setShowInBodyImageModal(false)}
                  className="p-1 rounded-full text-indigo-800 hover:bg-indigo-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInBodyImageMode('upload')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        inBodyImageMode === 'upload' ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setInBodyImageMode('link')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        inBodyImageMode === 'link' ? 'bg-indigo-700 text-white' : 'bg-white text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      Paste URL
                    </button>
                  </div>

                  {inBodyImageMode === 'upload' ? (
                    <label className="block p-3 rounded-xl bg-white border border-indigo-200 text-center cursor-pointer hover:bg-indigo-50 text-xs font-semibold text-indigo-900">
                      <span>{inBodyUploading ? 'Uploading...' : 'Choose In-Body Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleInBodyImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://..."
                      value={inBodyImageUrl}
                      onChange={(e) => setInBodyImageUrl(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl border border-indigo-200 bg-white text-indigo-950 font-mono"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-indigo-950">
                    Picture Caption / Alt Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FY26 Revenue Growth Model Chart"
                    value={inBodyImageAlt}
                    onChange={(e) => setInBodyImageAlt(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-indigo-200 bg-white text-indigo-950"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={insertInBodyImage}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Insert into Article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  <Award className="w-4 h-4 text-[#2196F3]" /> Link to License &amp; Certification Credential
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
                        onChange={handleCertificationDocUpload}
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
            <img
              src={formData.thumbnail_url}
              alt=""
              className="w-full h-64 object-cover rounded-2xl border border-[#90CAF9]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80';
              }}
            />
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
