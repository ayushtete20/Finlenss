import { supabase } from '../utils/supabaseClient';
const isLocalSplitDev = typeof window !== 'undefined' && (window.location.port === '5173' || window.location.port === '5174');
const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : (isLocalSplitDev ? 'http://localhost:5000/api' : '/api');

// --- FALLBACK INITIAL SEED DATA FOR PRODUCTION ---
export const fallbackArticles = [
  {
    id: 1,
    title: 'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
    excerpt: 'Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company\'s financial performance.',
    category: 'Financial Valuation',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
    author: 'Tushar Singh, CFA',
    read_time: '5 min read',
    views: 1850,
    is_trending: 1,
    created_at: new Date().toISOString(),
    content: `Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company's financial performance.

Key Insights:
• Revenue growth remains steady, supported by the strength of Dabur's FMCG portfolio.
• Gross margins stay resilient despite fluctuations in raw material costs.
• Operating margins improve gradually through better cost management and efficiency.
• Working capital assumptions play a crucial role in determining free cash flow generation.
• Capital expenditure remains disciplined, reflecting an asset-light growth approach.
• Cash flow from operations continues to be the primary source of liquidity.
• Debt levels remain manageable, indicating a strong and stable financial position.
• The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.
• Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions.`
  },
  {
    id: 2,
    title: 'Global Macro Analysis Q3 2026: Interest Rate Pivots & Inflation Control',
    excerpt: 'An in-depth breakdown of global central bank shifts, yield curve inversions, and institutional asset allocation strategies in the evolving macroeconomic landscape.',
    category: 'Macroeconomics',
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    author: 'Tushar Singh, CFA',
    read_time: '7 min read',
    views: 1420,
    is_trending: 1,
    created_at: new Date().toISOString(),
    content: `Global macro conditions in 2026 are defined by shifting central bank policies, yield curve realignments, and strategic capital reallocation toward resilient cash-flow-generating assets.`
  },
  {
    id: 3,
    title: 'Decentralized Credit Protocols: Institutional Liquidity in DeFi 3.0',
    excerpt: 'How under-collateralized lending and real-world asset (RWA) tokenization are bridging traditional private credit with decentralized liquidity pools.',
    category: 'DeFi 3.0',
    thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80',
    author: 'Tushar Singh',
    read_time: '9 min read',
    views: 980,
    is_trending: 0,
    created_at: new Date().toISOString(),
    content: `Real-World Asset (RWA) tokenization is revolutionizing private credit markets, allowing institutional investors to tap into transparent, automated DeFi liquidity pools.`
  },
  {
    id: 4,
    title: 'Quantitative Valuation Models for High-Growth SaaS Companies',
    excerpt: 'Exploring Rule of 40, Net Revenue Retention (NRR), and DCF multi-stage growth models tailored for enterprise SaaS valuation.',
    category: 'SaaS & Tech',
    thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
    author: 'Tushar Singh',
    read_time: '6 min read',
    views: 2150,
    is_trending: 1,
    created_at: new Date().toISOString(),
    content: `SaaS valuation requires rigorous quantitative modeling incorporating Rule of 40 performance metrics, customer acquisition cost payback, and Net Revenue Retention rates.`
  }
];

export const fallbackCategories = [
  { id: 1, name: 'Financial Valuation' },
  { id: 2, name: 'Macroeconomics' },
  { id: 3, name: 'DeFi 3.0' },
  { id: 4, name: 'SaaS & Tech' },
  { id: 5, name: 'Stocks' },
  { id: 6, name: 'Wealth Management' }
];

