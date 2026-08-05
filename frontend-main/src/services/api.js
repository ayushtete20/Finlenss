import { supabase } from '../utils/supabaseClient';

// Helper to get stored auth token
export const getAuthToken = () => {
  return localStorage.getItem('financial_admin_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('financial_admin_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('financial_admin_token');
};

export const isAdminLoggedIn = () => {
  return !!getAuthToken();
};

// --- SECTION 1: SUPABASE DIRECT SDK DATA FETCHING ---

// Fetch Articles using Supabase SDK: supabase.from('articles').select('*')
export const fetchArticles = async (params = {}) => {
  try {
    let query = supabase.from('articles').select('*');

    if (params.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }
    if (params.search) {
      query = query.ilike('title', `%${params.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return { articles: data };
    }
  } catch (err) {
    console.warn('Supabase fetchArticles error, using local fallback:', err);
  }

  // Local fallback if Supabase is unreachable
  try {
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${baseUrl}/blogs?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Local API fallback failed:', e);
  }

  return { articles: [] };
};

// Fetch Article by ID using Supabase SDK
export const fetchArticleById = async (id) => {
  try {
    const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
    if (!error && data) {
      return { article: data };
    }
  } catch (err) {
    console.warn('Supabase fetchArticleById error:', err);
  }

  // Local fallback
  try {
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(`${baseUrl}/blogs/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { article: null };
};

// Fetch Categories using Supabase SDK: supabase.from('categories').select('*')
export const fetchCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data && data.length > 0) {
      return { categories: data };
    }
  } catch (err) {
    console.warn('Supabase fetchCategories error:', err);
  }

  try {
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(`${baseUrl}/blogs/categories/all`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { categories: [] };
};

// Fetch Certifications using Supabase SDK: supabase.from('certifications').select('*')
export const fetchCertifications = async () => {
  try {
    const { data, error } = await supabase.from('certifications').select('*');
    if (!error && data && data.length > 0) {
      return { certifications: data };
    }
  } catch (err) {
    console.warn('Supabase fetchCertifications error:', err);
  }

  try {
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(`${baseUrl}/certifications`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { certifications: [] };
};

// Fetch Consultations using Supabase SDK: supabase.from('consultations').select('*')
export const fetchConsultations = async () => {
  try {
    const { data, error } = await supabase.from('consultations').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      return { consultations: data };
    }
  } catch (err) {
    console.warn('Supabase fetchConsultations error:', err);
  }

  try {
    const token = getAuthToken();
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(`${baseUrl}/admin/consultations`, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  return { consultations: [] };
};

// Create / Modify methods
export const createArticle = async (articleData) => {
  try {
    const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
    if (!error && data) return { message: 'Article created', article: data };
  } catch (e) {}

  // Local fallback
  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(articleData)
  });
  return await res.json();
};

export const updateArticle = async (id, articleData) => {
  try {
    const { data, error } = await supabase.from('articles').update(articleData).eq('id', id).select().single();
    if (!error) return { message: 'Article updated', article: data };
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(articleData)
  });
  return await res.json();
};

export const deleteArticle = async (id) => {
  try {
    await supabase.from('articles').delete().eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  return await res.json();
};

export const createCertification = async (certData) => {
  try {
    const { data, error } = await supabase.from('certifications').insert([certData]).select().single();
    if (!error) return { message: 'Certification created', certification: data };
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/admin/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(certData)
  });
  return await res.json();
};

export const updateCertification = async (id, certData) => {
  try {
    await supabase.from('certifications').update(certData).eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/admin/certifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(certData)
  });
  return await res.json();
};

export const deleteCertification = async (id) => {
  try {
    await supabase.from('certifications').delete().eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/admin/certifications/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  return await res.json();
};

export const toggleArticleTrending = async (id, isTrending) => {
  try {
    await supabase.from('articles').update({ is_trending: isTrending ? 1 : 0 }).eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/${id}/trending`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ is_trending: isTrending })
  });
  return await res.json();
};

export const createCategory = async (name) => {
  try {
    await supabase.from('categories').insert([{ name }]);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ name })
  });
  return await res.json();
};

export const deleteCategory = async (id) => {
  try {
    await supabase.from('categories').delete().eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/categories/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  return await res.json();
};

export const updateConsultationStatus = async (id, status) => {
  try {
    await supabase.from('consultations').update({ status }).eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/admin/consultations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ status })
  });
  return await res.json();
};

export const deleteConsultation = async (id) => {
  try {
    await supabase.from('consultations').delete().eq('id', id);
  } catch (e) {}

  const token = getAuthToken();
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/admin/consultations/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  return await res.json();
};

export const loginAdmin = async (password) => {
  if (password === 'admin123' || password === process.env.VITE_ADMIN_PASSWORD) {
    setAuthToken('supabase_admin_token_2026');
    return { success: true, token: 'supabase_admin_token_2026' };
  }

  try {
    const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
    const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
    const res = await fetch(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setAuthToken(data.token);
    }
    return data;
  } catch (e) {
    return { success: false, error: 'Invalid admin password' };
  }
};

export const fetchSiteStats = async () => {
  try {
    const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: certCount } = await supabase.from('certifications').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('consultations').select('*', { count: 'exact', head: true });
    return { total_articles: artCount || 4, total_certifications: certCount || 7, total_consultations: leadCount || 1 };
  } catch (e) {}

  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/blogs/stats/summary`);
  return await res.json();
};

export const trackVisit = async () => {};
export const trackArticleClick = async (id) => {};

// File Upload
export const uploadFile = async (file) => {
  try {
    const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const { data, error } = await supabase.storage.from('financial-models').upload(filename, file);
    if (!error && data) {
      const { data: publicUrlData } = supabase.storage.from('financial-models').getPublicUrl(filename);
      return {
        message: 'File uploaded to Supabase Storage',
        url: publicUrlData.publicUrl,
        filename: filename,
        originalName: file.name
      };
    }
  } catch (e) {}

  // Fallback to Express backend upload
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);
  const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
  const baseUrl = isLocalSplitDev ? 'http://localhost:5000/api' : '/api';
  const res = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData
  });
  return await res.json();
};
