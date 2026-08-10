import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchArticles,
  createArticle,
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
  fetchCollaborations,
  updateCollaborationStatus,
  deleteCollaboration,
  fetchFeedback,
  deleteFeedback,
  fetchAllComments,
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadFile,
  uploadImage,
  resetAllCounters,
  resetArticleViews,
  removeAuthToken
} from '../../../services/api';
import { supabase } from '../../../utils/supabaseClient';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  FileText,
  BarChart3,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Users,
  Flame,
  FolderPlus,
  Tag,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Filter,
  Inbox,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  Upload,
  Paperclip,
  BadgeCheck,
  ExternalLink,
  X,
  Database,
  RefreshCw,
  Heart,
  MessageCircle,
  Star,
  MessageSquareHeart,
  Briefcase,
  Image as ImageIcon,
  UploadCloud,
  Link2,
  Check,
  FileEdit,
  LogOut
} from 'lucide-react';
import ClayButton from '../../UI/ClayButton';

const backendUrl = import.meta.env.VITE_API_URL || '';

export const Dashboard = () => {
  // Tabs: 'articles' | 'collaborations' | 'feedback' | 'certifications' | 'consultations'
  const [activeTab, setActiveTab] = useState('articles');
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({ total_visits: 0, total_clicks: 0 });
  const [categoriesList, setCategoriesList] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [catAdding, setCatAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Engagement stats (comments & likes)
  const [allComments, setAllComments] = useState([]);
  
  // Section 1 & 3: Collaboration Requests State
  const [collaborations, setCollaborations] = useState([]);
  const [collaborationsLoading, setCollaborationsLoading] = useState(false);
  const [collabSearch, setCollabSearch] = useState('');
  const [collabStatusFilter, setCollabStatusFilter] = useState('All');
  const [deleteCollabTarget, setDeleteCollabTarget] = useState(null);

  // Section 1 & 3: Reader Feedback State
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSearch, setFeedbackSearch] = useState('');
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState('All');
  const [deleteFeedbackTarget, setDeleteFeedbackTarget] = useState(null);

  // Consultation lead management state (backward compatibility)
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

  // Quick Post Article Modal state (with Picture Link & Direct File Upload)
  const [showQuickPostModal, setShowQuickPostModal] = useState(false);
  const [quickPostForm, setQuickPostForm] = useState({
    title: '',
    category: 'Stocks',
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    excerpt: '',
    content: '',
    author: 'Tushar Singh, CFA',
    read_time: '5 min read'
  });
  const [quickPostImageMode, setQuickPostImageMode] = useState('upload'); // 'upload' | 'link'
  const [quickPostUploadingImage, setQuickPostUploadingImage] = useState(false);
  const [quickPostUploadedName, setQuickPostUploadedName] = useState('');
  const [quickPostSubmitting, setQuickPostSubmitting] = useState(false);
  const [quickPostDragOver, setQuickPostDragOver] = useState(false);
  const quickPostFileInputRef = useRef(null);

  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    loadData();
    loadCategories();
    loadCollaborationsData();
    loadFeedbackData();
    loadCommentsData();
    loadConsultationsData();
    loadCertificationsData();
  }, []);

  // ── Supabase Realtime Listener ──────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collaborations' }, () => {
        loadCollaborationsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feedback' }, () => {
        loadFeedbackData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        loadCommentsData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Direct Supabase SDK select query
      const { data: artData, error: artErr } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (!artErr && artData && artData.length > 0) {
        setArticles(artData);
      } else {
        const data = await fetchArticles();
        setArticles(data.articles || []);
      }

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

  // Section 3: Supabase Select Query for Collaboration Requests
  const loadCollaborationsData = async () => {
    setCollaborationsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaborations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setCollaborations(data);
      } else {
        const fallback = await fetchCollaborations();
        setCollaborations(fallback.collaborations || []);
      }
    } catch (err) {
      console.error('Failed to load collaborations:', err);
      const fallback = await fetchCollaborations();
      setCollaborations(fallback.collaborations || []);
    } finally {
      setCollaborationsLoading(false);
    }
  };

  // Section 3: Supabase Select Query for Reader Feedback
  const loadFeedbackData = async () => {
    setFeedbackLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setFeedbackList(data);
      } else {
        const fallback = await fetchFeedback();
        setFeedbackList(fallback.feedback || []);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
      const fallback = await fetchFeedback();
      setFeedbackList(fallback.feedback || []);
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Section 3: Supabase Select Query for Comments
  const loadCommentsData = async () => {
    try {
      const { data, error } = await supabase.from('comments').select('*');
      if (!error && data) {
        setAllComments(data);
      } else {
        const fallback = await fetchAllComments();
        setAllComments(fallback.comments || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
      const fallback = await fetchAllComments();
      setAllComments(fallback.comments || []);
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

  const handleCollabStatusChange = async (collabId, newStatus) => {
    try {
      await updateCollaborationStatus(collabId, newStatus);
      setNotification(`Collaboration #${collabId} status updated to "${newStatus}"!`);
      loadCollaborationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to update collaboration status: ' + err.message);
    }
  };

  const handleDeleteCollaboration = async (id) => {
    try {
      await deleteCollaboration(id);
      setNotification('Collaboration request deleted successfully!');
      setDeleteCollabTarget(null);
      loadCollaborationsData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to delete collaboration: ' + err.message);
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await deleteFeedback(id);
      setNotification('Reader feedback removed successfully!');
      setDeleteFeedbackTarget(null);
      loadFeedbackData();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      alert('Failed to delete feedback: ' + err.message);
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

  const handleResetCounters = async () => {
    if (!window.confirm('Reset all article views, likes, and website visit counters to 0?')) return;
    try {
      await resetAllCounters();
      setNotification('✅ All article views, likes, and website visit counters reset to 0.');
      loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      alert('Failed to reset counters: ' + err.message);
    }
  };

  const handleResetSingleArticleViews = async (article) => {
    if (!window.confirm(`Reset view counter for "${article.title}" to 0?`)) return;
    try {
      await resetArticleViews(article.id);
      setNotification(`✅ View counter for "${article.title}" reset to 0.`);
      loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      alert('Failed to reset article views: ' + err.message);
    }
  };

  const handleQuickPostImageUpload = async (file) => {
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) {
      alert('Please select a valid image file (.png, .jpg, .jpeg, .webp, .svg, .gif)');
      return;
    }
    setQuickPostUploadingImage(true);
    try {
      const res = await uploadImage(file);
      setQuickPostForm(prev => ({ ...prev, thumbnail_url: res.url }));
      setQuickPostUploadedName(res.originalName || file.name);
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setQuickPostUploadingImage(false);
    }
  };

  const handleQuickPostSubmit = async (e) => {
    e.preventDefault();
    if (!quickPostForm.title.trim() || !quickPostForm.content.trim()) {
      alert('Article Title and Content are required fields.');
      return;
    }
    setQuickPostSubmitting(true);
    try {
      await createArticle(quickPostForm);
      setShowQuickPostModal(false);
      setQuickPostForm({
        title: '',
        category: categoriesList[0]?.name || 'Stocks',
        thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
        excerpt: '',
        content: '',
        author: 'Tushar Singh, CFA',
        read_time: '5 min read'
      });
      setQuickPostUploadedName('');
      setNotification('🎉 Financial article published successfully with cover picture!');
      loadData();
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      alert('Failed to post article: ' + err.message);
    } finally {
      setQuickPostSubmitting(false);
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

  // Filtered Articles
  const filteredArticles = (articles || []).filter(art =>
    art &&
    ((art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
     (art.category && art.category.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Filtered Collaborations
  const filteredCollaborations = (collaborations || []).filter(item => {
    if (!item) return false;
    const matchesSearch =
      (item.name && item.name.toLowerCase().includes(collabSearch.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(collabSearch.toLowerCase())) ||
      (item.project_type && item.project_type.toLowerCase().includes(collabSearch.toLowerCase())) ||
      (item.message && item.message.toLowerCase().includes(collabSearch.toLowerCase()));

    const matchesStatus = collabStatusFilter === 'All' || item.status === collabStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Feedback
  const filteredFeedback = (feedbackList || []).filter(item => {
    if (!item) return false;
    const matchesSearch =
      (item.suggestion && item.suggestion.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
      (item.name && item.name.toLowerCase().includes(feedbackSearch.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(feedbackSearch.toLowerCase()));

    const matchesRating =
      feedbackRatingFilter === 'All' || String(item.rating) === String(feedbackRatingFilter);

    return matchesSearch && matchesRating;
  });

  // Compute comment counts per article
  const getCommentCountForArticle = (artId) => {
    return (allComments || []).filter(c => String(c.article_id) === String(artId)).length;
  };

  // Aggregated Stats
  const totalViews = (articles || []).reduce((acc, curr) => acc + (curr?.views || 0), 0);
  const totalLikes = (articles || []).reduce((acc, curr) => acc + (curr?.likes || 0), 0);
  const categoriesCount = (categoriesList || []).length || new Set((articles || []).map(a => a?.category)).size;
  const pendingCollabsCount = (collaborations || []).filter(c => c?.status === 'Pending').length;

  const avgFeedbackRating = feedbackList.length > 0
    ? (feedbackList.reduce((acc, curr) => acc + (curr.rating || 5), 0) / feedbackList.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F2FD] border border-[#90CAF9] text-[#0D47A1] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" /> Owner Management Control Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0D47A1] font-serif">
            {activeTab === 'articles'
              ? 'Article Operations & Insights'
              : activeTab === 'collaborations'
              ? 'Collaboration Requests'
              : activeTab === 'feedback'
              ? 'Reader Feedback & Ratings'
              : 'Licenses & Certifications Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-[#0D47A1]/80">
            {activeTab === 'articles' 
              ? 'Monitor live article likes, comment interactions, traffic views, and trending status.'
              : activeTab === 'collaborations'
              ? 'Manage inbound project collaboration inquiries, project types, and partnership statuses.'
              : activeTab === 'feedback'
              ? 'Review real-time community quality ratings, reader suggestions, and analytical feedback.'
              : 'Manage accredited license credentials, link articles, and attach downloadable Excel models or documents.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {activeTab === 'certifications' && (
            <ClayButton variant="primary" size="md" icon={Plus} onClick={openCreateCertModal}>
              Add New Certification
            </ClayButton>
          )}
          <button
            onClick={() => setShowQuickPostModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0D47A1] text-white hover:bg-[#2196F3] font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            title="Post a new financial article directly with picture link or file upload"
          >
            <Plus className="w-4 h-4" /> Quick Post Article
          </button>
          <button
            onClick={handleResetCounters}
            className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Reset all article views and website visits to 0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" /> Reset Views &amp; Likes
          </button>
          <Link to="/admin/seed">
            <button className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer">
              <Database className="w-3.5 h-3.5 text-rose-600" /> Supabase Seed Tool
            </button>
          </Link>
          <Link to="/admin/editor">
            <ClayButton variant="secondary" size="md" icon={FileEdit}>
              Full Studio Editor
            </ClayButton>
          </Link>
          <button
            onClick={() => {
              removeAuthToken();
              navigate('/admin/login');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#90CAF9]/80 pb-1 overflow-x-auto">
        {/* Tab 1: Articles */}
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer shrink-0 ${
            activeTab === 'articles'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Articles &amp; Stats</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'articles' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
            {articles.length}
          </span>
        </button>

        {/* Tab 2: Collaboration Requests (New Section 3) */}
        <button
          onClick={() => setActiveTab('collaborations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer shrink-0 ${
            activeTab === 'collaborations'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Collaboration Requests</span>
          {pendingCollabsCount > 0 ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 animate-pulse">
              {pendingCollabsCount} NEW
            </span>
          ) : (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'collaborations' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
              {collaborations.length}
            </span>
          )}
        </button>

        {/* Tab 3: Reader Feedback (New Section 3) */}
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer shrink-0 ${
            activeTab === 'feedback'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Reader Feedback</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === 'feedback' ? 'bg-white/20 text-white' : 'bg-[#E3F2FD] text-[#0D47A1]'}`}>
            {feedbackList.length}
          </span>
        </button>

        {/* Tab 4: Licenses & Certifications */}
        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border cursor-pointer shrink-0 ${
            activeTab === 'certifications'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm'
              : 'bg-white text-[#0D47A1] border-[#90CAF9] hover:bg-[#E3F2FD]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Licenses &amp; Certifications</span>
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

      {/* Overview Analytics Cards (Including Likes, Comments & Feedback) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0D47A1] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{(stats.total_visits || 0).toLocaleString()}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Website Visits</span>
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
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{totalLikes.toLocaleString()}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Total Likes</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{allComments.length}</span>
            <span className="block text-[10px] text-[#0D47A1]/70 font-semibold uppercase tracking-wider">Comments</span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3 border border-amber-300 bg-amber-50/50">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shrink-0 shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-[#0D47A1] font-serif">{collaborations.length}</span>
            <span className="block text-[10px] text-amber-900 font-bold uppercase tracking-wider">
              Collabs ({pendingCollabsCount} New)
            </span>
          </div>
        </div>

        <div className="mint-card p-4 flex items-center gap-3 border border-emerald-300 bg-emerald-50/50">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Star className="w-5 h-5 fill-white text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-emerald-950 font-serif">{avgFeedbackRating} ⭐</span>
            <span className="block text-[10px] text-emerald-900 font-bold uppercase tracking-wider">
              Avg Rating ({feedbackList.length})
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ARTICLES & INSIGHT TOPICS MANAGER WITH LIVE LIKES & COMMENTS STATS */}
      {/* ========================================================================= */}
      {activeTab === 'articles' && (
        <>
          {/* Categories Management Card */}
          <div className="mint-card p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#90CAF9] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#0D47A1] font-serif flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#2196F3]" /> Insight Topics &amp; Category Manager
                </h2>
                <p className="text-xs text-[#0D47A1]/80">
                  Add or remove insight topic categories (e.g. Stocks, Cryptocurrency, Macroeconomics).
                </p>
              </div>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="e.g. Quantitative Finance..."
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

          {/* Published Articles Data Table Container */}
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
                      <th className="py-3.5 px-4 text-center">Article Views</th>
                      <th className="py-3.5 px-4 text-center">Live Likes</th>
                      <th className="py-3.5 px-4 text-center">Comments</th>
                      <th className="py-3.5 px-4 text-center">Trending Status</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#90CAF9]/60">
                    {filteredArticles.map((article) => {
                      const commentsCount = getCommentCountForArticle(article.id);
                      return (
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
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
                              <Eye className="w-3 h-3 text-[#0D47A1]" /> {article.views || 0}
                            </span>
                          </td>
                          {/* Live Like Count */}
                          <td className="py-3.5 px-4 text-center font-bold text-rose-600">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200">
                              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> {article.likes || 0}
                            </span>
                          </td>
                          {/* Total Comment Count */}
                          <td className="py-3.5 px-4 text-center font-bold text-[#0D47A1]">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E3F2FD] border border-[#90CAF9]">
                              <MessageCircle className="w-3 h-3 text-[#0D47A1]" /> {commentsCount}
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
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleResetSingleArticleViews(article)}
                              className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                              title={`Reset views for "${article.title}" to 0`}
                            >
                              <RefreshCw className="w-4 h-4 text-amber-700" />
                            </button>
                            <Link to={`/admin/editor/${article.id}`}>
                              <button className="p-1.5 rounded-lg bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#90CAF9]/40 border border-[#90CAF9] transition-colors cursor-pointer" title="Edit Article in Studio">
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button
                              onClick={() => setDeleteTarget(article)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: COLLABORATION REQUESTS (SECTION 3)                                 */}
      {/* ========================================================================= */}
      {activeTab === 'collaborations' && (
        <div className="mint-card overflow-hidden space-y-4">
          {/* Controls Bar: Search & Status Filter */}
          <div className="p-5 border-b border-[#90CAF9] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#0D47A1]/50" />
                <input
                  type="text"
                  placeholder="Search name, email, project type, message..."
                  value={collabSearch}
                  onChange={(e) => setCollabSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/50 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 bg-[#E3F2FD]/60 p-1 rounded-xl border border-[#90CAF9] text-xs w-full sm:w-auto overflow-x-auto">
                {['All', 'Pending', 'In Review', 'Contacted', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setCollabStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      collabStatusFilter === status
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
              Showing <strong className="text-[#0D47A1]">{filteredCollaborations.length}</strong> of {collaborations.length} requests
            </span>
          </div>

          {/* Collaborations Table */}
          {collaborationsLoading ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm">Loading collaboration requests...</div>
          ) : filteredCollaborations.length === 0 ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm flex flex-col items-center gap-2">
              <Inbox className="w-8 h-8 text-[#0D47A1]/40" />
              <span>No collaboration requests found matching your filter.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0D47A1]">
                <thead className="bg-[#E3F2FD] text-[#0D47A1] font-serif uppercase tracking-wider text-[11px] border-b border-[#90CAF9]">
                  <tr>
                    <th className="py-3.5 px-4">Partner / Client Details</th>
                    <th className="py-3.5 px-4">Project Type</th>
                    <th className="py-3.5 px-4">Project Scope &amp; Requirements</th>
                    <th className="py-3.5 px-4 text-center">Status Control</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#90CAF9]/60">
                  {filteredCollaborations.map((item) => (
                    <tr key={item.id} className="hover:bg-[#E3F2FD]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-sm text-[#0D47A1]">{item.name}</div>
                        <a
                          href={`mailto:${item.email}`}
                          className="text-[11px] text-[#2196F3] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Mail className="w-3 h-3" /> {item.email}
                        </a>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#E3F2FD] text-[#0D47A1] border border-[#90CAF9] inline-block shadow-2xs">
                          {item.project_type || 'General Inquiry'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-sm">
                        <p className="text-xs text-[#334155] leading-relaxed font-sans line-clamp-3">
                          {item.message || 'No additional project description provided.'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <select
                          value={item.status || 'Pending'}
                          onChange={(e) => handleCollabStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg border focus:outline-none cursor-pointer ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : item.status === 'Contacted' || item.status === 'In Review'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-900 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-[#0D47A1]/80">
                        {new Date(item.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteCollabTarget(item)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Delete Collaboration"
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

      {/* ========================================================================= */}
      {/* TAB 3: READER FEEDBACK & RATINGS (SECTION 3)                              */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Feedback Controls & Filter */}
          <div className="mint-card p-5 border-b border-[#90CAF9] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#0D47A1]/50" />
                <input
                  type="text"
                  placeholder="Search suggestions, reader name, email..."
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/50 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Star Rating Filter */}
              <div className="flex items-center gap-1 bg-[#E3F2FD]/60 p-1 rounded-xl border border-[#90CAF9] text-xs w-full sm:w-auto overflow-x-auto">
                <button
                  onClick={() => setFeedbackRatingFilter('All')}
                  className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    feedbackRatingFilter === 'All'
                      ? 'bg-[#0D47A1] text-white shadow-xs'
                      : 'text-[#0D47A1] hover:bg-[#90CAF9]/30'
                  }`}
                >
                  All Stars
                </button>
                {[5, 4, 3, 2, 1].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFeedbackRatingFilter(String(st))}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer ${
                      String(feedbackRatingFilter) === String(st)
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-[#0D47A1] hover:bg-[#90CAF9]/30'
                    }`}
                  >
                    <span>{st}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-[#0D47A1]/80">
              Showing <strong className="text-[#0D47A1]">{filteredFeedback.length}</strong> of {feedbackList.length} feedback entries
            </span>
          </div>

          {/* Feedback Submissions List */}
          {feedbackLoading ? (
            <div className="mint-card py-16 text-center text-[#0D47A1]/60 text-sm">Loading reader feedback...</div>
          ) : filteredFeedback.length === 0 ? (
            <div className="mint-card py-16 text-center text-[#0D47A1]/60 text-sm flex flex-col items-center gap-2">
              <MessageSquareHeart className="w-8 h-8 text-[#0D47A1]/40" />
              <span>No feedback entries found matching your filter.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="mint-card p-5 space-y-3.5 relative flex flex-col justify-between hover:border-[#2196F3] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {/* Star Rating Display */}
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${
                              s <= (fb.rating || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-amber-900 ml-1">
                          {fb.rating || 5} / 5
                        </span>
                      </div>

                      <span className="text-[10px] text-[#475569] font-semibold">
                        {new Date(fb.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Suggestion Text */}
                    <p className="text-xs sm:text-sm text-[#1E3A8A] leading-relaxed font-sans bg-[#EFF6FF]/60 p-3 rounded-xl border border-[#BFDBFE]/60">
                      "{fb.suggestion || fb.suggestions || fb.message || 'No suggestion comments.'}"
                    </p>
                  </div>

                  {/* Footer / Author info and delete */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#90CAF9]/40 text-xs">
                    <div>
                      <span className="font-bold text-[#0D47A1]">
                        {fb.name || 'Anonymous Reader'}
                      </span>
                      {fb.email && (
                        <span className="block text-[10px] text-[#2196F3]">
                          {fb.email}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setDeleteFeedbackTarget(fb)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                      title="Delete Feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: LICENSES & CERTIFICATIONS MANAGER                                  */}
      {/* ========================================================================= */}
      {activeTab === 'certifications' && (
        <div className="mint-card overflow-hidden space-y-4">
          <div className="p-4 border-b border-[#90CAF9] flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#0D47A1]">Accredited Licenses &amp; Certificates</h3>
            <ClayButton variant="primary" size="sm" icon={Plus} onClick={openCreateCertModal}>
              Add Credential
            </ClayButton>
          </div>

          {certificationsLoading ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm">Loading certifications...</div>
          ) : certificationsList.length === 0 ? (
            <div className="py-16 text-center text-[#0D47A1]/60 text-sm">No certifications registered.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0D47A1]">
                <thead className="bg-[#E3F2FD] text-[#0D47A1] font-serif uppercase tracking-wider text-[11px] border-b border-[#90CAF9]">
                  <tr>
                    <th className="py-3.5 px-4">Credential Title</th>
                    <th className="py-3.5 px-4">Issuer</th>
                    <th className="py-3.5 px-4">Issued Dates</th>
                    <th className="py-3.5 px-4">Linked Post</th>
                    <th className="py-3.5 px-4">Files Attached</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#90CAF9]/60">
                  {certificationsList.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#E3F2FD]/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0D47A1]">{cert.title}</td>
                      <td className="py-3.5 px-4 font-semibold">{cert.issuer}</td>
                      <td className="py-3.5 px-4 text-[#0D47A1]/70">{cert.dates}</td>
                      <td className="py-3.5 px-4">
                        {cert.article_id ? (
                          <Link to={`/post/${cert.article_id}`} className="text-[#2196F3] font-bold hover:underline">
                            Article #{cert.article_id}
                          </Link>
                        ) : (
                          <span className="text-[#0D47A1]/40 italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {cert.excel_url && (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                              Excel
                            </span>
                          )}
                          {cert.cert_doc_url && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                              Doc
                            </span>
                          )}
                          {!cert.excel_url && !cert.cert_doc_url && (
                            <span className="text-[#0D47A1]/40 text-[10px]">No files</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditCertModal(cert)}
                          className="p-1.5 rounded-lg bg-[#E3F2FD] text-[#0D47A1] hover:bg-[#90CAF9]/40 border border-[#90CAF9] transition-colors"
                          title="Edit Certification"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCertTarget(cert)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                          title="Delete Certification"
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
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="mint-card max-w-sm w-full p-6 space-y-4 shadow-xl border-rose-300">
            <h3 className="font-extrabold text-base text-[#0D47A1]">Confirm Article Deletion</h3>
            <p className="text-xs text-[#0D47A1]/80">
              Are you sure you want to permanently delete <strong>"{deleteTarget.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collaboration Modal */}
      {deleteCollabTarget && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="mint-card max-w-sm w-full p-6 space-y-4 shadow-xl border-rose-300">
            <h3 className="font-extrabold text-base text-[#0D47A1]">Delete Collaboration Request</h3>
            <p className="text-xs text-[#0D47A1]/80">
              Delete collaboration inquiry from <strong>{deleteCollabTarget.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCollabTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCollaboration(deleteCollabTarget.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Feedback Modal */}
      {deleteFeedbackTarget && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="mint-card max-w-sm w-full p-6 space-y-4 shadow-xl border-rose-300">
            <h3 className="font-extrabold text-base text-[#0D47A1]">Remove Feedback Entry</h3>
            <p className="text-xs text-[#0D47A1]/80">
              Delete reader feedback rated <strong>{deleteFeedbackTarget.rating} Stars</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteFeedbackTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFeedback(deleteFeedbackTarget.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Certification Modal */}
      {deleteCertTarget && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="mint-card max-w-sm w-full p-6 space-y-4 shadow-xl border-rose-300">
            <h3 className="font-extrabold text-base text-[#0D47A1]">Confirm Certification Deletion</h3>
            <p className="text-xs text-[#0D47A1]/80">
              Are you sure you want to delete credential <strong>"{deleteCertTarget.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteCertTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCertification(deleteCertTarget.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="mint-card max-w-lg w-full p-6 space-y-5 shadow-2xl border-2 border-[#90CAF9] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#90CAF9] pb-3">
              <h3 className="font-extrabold text-lg text-[#0D47A1] font-serif">
                {editingCert ? 'Edit Certification Credential' : 'Add New Certification Credential'}
              </h3>
              <button onClick={() => setShowCertModal(false)} className="p-1 rounded-full text-[#0D47A1] hover:bg-[#E3F2FD]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertification} className="space-y-4 text-xs text-[#0D47A1]">
              <div>
                <label className="block font-bold mb-1">Certification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Equity valuation and Financial modelling"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 text-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Issuing Body / Institute *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Caplexus Capital / PwC India"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 text-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Dates &amp; Validity</label>
                <input
                  type="text"
                  placeholder="e.g. Issued Jul 2026 – Expires Jul 2030"
                  value={certForm.dates}
                  onChange={(e) => setCertForm({ ...certForm, dates: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/40 text-[#0D47A1]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Link to Published Research Article (Optional)</label>
                <select
                  value={certForm.article_id}
                  onChange={(e) => setCertForm({ ...certForm, article_id: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1]"
                >
                  <option value="">-- No Linked Article --</option>
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      #{art.id} - {art.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Excel Model File Attachment */}
              <div className="p-3.5 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/30 space-y-2">
                <label className="block font-bold flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  Excel Financial Model (.xlsx / .xls)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    className="text-xs text-[#0D47A1] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0D47A1] file:text-white hover:file:bg-[#2196F3]"
                  />
                  {uploadingExcel && <RefreshCw className="w-4 h-4 animate-spin text-[#0D47A1]" />}
                </div>
                {certForm.excel_url && (
                  <p className="text-[11px] text-emerald-800 font-semibold truncate">
                    Attached: {certForm.excel_name || certForm.excel_url}
                  </p>
                )}
              </div>

              {/* Certificate PDF/Image Document Attachment */}
              <div className="p-3.5 rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/30 space-y-2">
                <label className="block font-bold flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-amber-600" />
                  Certificate Verification Document (.pdf / .png / .jpg)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleDocUpload}
                    className="text-xs text-[#0D47A1] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                  />
                  {uploadingDoc && <RefreshCw className="w-4 h-4 animate-spin text-[#0D47A1]" />}
                </div>
                {certForm.cert_doc_url && (
                  <p className="text-[11px] text-amber-900 font-semibold truncate">
                    Attached: {certForm.cert_doc_name || certForm.cert_doc_url}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#90CAF9]">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2196F3] shadow-md"
                >
                  Save Certification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK POST ARTICLE MODAL (WITH PICTURE LINK OR DIRECT FILE UPLOAD)        */}
      {/* ========================================================================= */}
      {showQuickPostModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="mint-card max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border-2 border-[#90CAF9] max-h-[92vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#90CAF9] pb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#E3F2FD] text-[#0D47A1] text-[11px] font-extrabold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2196F3]" /> Dashboard Quick Post
                </div>
                <h3 className="font-extrabold text-xl text-[#0D47A1] font-serif">
                  Post New Financial Insight Article
                </h3>
              </div>
              <button
                onClick={() => setShowQuickPostModal(false)}
                className="p-1.5 rounded-full text-[#0D47A1] hover:bg-[#E3F2FD] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickPostSubmit} className="space-y-4 text-xs text-[#0D47A1]">
              {/* Article Title */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Macro Analysis: Sovereign Debt Yield Spreads & Rate Pivot"
                  value={quickPostForm.title}
                  onChange={(e) => setQuickPostForm({ ...quickPostForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] font-serif font-bold text-sm focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Category, Author & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Category *
                  </label>
                  <select
                    value={quickPostForm.category}
                    onChange={(e) => setQuickPostForm({ ...quickPostForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  >
                    {(categoriesList.length > 0 ? categoriesList.map(c => c.name) : ['Stocks', 'Cryptocurrency', 'Macroeconomics', 'Wealth Management', 'DeFi 3.0', 'Financial Valuation']).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Author Byline
                  </label>
                  <input
                    type="text"
                    value={quickPostForm.author}
                    onChange={(e) => setQuickPostForm({ ...quickPostForm, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 uppercase tracking-wider text-[10px]">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={quickPostForm.read_time}
                    onChange={(e) => setQuickPostForm({ ...quickPostForm, read_time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                  />
                </div>
              </div>

              {/* PICTURE POSTING OPTION: DIRECT FILE UPLOAD OR LINK */}
              <div className="p-4 rounded-xl bg-[#E3F2FD]/50 border border-[#90CAF9] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#90CAF9]/60 pb-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#2196F3]" /> Post Cover Picture
                  </span>

                  <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#90CAF9] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setQuickPostImageMode('upload')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        quickPostImageMode === 'upload'
                          ? 'bg-[#0D47A1] text-white shadow-xs'
                          : 'text-[#0D47A1] hover:bg-[#E3F2FD]'
                      }`}
                    >
                      <UploadCloud className="w-3 h-3 inline mr-1" /> File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickPostImageMode('link')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        quickPostImageMode === 'link'
                          ? 'bg-[#0D47A1] text-white shadow-xs'
                          : 'text-[#0D47A1] hover:bg-[#E3F2FD]'
                      }`}
                    >
                      <Link2 className="w-3 h-3 inline mr-1" /> Image Link
                    </button>
                  </div>
                </div>

                {quickPostImageMode === 'upload' ? (
                  <div className="space-y-2">
                    <div
                      onDragOver={(e) => { e.preventDefault(); setQuickPostDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setQuickPostDragOver(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setQuickPostDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleQuickPostImageUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => quickPostFileInputRef.current && quickPostFileInputRef.current.click()}
                      className={`p-4 rounded-xl border-2 border-dashed text-center cursor-pointer transition-all ${
                        quickPostDragOver ? 'border-[#2196F3] bg-[#E3F2FD]' : 'border-[#90CAF9] bg-white hover:bg-[#E3F2FD]/30'
                      }`}
                    >
                      <input
                        ref={quickPostFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files && handleQuickPostImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2">
                        {quickPostUploadingImage ? (
                          <RefreshCw className="w-5 h-5 animate-spin text-[#0D47A1]" />
                        ) : (
                          <UploadCloud className="w-5 h-5 text-[#2196F3]" />
                        )}
                        <span className="font-bold text-xs">
                          {quickPostUploadingImage ? 'Uploading Picture...' : 'Click to Browse or Drag & Drop Image File'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#0D47A1]/60 block mt-1">
                        PNG, JPG, JPEG, WEBP, SVG, GIF supported
                      </span>
                    </div>

                    {quickPostUploadedName && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-semibold">
                        <span className="flex items-center gap-1.5 truncate">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Attached: {quickPostUploadedName}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setQuickPostUploadedName('');
                            setQuickPostForm(prev => ({ ...prev, thumbnail_url: '' }));
                          }}
                          className="text-rose-600 hover:underline font-bold ml-2"
                        >
                          Clear
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or any picture URL"
                      value={quickPostForm.thumbnail_url}
                      onChange={(e) => setQuickPostForm({ ...quickPostForm, thumbnail_url: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] font-mono focus:outline-none focus:border-[#2196F3]"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Stock Markets', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80' },
                        { label: 'Crypto', url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80' },
                        { label: 'Valuation', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80' },
                        { label: 'Wealth', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80' }
                      ].map((preset, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setQuickPostForm({ ...quickPostForm, thumbnail_url: preset.url })}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-white border border-[#90CAF9] text-[#0D47A1] hover:text-[#2196F3] hover:border-[#2196F3] cursor-pointer"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Picture Preview */}
                {quickPostForm.thumbnail_url && (
                  <div className="relative rounded-lg overflow-hidden border border-[#90CAF9] h-28 bg-slate-900 shadow-2xs">
                    <img
                      src={quickPostForm.thumbnail_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#0D47A1]/85 text-white text-[9px] font-bold uppercase">
                      Picture Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Summary Excerpt (Card Preview)
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary snippet for article cards..."
                  value={quickPostForm.excerpt}
                  onChange={(e) => setQuickPostForm({ ...quickPostForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Full Content Body */}
              <div>
                <label className="block font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Full Article Body (Markdown supported) *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="# Article Headline&#10;&#10;Write your in-depth financial analysis here..."
                  value={quickPostForm.content}
                  onChange={(e) => setQuickPostForm({ ...quickPostForm, content: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#90CAF9] bg-white text-[#0D47A1] font-mono leading-relaxed focus:outline-none focus:border-[#2196F3]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#90CAF9]">
                <button
                  type="button"
                  onClick={() => setShowQuickPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quickPostSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0D47A1] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2196F3] shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {quickPostSubmitting ? 'Publishing...' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