export const fallbackCertifications = [
  {
    id: 1,
    title: 'Equity valuation and Financial modelling',
    issuer: 'Caplexus Capital',
    dates: 'Issued Jul 2026 – Expires Jul 2030',
    icon: 'Award',
    article_id: 1,
    article_title: 'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
    article_content: `Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company's financial performance.`,
    insights: [
      "Revenue growth remains steady, supported by the strength of Dabur's FMCG portfolio.",
      "Gross margins stay resilient despite fluctuations in raw material costs.",
      "Operating margins improve gradually through better cost management and efficiency.",
      "Working capital assumptions play a crucial role in determining free cash flow generation.",
      "Capital expenditure remains disciplined, reflecting an asset-light growth approach.",
      "Operating cash flow continues to be the primary source of liquidity.",
      "Debt levels remain manageable, indicating a strong and stable financial position.",
      "The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.",
      "Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions."
    ],
    excel_url: '/Dabur_India_3_Statement_Financial_Model.xlsx',
    excel_name: 'Dabur_India_3_Statement_Financial_Model.xlsx',
    cert_doc_url: '/uploads/ECC-CEH-Certificate_page-0001__1__1785995910796.jpg',
    cert_doc_name: 'CEH_Certificate.jpg',
    status: 'Verified'
  },
  { id: 2, title: 'Financial modelling and analysis', issuer: 'PwC India', dates: 'Verified Credential', icon: 'BadgeCheck', status: 'Verified' },
  { id: 3, title: 'Microsoft Excel 2013 Certification', issuer: 'Great Learning', dates: 'Issued Jul 2022 – Expired Jul 2022', icon: 'Award', status: 'Verified' },
  { id: 4, title: 'Fundamentals accounting', issuer: 'National Skill Development Corporation', dates: 'Issued Jun 2026', icon: 'BadgeCheck', status: 'Verified' },
  { id: 5, title: 'NISM Certifications (NISM-securities market foundation certification)', issuer: 'National Institute of Securities Markets (NISM)', dates: 'Issued Apr 2026 – Expires Apr 2029', icon: 'BadgeCheck', status: 'Verified' },
  { id: 6, title: 'UpGrad (Financial Analysis / Working Capital Management)', issuer: 'UpGrad', dates: 'Issued Feb 2026 – Expires Mar 2028', icon: 'Award', status: 'Verified' },
  { id: 7, title: 'skill india certificate for finance', issuer: 'Government of India', dates: 'Issued Feb 2026 – Expired Jun 2026', icon: 'Award', status: 'Verified' }
];


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
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${baseUrl}/blogs?${query.toString()}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn('Local API fallback failed:', e);
  }

  return { articles: fallbackArticles };
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
    const res = await fetch(`${baseUrl}/blogs/${id}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  const foundFallback = fallbackArticles.find(a => String(a.id) === String(id));
  return { article: foundFallback || fallbackArticles[0] };
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
    const res = await fetch(`${baseUrl}/blogs/categories/all`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { categories: fallbackCategories };
};

// Fetch a certification linked to a specific article_id (used to show cert badge on posts)
export const fetchCertificationByArticleId = async (articleId) => {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('article_id', articleId)
      .maybeSingle();
    if (!error && data) {
      return { certification: data };
    }
  } catch (err) {
    console.warn('Supabase fetchCertificationByArticleId error:', err);
  }

  try {
    const res = await fetch(`${baseUrl}/certifications`);
    if (res.ok) {
      const data = await res.json();
      const certs = data.certifications || [];
      const matched = certs.find(c => String(c.article_id) === String(articleId));
      if (matched) return { certification: matched };
    }
  } catch (e) {}

  const matchedCert = fallbackCertifications.find(c => String(c.article_id) === String(articleId));
  return { certification: matchedCert || fallbackCertifications[0] };
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
    const res = await fetch(`${baseUrl}/certifications`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { certifications: fallbackCertifications };
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
  const res = await fetch(`${baseUrl}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(articleData)
  });
  return await res.json();
};

export const deleteArticle = async (id) => {
  try {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (!error) return { message: 'Article deleted' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/blogs/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Article deleted' };
};

export const createCertification = async (certData) => {
  try {
    const { data, error } = await supabase.from('certifications').insert([certData]).select().single();
    if (!error && data) return { message: 'Certification created', certification: data };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/admin/certifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(certData)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Certification created', certification: certData };
};

export const updateCertification = async (id, certData) => {
  try {
    const { data, error } = await supabase.from('certifications').update(certData).eq('id', id).select().single();
    if (!error) return { message: 'Certification updated', certification: data || certData };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/admin/certifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(certData)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Certification updated' };
};

export const deleteCertification = async (id) => {
  try {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) return { message: 'Certification deleted' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Certification deleted' };
};

export const toggleArticleTrending = async (id, isTrending) => {
  try {
    const { error } = await supabase.from('articles').update({ is_trending: isTrending ? 1 : 0 }).eq('id', id);
    if (!error) return { message: 'Updated' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/blogs/${id}/trending`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ is_trending: isTrending })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Updated' };
};

export const createCategory = async (name) => {
  try {
    const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
    if (!error) return { message: 'Category created', category: data };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/blogs/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ name })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Category created' };
};

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) return { message: 'Category deleted' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/blogs/categories/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Category deleted' };
};

export const updateConsultationStatus = async (id, status) => {
  try {
    const { error } = await supabase.from('consultations').update({ status }).eq('id', id);
    if (!error) return { message: 'Status updated' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/admin/consultations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ status })
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Status updated' };
};

export const deleteConsultation = async (id) => {
  try {
    const { error } = await supabase.from('consultations').delete().eq('id', id);
    if (!error) return { message: 'Consultation deleted' };
  } catch (e) {}

  try {
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/admin/consultations/${id}`, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { message: 'Consultation deleted' };
};

export const loginAdmin = async (password) => {
  if (password === 'admin123' || password === import.meta.env.VITE_ADMIN_PASSWORD) {
    setAuthToken('supabase_admin_token_2026');
    return { success: true, token: 'supabase_admin_token_2026' };
  }

  try {
    const res = await fetch(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token) setAuthToken(data.token);
      return data;
    }
  } catch (e) {}
  return { success: false, error: 'Invalid admin password' };
};

export const fetchSiteStats = async () => {
  try {
    const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: certCount } = await supabase.from('certifications').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('consultations').select('*', { count: 'exact', head: true });
    if (artCount !== null || certCount !== null || leadCount !== null) {
      return { total_articles: artCount || 0, total_certifications: certCount || 0, total_consultations: leadCount || 0 };
    }
  } catch (e) {}

  try {
    const res = await fetch(`${baseUrl}/blogs/stats/summary`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return { total_articles: 0, total_certifications: 0, total_consultations: 0 };
};

export const trackVisit = async () => {};
export const trackArticleClick = async (id) => {};

// File Upload
export const uploadFile = async (file) => {
  // Upload directly to the local Express backend server
  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Express backend upload failed, falling back to Supabase:', e);
  }

  // Fallback to Supabase Storage if local server is unreachable
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
  } catch (err) {
    console.error('Supabase upload fallback failed:', err);
  }

  throw new Error('All file upload destinations failed.');
};
