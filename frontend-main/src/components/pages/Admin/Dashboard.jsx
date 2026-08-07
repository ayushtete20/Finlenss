import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchArticles,
  deleteArticle,
  isAdminLoggedIn,
  fetchSiteStats,
  toggleArticleTrending,
  fetchCategories,
  createCategory,
  deleteCategory,
  fetchConsultations,
  updateConsultationStatus,
  deleteConsultation,
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadFile
} from '../../../services/api';
import { Plus, Edit3, Trash2, Search, Eye, FileText, BarChart3, AlertCircle, Sparkles, CheckCircle2, TrendingUp, Users, Flame, FolderPlus, Tag, Calendar, Mail, Phone, MessageSquare, Clock, Filter, Inbox, ShieldCheck, Award, FileSpreadsheet, Upload, Paperclip, BadgeCheck, ExternalLink, X, Database } from 'lucide-react';
import ClayButton from '../../UI/ClayButton';

const backendUrl = import.meta.env.VITE_API_URL || '';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'consultations' | 'certifications'
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ total_visits: 0, total_clicks: 0 });
  const [categoriesList, setCategoriesList] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [catAdding, setCatAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  
  // Consultation lead management state
  const [consultations, setConsultations] = useState([]);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  const [consultationSearch, setConsultationSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteConsultationTarget, setDeleteConsultationTarget] = useState(null);

  // License & Certification management state
  const [certificationsList, setCertificationsList] = useState([]);
  const [certificationsLoading, setCertificationsLoading] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    dates: '',
    article_id: '',
    excel_url: '',
    excel_name: '',
    cert_doc_url: '',
    cert_doc_name: ''
  });
  const [uploadingExcel, setUploadingExcel] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [deleteCertTarget, setDeleteCertTarget] = useState(null);

  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    loadData();
    loadCategories();
    loadConsultationsData();
    loadCertificationsData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchArticles();
      setArticles(data.articles || []);
      const siteStats = await fetchSiteStats();
      if (siteStats) {
        setStats(siteStats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategoriesList(data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadConsultationsData = async () => {
    setConsultationsLoading(true);
    try {
      const data = await fetchConsultations();
      setConsultations(data.consultations || []);
    } catch (err) {
      console.error('Failed to load consultations:', err);
    } finally {
      setConsultationsLoading(false);
    }
  };

  const handleStatusChange = async (consultationId, newStatus) => {
    try {
      await updateConsultationStatus(consultationId, newStatus);
      setNotification(`Consultation #${consultationId} status updated to "${newStatus}"!`);
      loadConsultationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to update consultation status: ' + err.message);
    }
  };

  const handleDeleteConsultation = async (id) => {
    try {
      await deleteConsultation(id);
      setNotification('Consultation reservation record deleted successfully!');
      setDeleteConsultationTarget(null);
      loadConsultationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to delete consultation: ' + err.message);
    }
  };

  const loadCertificationsData = async () => {
    setCertificationsLoading(true);
    try {
      const data = await fetchCertifications();
      setCertificationsList(data.certifications || []);
    } catch (err) {
      console.error('Failed to load certifications:', err);
    } finally {
      setCertificationsLoading(false);
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingExcel(true);
    try {
      const result = await uploadFile(file);
      setCertForm(prev => ({ ...prev, excel_url: result.url, excel_name: result.originalName || file.name }));
    } catch (err) {
      alert('Excel upload failed: ' + err.message);
    } finally {
      setUploadingExcel(false);
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDoc(true);
    try {
      const result = await uploadFile(file);
      setCertForm(prev => ({ ...prev, cert_doc_url: result.url, cert_doc_name: result.originalName || file.name }));
    } catch (err) {
      alert('Certificate upload failed: ' + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const openCreateCertModal = () => {
    setEditingCert(null);
    setCertForm({
      title: '',
      issuer: '',
      dates: '',
      article_id: '',
      excel_url: '',
      excel_name: '',
      cert_doc_url: '',
      cert_doc_name: ''
    });
    setShowCertModal(true);
  };

  const openEditCertModal = (cert) => {
    setEditingCert(cert);
    setCertForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      dates: cert.dates || '',
      article_id: cert.article_id || '',
      excel_url: cert.excel_url || '',
      excel_name: cert.excel_name || '',
      cert_doc_url: cert.cert_doc_url || '',
      cert_doc_name: cert.cert_doc_name || ''
    });
    setShowCertModal(true);
  };

  const handleSaveCertification = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      alert('Title and Issuer are required.');
      return;
    }

    try {
      // Find linked article details if selected
      const linkedArt = articles.find(a => a.id === parseInt(certForm.article_id));

      const payload = {
        title: certForm.title,
        issuer: certForm.issuer,
        dates: certForm.dates,
        icon: 'Award',
        article_id: certForm.article_id ? parseInt(certForm.article_id) : null,
        article_title: linkedArt ? linkedArt.title : '',
        article_content: linkedArt ? (linkedArt.excerpt || linkedArt.content.slice(0, 200)) : '',
        excel_url: certForm.excel_url,
        excel_name: certForm.excel_name,
        cert_doc_url: certForm.cert_doc_url,
        cert_doc_name: certForm.cert_doc_name,
        status: 'Verified'
      };

      if (editingCert) {
        await updateCertification(editingCert.id, payload);
        setNotification(`Certification "${certForm.title}" updated successfully!`);
      } else {
        await createCertification(payload);
        setNotification(`Certification "${certForm.title}" created successfully!`);
      }

      setShowCertModal(false);
      loadCertificationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to save certification: ' + err.message);
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      await deleteCertification(id);
      setNotification('Certification credential deleted successfully!');
      setDeleteCertTarget(null);
      loadCertificationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to delete certification: ' + err.message);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCatAdding(true);
    try {
      await createCategory(newCatName.trim());
      setNotification(`Category "${newCatName.trim()}" created successfully!`);
      setNewCatName('');
      loadCategories();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(err.message || 'Failed to create category');
    } finally {
      setCatAdding(false);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await deleteCategory(catId);
      setNotification(`Category "${catName}" deleted successfully!`);
      loadCategories();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleToggleTrending = async (article) => {
    try {
      const newStatus = !article.is_trending;
      await toggleArticleTrending(article.id, newStatus);
      setNotification(`"${article.title.slice(0, 30)}..." ${newStatus ? 'pinned as Trending!' : 'removed from pinned Trending.'}`);
      loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      alert('Failed to update trending status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteArticle(id);
      setNotification('Article deleted successfully!');
      setDeleteTarget(null);
      loadData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to delete article: ' + err.message);
    }
  };

  const filteredArticles = (articles || []).filter(art =>
    art &&
    ((art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (art.category && art.category.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredConsultations = (consultations || []).filter(item => {
    if (!item) return false;
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(consultationSearch.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(consultationSearch.toLowerCase())) ||
      (item.phone && item.phone.toLowerCase().includes(consultationSearch.toLowerCase())) ||
      (item.topic && item.topic.toLowerCase().includes(consultationSearch.toLowerCase())) ||
      (item.message && item.message.toLowerCase().includes(consultationSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalViews = (articles || []).reduce((acc, curr) => acc + (curr?.views || 0), 0);
  const categoriesCount = (categoriesList || []).length || new Set((articles || []).map(a => a?.category)).size;
  const pendingConsultationsCount = (consultations || []).filter(c => c?.status === 'Pending').length;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" /> Owner Management Control Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D47A1] font-serif">
            {activeTab === 'articles' ? 'Article Operations & Insights' : activeTab === 'consultations' ? 'Consultation Lead Reservations' : 'Licenses & Certifications Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-[#0D47A1]/80">
            {activeTab === 'articles' 
              ? 'Publish, edit, monitor traffic clicks, manage dynamic insight topics, and customize trending articles.'
              : activeTab === 'consultations'
              ? 'Review executive advisory requests, connect with clients, update lead status, and manage reservations.'
              : 'Manage accredited license credentials, link articles, and attach downloadable Excel models or documents.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'certifications' && (
            <ClayButton variant="primary" size="md" icon={Plus} onClick={openCreateCertModal}>
              Add New Certification
            </ClayButton>
          )}
          <Link to="/admin/seed">
            <button className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs">
              <Database className="w-3.5 h-3.5 text-rose-600" /> Supabase Seed Tool
            </button>
          </Link>
          <Link to="/admin/editor">
            <ClayButton variant="secondary" size="md" icon={Plus}>
              Create New Article
            </ClayButton>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#90CAF9]/80 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'articles'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles & Topics</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
            {articles.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'consultations'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Consultation Reservations</span>
          {pendingConsultationsCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 animate-pulse">
              {pendingConsultationsCount} NEW
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'consultations' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
              {consultations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
            activeTab === 'certifications'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Licenses & Certifications</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'certifications' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
            {certificationsList.length}
          </span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm flex items-center gap-3 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Overview Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D47A1] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{(stats.total_visits || 0).toLocaleString()}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Total Website Visits</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2196F3] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{totalViews.toLocaleString()}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Article Views</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D47A1] flex items-center justify-center text-white shrink-0 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{articles.length}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Published Articles</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2196F3] flex items-center justify-center text-white shrink-0 shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{categoriesCount}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Insight Topics</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3 border border-amber-300 bg-amber-50/50">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{consultations.length}</span>
            <span className="block text-[10px] text-amber-900 font-bold uppercase tracking-wider">
              Leads ({pendingConsultationsCount} Pending)
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: ARTICLES & INSIGHT TOPICS MANAGER */}
      {activeTab === 'articles' && (
        <>
          {/* Insight Domain Categories Management Card */}
          <div className="mint-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#0D47A1] font-serif flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#2196F3]" /> Insight Topics & Category Manager
                </h2>
                <p className="text-xs text-[#0D47A1]/80">
                  Add or remove insight topic categories (e.g. Stocks, Cryptocurrency, Macroeconomics).
                </p>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="e.g. Cryptocurrency..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="px-3.5 py-2 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3] w-full sm:w-60"
                />
                <button
                  type="submit"
                  disabled={catAdding || !newCatName.trim()}
                  className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white hover:bg-[#2196F3] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm disabled:opacity-50"
                >
                  <FolderPlus className="w-4 h-4" />
                  {catAdding ? 'Adding...' : 'Add Topic'}
                </button>
              </form>
            </div>

            {/* Categories Badges Grid */}
            <div className="flex flex-wrap gap-3 pt-1">
              {categoriesList.length > 0 ? (
                categoriesList.map((cat) => {
                  const count = articles.filter(a => a.category?.toLowerCase() === cat.name?.toLowerCase()).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] text-xs font-bold shadow-sm hover:border-[#2196F3] transition-all"
                    >
                      <span className="font-semibold">{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#0D47A1] font-mono border border-[#90CAF9]/60">
                        {count} {count === 1 ? 'post' : 'posts'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1 rounded-full text-rose-600 hover:bg-rose-100 transition-colors"
                        title={`Delete category "${cat.name}"`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-[#0D47A1]/60 italic">No custom categories created yet.</span>
              )}
            </div>
          </div>

          {/* Data Table Container */}
          <div className="mint-card overflow-hidden">
            {/* Table Controls Header */}
            <div className="p-4 border-b border-[#90CAF9] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#0D47A1]/50" />
                <input
                  type="text"
                  placeholder="Search table articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/50 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              <span className="text-xs text-[#0D47A1]/80">
                Showing <strong className="text-[#0D47A1]">{filteredArticles.length}</strong> of {articles.length} posts
              </span>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="py-16 text-center text-[#0D47A1]/60 text-sm">Loading articles database...</div>
            ) : filteredArticles.length === 0 ? (
              <div className="py-16 text-center text-[#0D47A1]/60 text-sm">No articles match your search query.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#0D47A1]">
                  <thead className="bg-[#E3F2FD] text-[#0D47A1] font-serif uppercase tracking-wider text-[11px] border-b border-[#90CAF9]">
                    <tr>
                      <th className="py-3.5 px-4">Article Title</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-center">Article Clicks</th>
                      <th className="py-3.5 px-4 text-center">Trending Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#90CAF9]/60">
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-[#E3F2FD]/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-[#0D47A1] max-w-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={article.thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#90CAF9]"
                            />
                            <div>
                              <Link to={`/post/${article.id}`} className="hover:text-[#2196F3] font-semibold line-clamp-1">
                                {article.title}
                              </Link>
                              <span className="text-[10px] text-[#0D47A1]/70 line-clamp-1">{article.excerpt}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]">
                            {article.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#2196F3]">
                          <span className="px-2.5 py-1 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
                            👁️ {article.views || 0} visits
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleTrending(article)}
                            title={article.is_trending ? 'Click to unpin from Trending' : 'Click to pin as Owner Trending'}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all border ${
                              article.is_trending
                                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md hover:bg-amber-300'
                                : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
                            }`}
                          >
                            <Flame className={`w-3.5 h-3.5 ${article.is_trending ? 'fill-slate-950 text-slate-950' : 'text-[#0D47A1]'}`} />
                            {article.is_trending ? 'Pinned Trending' : 'Auto Rank'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-[#0D47A1]/80">
                          {new Date(article.created_at || Date.now()).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link to={`/admin/editor/${article.id}`}>
                            <button className="p-1.5 rounded-lg bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#90CAF9]/40 border border-[#90CAF9] transition-colors" title="Edit Article">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(article)}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: CONSULTATION RESERVATIONS LEAD MANAGEMENT */}
      {activeTab === 'consultations' && (
        <div className="mint-card overflow-hidden space-y-4">
          {/* Controls Bar: Search & Status Filter */}
          <div className="p-5 border-b border-[#90CAF9] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#0D47A1]/50" />
                <input
                  type="text"
                  placeholder="Search client name, email, topic, or notes..."
                  value={consultationSearch}
                  onChange={(e) => setConsultationSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/50 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#E3F2FD]/60 p-1 rounded-xl border border-[#90CAF9] text-xs w-full sm:w-auto overflow-x-auto">
                {['All', 'Pending', 'Contacted', 'Scheduled', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      statusFilter === status
                        ? 'bg-[#0D47A1] text-white shadow-xs'
                        : 'text-[#0D47A1] hover:bg-[#90CAF9]/30'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-[#0D47A1]/80">
              Showing <strong className="text-[#0D47A1]">{filteredConsultations.length}</strong> of {consultations.length} reservations
            </span>
          </div>

          {/* Consultation Lead Table */}
          {consultationsLoading ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm">Loading consultation reservations...</div>
          ) : filteredConsultations.length === 0 ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm flex flex-col items-center gap-2">
              <Inbox className="w-8 h-8 text-[#0D47A1]/40" />
              <span>No consultation requests found matching your filter.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0D47A1]">
                <thead className="bg-[#E3F2FD] text-[#0D47A1] font-serif uppercase tracking-wider text-[11px] border-b border-[#90CAF9]">
                  <tr>
                    <th className="py-3.5 px-4">Client Name & Details</th>
                    <th className="py-3.5 px-4">Advisory Domain</th>
                    <th className="py-3.5 px-4">Inquiry / Project Scope</th>
                    <th className="py-3.5 px-4 text-center">Status Lead Control</th>
                    <th className="py-3.5 px-4">Submitted Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#90CAF9]/60">
                  {filteredConsultations.map((item) => (
                    <tr key={item.id} className="hover:bg-[#E3F2FD]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="block font-bold text-sm text-[#0D47A1]">{item.name}</span>
                          <div className="flex items-center gap-3 text-[11px] text-[#0D47A1]/80 mt-1">
                            <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-[#2196F3] font-medium">
                              <Mail className="w-3 h-3 text-[#2196F3]" /> {item.email}
                            </a>
                            {item.phone && (
                              <a href={`tel:${item.phone}`} className="flex items-center gap-1 hover:text-[#2196F3] font-medium">
                                <Phone className="w-3 h-3 text-[#2196F3]" /> {item.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9]">
                          {item.topic || 'General Advisory'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="text-xs text-[#0D47A1]/90 bg-[#E3F2FD]/30 p-2.5 rounded-lg border border-[#90CAF9]/40 font-sans line-clamp-3">
                          {item.message || <em className="text-[#0D47A1]/50">No additional message provided.</em>}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={item.status || 'Pending'}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer focus:outline-none transition-all ${
                            item.status === 'Pending'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : item.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : item.status === 'Scheduled'
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Contacted">📞 Contacted</option>
                          <option value="Scheduled">📅 Scheduled</option>
                          <option value="Completed">✅ Completed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-[#0D47A1]/80 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-[#2196F3]" />
                          {new Date(item.created_at || Date.now()).toLocaleDateString()}{' '}
                          {new Date(item.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteConsultationTarget(item)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Delete Reservation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Article Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/40 backdrop-blur-sm">
          <div className="bg-white border border-[#90CAF9] p-6 max-w-md w-full space-y-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#0D47A1] font-serif">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-[#0D47A1]/80">
              Are you sure you want to permanently delete article: <strong className="text-[#0D47A1]">"{deleteTarget.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <ClayButton variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </ClayButton>
              <ClayButton variant="danger" size="sm" onClick={() => handleDelete(deleteTarget.id)}>
                Delete Article
              </ClayButton>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LICENSES & CERTIFICATIONS MANAGER */}
      {activeTab === 'certifications' && (
        <div className="mint-card overflow-hidden space-y-4">
          <div className="p-5 border-b border-[#90CAF9] flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#0D47A1] font-serif flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2196F3]" /> Verified Licenses & Certifications
              </h2>
              <p className="text-xs text-[#0D47A1]/80">
                Manage professional credentials, attach financial model Excel files or PDFs, and link case study articles.
              </p>
            </div>

            <button
              onClick={openCreateCertModal}
              className="px-4 py-2.5 rounded-xl bg-[#0D47A1] text-white hover:bg-[#2196F3] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>

          {certificationsLoading ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm">Loading credentials...</div>
          ) : certificationsList.length === 0 ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm flex flex-col items-center gap-2">
              <Award className="w-8 h-8 text-[#0D47A1]/40" />
              <span>No license credentials registered yet.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0D47A1]">
                <thead className="bg-[#E3F2FD] text-[#0D47A1] font-serif uppercase tracking-wider text-[11px] border-b border-[#90CAF9]">
                  <tr>
                    <th className="py-3.5 px-4">Credential & Issuer</th>
                    <th className="py-3.5 px-4">Validity Period</th>
                    <th className="py-3.5 px-4">Linked Financial Article</th>
                    <th className="py-3.5 px-4 text-center">Attached Model / Document</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#90CAF9]/60">
                  {certificationsList.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#E3F2FD]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sm text-[#0D47A1]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#0D47A1] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="block font-extrabold text-xs text-[#0D47A1]">{cert.title}</span>
                            <span className="text-[11px] text-[#2196F3] font-semibold">{cert.issuer}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-mono text-[#0D47A1]/80">
                        {cert.dates || 'Verified Credential'}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        {cert.article_id ? (
                          <Link
                            to={`/post/${cert.article_id}`}
                            className="text-[#2196F3] hover:underline font-bold text-xs flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="line-clamp-1">{cert.article_title || `Article #${cert.article_id}`}</span>
                          </Link>
                        ) : (
                          <span className="text-[11px] text-[#0D47A1]/50 italic">No article linked</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col gap-1 items-center">
                          {(cert.excel_url || cert.attachment_url) && (
                            <a
                              href={(cert.excel_url || cert.attachment_url).startsWith('/uploads') ? `${backendUrl}${cert.excel_url || cert.attachment_url}` : (cert.excel_url || cert.attachment_url)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition-all shadow-2xs"
                            >
                              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Model (.xlsx)</span>
                            </a>
                          )}
                          {cert.cert_doc_url && (
                            <a
                              href={cert.cert_doc_url.startsWith('/uploads') ? `${backendUrl}${cert.cert_doc_url}` : cert.cert_doc_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 hover:bg-blue-200 transition-all shadow-2xs"
                            >
                              <Award className="w-3.5 h-3.5 text-[#2196F3]" />
                              <span>Certificate</span>
                            </a>
                          )}
                          {!cert.excel_url && !cert.attachment_url && !cert.cert_doc_url && (
                            <span className="text-[11px] text-[#0D47A1]/50 italic">No files attached</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditCertModal(cert)}
                          className="p-1.5 rounded-lg bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#90CAF9]/40 border border-[#90CAF9] transition-colors"
                          title="Edit Credential"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCertTarget(cert)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Delete Credential"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Consultation Lead Modal */}
      {deleteConsultationTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/40 backdrop-blur-sm">
          <div className="bg-white border border-[#90CAF9] p-6 max-w-md w-full space-y-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#0D47A1] font-serif">Confirm Lead Record Deletion</h3>
            </div>
            <p className="text-xs text-[#0D47A1]/80">
              Are you sure you want to delete consultation reservation for client <strong className="text-[#0D47A1]">"{deleteConsultationTarget.name}"</strong> ({deleteConsultationTarget.email})?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <ClayButton variant="secondary" size="sm" onClick={() => setDeleteConsultationTarget(null)}>
                Cancel
              </ClayButton>
              <ClayButton variant="danger" size="sm" onClick={() => handleDeleteConsultation(deleteConsultationTarget.id)}>
                Delete Lead Record
              </ClayButton>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#90CAF9] p-6 sm:p-8 max-w-xl w-full space-y-6 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCertModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#0D47A1]/60 hover:bg-[#E3F2FD] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-[#90CAF9] pb-3 pr-8">
              <h3 className="text-xl font-extrabold text-[#0D47A1] font-serif">
                {editingCert ? 'Edit Certification Credential' : 'Add New License & Certification'}
              </h3>
              <p className="text-xs text-[#0D47A1]/80">
                Attach financial model Excel workbooks or documents and link published case study articles.
              </p>
            </div>

            <form onSubmit={handleSaveCertification} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                  Certification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Equity valuation and Financial modelling"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/30 text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Caplexus Capital / PwC India"
                    value={certForm.issuer}
                    onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/30 text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                    Validity Dates
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Issued Jul 2026 – Expires Jul 2030"
                    value={certForm.dates}
                    onChange={(e) => setCertForm({ ...certForm, dates: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/30 text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
              </div>

              {/* Link Article Selection */}
              <div>
                <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider mb-1">
                  Link to Published Article (Optional)
                </label>
                <select
                  value={certForm.article_id}
                  onChange={(e) => setCertForm({ ...certForm, article_id: e.target.value })}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3] cursor-pointer"
                >
                  <option value="">-- No Article Link --</option>
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      #{art.id} - {art.title} ({art.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* UPLOAD SECTION — Two separate boxes */}
              <div className="space-y-4 pt-2 border-t border-[#90CAF9]/60">

                {/* Box 1: Excel / Financial Model */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Financial Model (Excel)
                    <span className="ml-auto text-[10px] font-mono text-emerald-600 normal-case">.xlsx, .xls, .csv</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>{uploadingExcel ? 'Uploading...' : 'Upload Excel Model'}</span>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleExcelUpload}
                        disabled={uploadingExcel}
                        className="hidden"
                      />
                    </label>

                    {certForm.excel_name ? (
                      <div className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-mono flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold truncate">{certForm.excel_name}</span>
                        <button type="button" onClick={() => setCertForm(p => ({...p, excel_url:'', excel_name:''}))} className="ml-auto text-rose-500 hover:text-rose-700"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-700/60 italic">No Excel file yet.</span>
                    )}
                  </div>
                </div>

                {/* Box 2: Certificate Document (PDF / Image) */}
                <div className="p-3.5 rounded-xl bg-blue-50 border border-[#90CAF9] space-y-2">
                  <label className="block text-xs font-bold text-[#0D47A1] uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#2196F3]" /> Certificate Document
                    <span className="ml-auto text-[10px] font-mono text-[#2196F3]/70 normal-case">.pdf, .jpg, .png, .docx</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="px-3.5 py-2 rounded-xl bg-white border border-[#90CAF9] text-[#0D47A1] hover:bg-[#E3F2FD] font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-[#2196F3]" />
                      <span>{uploadingDoc ? 'Uploading...' : 'Upload Certificate'}</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                        onChange={handleDocUpload}
                        disabled={uploadingDoc}
                        className="hidden"
                      />
                    </label>

                    {certForm.cert_doc_name ? (
                      <div className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-[#90CAF9] text-[#0D47A1] text-xs font-mono flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-[#2196F3] shrink-0" />
                        <span className="font-bold truncate">{certForm.cert_doc_name}</span>
                        <button type="button" onClick={() => setCertForm(p => ({...p, cert_doc_url:'', cert_doc_name:''}))} className="ml-auto text-rose-500 hover:text-rose-700"><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#0D47A1]/60 italic">No certificate file yet.</span>
                    )}
                  </div>

                  {/* Visual Image Preview inside the form modal */}
                  {certForm.cert_doc_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(certForm.cert_doc_url) && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-[#90CAF9] bg-white p-1 max-w-xs shadow-sm">
                      <img 
                        src={certForm.cert_doc_url.startsWith('/uploads') ? `${backendUrl}${certForm.cert_doc_url}` : certForm.cert_doc_url} 
                        alt="Certificate Preview" 
                        className="w-full h-32 object-contain bg-slate-50"
                      />
                    </div>
                  )}
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#90CAF9]">
                <ClayButton variant="secondary" size="sm" type="button" onClick={() => setShowCertModal(false)}>
                  Cancel
                </ClayButton>
                <ClayButton variant="primary" size="sm" type="submit">
                  {editingCert ? 'Update Credential' : 'Save Certification'}
                </ClayButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Certification Modal */}
      {deleteCertTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D47A1]/40 backdrop-blur-sm">
          <div className="bg-white border border-[#90CAF9] p-6 max-w-md w-full space-y-4 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#0D47A1] font-serif">Confirm Credential Deletion</h3>
            </div>
            <p className="text-xs text-[#0D47A1]/80">
              Are you sure you want to delete license credential: <strong className="text-[#0D47A1]">"{deleteCertTarget.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <ClayButton variant="secondary" size="sm" onClick={() => setDeleteCertTarget(null)}>
                Cancel
              </ClayButton>
              <ClayButton variant="danger" size="sm" onClick={() => handleDeleteCertification(deleteCertTarget.id)}>
                Delete Credential
              </ClayButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
