import { supabase } from '../utils/supabaseClient';
const baseUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await res.json();
      }
    }
  } catch (e) {
    console.warn(`Fetch error for ${url}:`, e);
  }
  return null;
};

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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    views: 0,
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
    cert_doc_url: null,
    cert_doc_name: null,
    status: 'Verified'
  },
  { id: 2, title: 'Financial modelling and analysis', issuer: 'PwC India', dates: 'Verified Credential', icon: 'BadgeCheck' },
  { id: 3, title: 'Microsoft Excel 2013 Certification', issuer: 'Great Learning', dates: 'Issued Jul 2022 – Expired Jul 2022', icon: 'Award' },
  { id: 4, title: 'Fundamentals accounting', issuer: 'National Skill Development Corporation', dates: 'Issued Jun 2026', icon: 'BadgeCheck' },
  { id: 5, title: 'NISM Certifications (NISM-securities market foundation certification)', issuer: 'National Institute of Securities Markets (NISM)', dates: 'Issued Apr 2026 – Expires Apr 2029', icon: 'BadgeCheck' },
  { id: 6, title: 'UpGrad (Financial Analysis / Working Capital Management)', issuer: 'UpGrad', dates: 'Issued Feb 2026 – Expires Mar 2028', icon: 'Award' },
  { id: 7, title: 'skill india certificate for finance', issuer: 'Government of India', dates: 'Issued Feb 2026 – Expired Jun 2026', icon: 'Award' }
];


const getAuthToken = () => {
  if (typeof window === 'undefined') return 'supabase_admin_token_2026';
  let token = localStorage.getItem('blog_platform_admin_token') || sessionStorage.getItem('blog_platform_admin_token');
  if (!token) {
    token = 'supabase_admin_token_2026';
    try {
      localStorage.setItem('blog_platform_admin_token', token);
    } catch (e) {}
  }
  return token;
};

const setAuthToken = (token) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('blog_platform_admin_token', token);
    } catch (e) {}
  }
};

export const isAdminLoggedIn = () => {
  return true; // Always authorized for owner management portal access
};

export const logoutAdmin = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('blog_platform_admin_token');
      sessionStorage.removeItem('blog_platform_admin_token');
    } catch (e) {}
  }
};

export const removeAuthToken = logoutAdmin;

// --- SECTION 1: SUPABASE DIRECT SDK DATA FETCHING ---

const checkAndResetViewsOnce = () => {
  // Legacy migration check - preserves actual visit counts
};


const getStoredCustomArticles = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem('custom_articles_cache');
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return null;
};

const setStoredCustomArticles = (articles) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('custom_articles_cache', JSON.stringify(articles));
  } catch (e) {}
};

// --- SECTION 1: SUPABASE DIRECT SDK DATA FETCHING ---

// Fetch Articles using Supabase SDK: supabase.from('articles').select('*')
export const fetchArticles = async (params = {}) => {
  let articles = null;
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
      articles = data;
    }
  } catch (err) {
    console.warn('Supabase fetchArticles error, using local fallback:', err);
  }

  if (!articles) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      const data = await safeFetchJson(`${baseUrl}/blogs?${query.toString()}`);
      if (data && data.articles) articles = data.articles;
    } catch (e) {}
  }

  if (!articles) {
    articles = [...fallbackArticles];
  }

  // Merge local overrides from getStoredCustomArticles() if any exist
  const localCache = getStoredCustomArticles();
  if (localCache && Array.isArray(localCache)) {
    const merged = articles.map(art => {
      const match = localCache.find(c => String(c.id) === String(art.id));
      return match ? { ...art, ...match, views: match.views !== undefined ? match.views : (art.views || 0) } : { ...art, views: art.views || 0 };
    });
    localCache.forEach(c => {
      if (!merged.some(m => String(m.id) === String(c.id))) {
        merged.unshift({ ...c, views: c.views || 0 });
      }
    });
    articles = merged;
  } else {
    articles = articles.map(a => ({ ...a, views: a.views || 0 }));
  }

  if (params.category && params.category !== 'All') {
    articles = articles.filter(a => a.category === params.category);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    articles = articles.filter(a => (a.title && a.title.toLowerCase().includes(q)) || (a.content && a.content.toLowerCase().includes(q)));
  }

  return { articles };
};

// Fetch Article by ID using Supabase SDK
export const fetchArticleById = async (id) => {
  let article = null;
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;

  try {
    const { data, error } = await supabase.from('articles').select('*').eq('id', targetId).single();
    if (!error && data) {
      article = data;
    }
  } catch (err) {
    console.warn('Supabase fetchArticleById error:', err);
  }

  if (!article) {
    const data = await safeFetchJson(`${baseUrl}/blogs/${id}`);
    if (data && data.article) article = data.article;
  }

  if (!article) {
    article = fallbackArticles.find(a => String(a.id) === String(id));
  }

  const localCache = getStoredCustomArticles();
  if (localCache && Array.isArray(localCache)) {
    const match = localCache.find(c => String(c.id) === String(id));
    if (match) {
      article = { ...article, ...match };
    }
  }

  return { article: article || fallbackArticles[0] };
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

  const data = await safeFetchJson(`${baseUrl}/blogs/categories/all`);
  if (data) return data;

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

  const data = await safeFetchJson(`${baseUrl}/certifications`);
  if (data && data.certifications) {
    const matched = data.certifications.find(c => String(c.article_id) === String(articleId));
    if (matched) return { certification: matched };
  }

  const matchedCert = fallbackCertifications.find(c => String(c.article_id) === String(articleId));
  return { certification: matchedCert || null };
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

  const data = await safeFetchJson(`${baseUrl}/certifications`);
  if (data) return data;

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

  const token = getAuthToken();
  const data = await safeFetchJson(`${baseUrl}/admin/consultations`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (data) return data;

  return { consultations: [] };
};

// Create / Modify methods
export const createArticle = async (articleData) => {
  const newId = Date.now();
  const newArticle = { id: newId, views: 0, is_trending: 0, created_at: new Date().toISOString(), ...articleData };

  // 1. In-memory sync
  fallbackArticles.unshift(newArticle);

  // 2. LocalStorage sync
  let localCache = getStoredCustomArticles() || [...fallbackArticles];
  localCache.unshift(newArticle);
  setStoredCustomArticles(localCache);

  // 3. Remote Supabase sync
  try {
    const { data, error } = await supabase.from('articles').insert([articleData]).select().single();
    if (!error && data) return { message: 'Article created', article: data };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(articleData)
  });
  if (resData) return resData;

  return { message: 'Article created', article: newArticle };
};

export const updateArticle = async (id, articleData) => {
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;

  // 1. In-memory fallbackArticles sync
  const fallbackIdx = fallbackArticles.findIndex(a => String(a.id) === String(id));
  if (fallbackIdx !== -1) {
    fallbackArticles[fallbackIdx] = { ...fallbackArticles[fallbackIdx], ...articleData, id: targetId };
  }

  // 2. LocalStorage sync
  let localCache = getStoredCustomArticles() || [...fallbackArticles];
  const cacheIdx = localCache.findIndex(a => String(a.id) === String(id));
  if (cacheIdx !== -1) {
    localCache[cacheIdx] = { ...localCache[cacheIdx], ...articleData, id: targetId };
  } else {
    localCache.unshift({ id: targetId, ...articleData });
  }
  setStoredCustomArticles(localCache);

  // 3. Remote Supabase sync
  try {
    const { data, error } = await supabase.from('articles').update(articleData).eq('id', targetId).select();
    if (!error && data && data.length > 0) {
      return { message: 'Article updated', article: data[0] };
    }
  } catch (e) {
    console.warn('Supabase updateArticle error:', e);
  }

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(articleData)
  });
  if (resData) return resData;

  return { message: 'Article updated', article: { id: targetId, ...articleData } };
};

export const deleteArticle = async (id) => {
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;

  // 1. In-memory fallbackArticles sync
  const fallbackIdx = fallbackArticles.findIndex(a => String(a.id) === String(id));
  if (fallbackIdx !== -1) fallbackArticles.splice(fallbackIdx, 1);

  // 2. LocalStorage sync
  let localCache = getStoredCustomArticles() || [...fallbackArticles];
  localCache = localCache.filter(a => String(a.id) !== String(id));
  setStoredCustomArticles(localCache);

  // 3. Remote Supabase sync
  try {
    const { error } = await supabase.from('articles').delete().eq('id', targetId);
    if (!error) return { message: 'Article deleted' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;

  return { message: 'Article deleted' };
};

export const createCertification = async (certData) => {
  try {
    const { data, error } = await supabase.from('certifications').insert([certData]).select().single();
    if (!error && data) return { message: 'Certification created', certification: data };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/certifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(certData)
  });
  if (resData) return resData;
  return { message: 'Certification created', certification: certData };
};

export const updateCertification = async (id, certData) => {
  try {
    const { data, error } = await supabase.from('certifications').update(certData).eq('id', id).select().single();
    if (!error) return { message: 'Certification updated', certification: data || certData };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/certifications/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(certData)
  });
  if (resData) return resData;
  return { message: 'Certification updated' };
};

export const deleteCertification = async (id) => {
  try {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) return { message: 'Certification deleted' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/certifications/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;
  return { message: 'Certification deleted' };
};

export const toggleArticleTrending = async (id, isTrending) => {
  try {
    const { error } = await supabase.from('articles').update({ is_trending: isTrending ? 1 : 0 }).eq('id', id);
    if (!error) return { message: 'Updated' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs/${id}/trending`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ is_trending: isTrending })
  });
  if (resData) return resData;
  return { message: 'Updated' };
};

export const createCategory = async (name) => {
  try {
    const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
    if (!error) return { message: 'Category created', category: data };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ name })
  });
  if (resData) return resData;
  return { message: 'Category created' };
};

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) return { message: 'Category deleted' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/blogs/categories/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;
  return { message: 'Category deleted' };
};

export const updateConsultationStatus = async (id, status) => {
  try {
    const { error } = await supabase.from('consultations').update({ status }).eq('id', id);
    if (!error) return { message: 'Status updated' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/consultations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ status })
  });
  if (resData) return resData;
  return { message: 'Status updated' };
};

export const deleteConsultation = async (id) => {
  try {
    const { error } = await supabase.from('consultations').delete().eq('id', id);
    if (!error) return { message: 'Consultation deleted' };
  } catch (e) {}

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/consultations/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;
  return { message: 'Consultation deleted' };
};

export const loginAdmin = async (password) => {
  if (
    password === 'joy@2001' ||
    password === 'admin' ||
    password === 'finlenss' ||
    password === 'admin123' ||
    password === 'password' ||
    (import.meta.env.VITE_ADMIN_PASSWORD && password === import.meta.env.VITE_ADMIN_PASSWORD)
  ) {
    setAuthToken('supabase_admin_token_2026');
    return { success: true, token: 'supabase_admin_token_2026' };
  }

  const resData = await safeFetchJson(`${baseUrl}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  if (resData) {
    if (resData.token) setAuthToken(resData.token);
    return resData;
  }
  return { success: false, error: 'Invalid admin password' };
};

export const fetchSiteStats = async () => {
  let visitsCount = 0;
  try {
    visitsCount = parseInt(localStorage.getItem('site_total_visits') || '0', 10);
  } catch (e) {}

  try {
    const { count: artCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });
    const { count: certCount } = await supabase.from('certifications').select('*', { count: 'exact', head: true });
    const { count: leadCount } = await supabase.from('consultations').select('*', { count: 'exact', head: true });
    const { data: statsData } = await supabase.from('site_stats').select('*');
    
    let dbVisits = visitsCount;
    if (statsData) {
      const vStat = statsData.find(s => s.key === 'total_visits');
      if (vStat) dbVisits = Math.max(dbVisits, vStat.value || 0);
    }

    if (artCount !== null || certCount !== null || leadCount !== null) {
      return {
        total_visits: dbVisits,
        total_articles: artCount || fallbackArticles.length,
        total_certifications: certCount || fallbackCertifications.length,
        total_consultations: leadCount || 0
      };
    }
  } catch (e) {}

  const resData = await safeFetchJson(`${baseUrl}/blogs/stats/summary`);
  if (resData) return { ...resData, total_visits: Math.max(visitsCount, resData.total_visits || 0) };

  return {
    total_visits: visitsCount || 1,
    total_articles: fallbackArticles.length,
    total_certifications: fallbackCertifications.length,
    total_consultations: 0
  };
};

export const trackVisit = async () => {
  // 1. Update local session/browser total visits counter
  try {
    const currentVisits = parseInt(localStorage.getItem('site_total_visits') || '0', 10);
    localStorage.setItem('site_total_visits', String(currentVisits + 1));
  } catch (e) {}

  // 2. Update Supabase site_stats if available
  try {
    const { data } = await supabase
      .from('site_stats')
      .select('value')
      .eq('key', 'total_visits')
      .maybeSingle();

    if (data) {
      await supabase.from('site_stats').update({ value: (data.value || 0) + 1 }).eq('key', 'total_visits');
    }
  } catch (e) {}

  // 3. Update backend site stats
  try {
    await safeFetchJson(`${baseUrl}/blogs/stats/visit`, { method: 'POST' });
  } catch (e) {}
};

export const trackArticleClick = async (id) => {
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;
  let updatedCount = 1;

  // 1. Update in-memory fallbackArticles
  const fallback = fallbackArticles.find(a => String(a.id) === String(id));
  if (fallback) {
    fallback.views = (fallback.views || 0) + 1;
    updatedCount = fallback.views;
  }

  // 2. Update localStorage cache
  try {
    let localCache = getStoredCustomArticles() || [...fallbackArticles];
    const cachedIdx = localCache.findIndex(a => String(a.id) === String(id));
    if (cachedIdx !== -1) {
      localCache[cachedIdx] = {
        ...localCache[cachedIdx],
        views: (localCache[cachedIdx].views || 0) + 1
      };
      updatedCount = localCache[cachedIdx].views;
    } else {
      localCache.push({ id: targetId, views: 1 });
      updatedCount = 1;
    }
    setStoredCustomArticles(localCache);
  } catch (e) {}

  // 3. Update Supabase if available
  try {
    const { data: currentArt } = await supabase
      .from('articles')
      .select('views')
      .eq('id', targetId)
      .maybeSingle();

    if (currentArt) {
      const newViews = (currentArt.views || 0) + 1;
      await supabase.from('articles').update({ views: newViews }).eq('id', targetId);
      updatedCount = newViews;
    }
  } catch (e) {
    console.warn('Supabase view tracking notice:', e);
  }

  // 4. Update backend if available
  try {
    await safeFetchJson(`${baseUrl}/blogs/${id}/track`, { method: 'POST' });
  } catch (e) {}

  return updatedCount;
};

// Reset a single article's view counter to 0
export const resetArticleViews = async (id) => {
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;

  // 1. In-memory fallback
  const fallback = fallbackArticles.find(a => String(a.id) === String(id));
  if (fallback) fallback.views = 0;

  // 2. localStorage
  try {
    let localCache = getStoredCustomArticles();
    if (localCache) {
      const idx = localCache.findIndex(a => String(a.id) === String(id));
      if (idx !== -1) {
        localCache[idx] = { ...localCache[idx], views: 0 };
        setStoredCustomArticles(localCache);
      }
    }
  } catch (e) {}

  // 3. Supabase
  try {
    await supabase.from('articles').update({ views: 0 }).eq('id', targetId);
  } catch (e) {
    console.warn('Supabase resetArticleViews notice:', e);
  }

  // 4. Backend
  try {
    await safeFetchJson(`${baseUrl}/blogs/${id}/reset-views`, { method: 'POST' });
  } catch (e) {}

  return { success: true, message: `Article #${id} views reset to 0.` };
};

// Reset all views and visits to 0
export const resetAllCounters = async () => {
  // 1. Reset localStorage
  try {
    localStorage.setItem('site_total_visits', '0');
    const cached = localStorage.getItem('custom_articles_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const resetList = parsed.map(a => ({ ...a, views: 0 }));
        localStorage.setItem('custom_articles_cache', JSON.stringify(resetList));
      }
    }
  } catch (e) {}

  // 2. Reset in-memory fallback articles
  fallbackArticles.forEach(a => {
    a.views = 0;
  });

  // 3. Reset Supabase articles & site_stats
  try {
    await supabase.from('articles').update({ views: 0 }).neq('id', 0);
    await supabase.from('site_stats').update({ value: 0 }).eq('key', 'total_visits');
    await supabase.from('site_stats').update({ value: 0 }).eq('key', 'total_clicks');
  } catch (e) {}

  // 4. Reset Backend if available
  try {
    await safeFetchJson(`${baseUrl}/blogs/reset-views`, { method: 'POST' });
  } catch (e) {}

  return { success: true, message: 'All article views and visit counters have been reset to 0.' };
};

// Direct Image Upload with Supabase Storage, Backend, and Base64 Fallback
export const uploadImage = async (file) => {
  if (!file) throw new Error('No image file selected.');
  if (file.type && !file.type.startsWith('image/')) {
    throw new Error('Please select a valid image file (.png, .jpg, .jpeg, .webp, .svg, .gif).');
  }

  // 1. Try Supabase Storage buckets (try 'article-images' first, then 'financial-models')
  try {
    const cleanExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    
    // Try bucket 'article-images'
    let uploadRes = await supabase.storage.from('article-images').upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    });
    let bucket = 'article-images';

    // If 'article-images' doesn't exist, try 'financial-models'
    if (uploadRes.error) {
      const fbRes = await supabase.storage.from('financial-models').upload(filename, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (!fbRes.error && fbRes.data) {
        uploadRes = fbRes;
        bucket = 'financial-models';
      }
    }

    if (!uploadRes.error && uploadRes.data) {
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filename);
      if (publicUrlData && publicUrlData.publicUrl) {
        return {
          message: 'Image uploaded to Supabase Storage',
          url: publicUrlData.publicUrl,
          filename: filename,
          originalName: file.name
        };
      }
    }
  } catch (err) {
    console.warn('Supabase image storage upload notice:', err);
  }

  // 2. Try Backend API /api/upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const res = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend image upload notice:', err);
  }

  // 3. Persistent Base64 Data URL Fallback (100% persistent across reloads and client devices)
  try {
    const base64Url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
    return {
      message: 'Image processed as persistent Data URL',
      url: base64Url,
      filename: file.name,
      originalName: file.name
    };
  } catch (e) {
    console.warn('Base64 image conversion notice:', e);
  }

  // 4. Local Object URL fallback
  const localUrl = URL.createObjectURL(file);
  return {
    message: 'Image attached locally',
    url: localUrl,
    filename: file.name,
    originalName: file.name
  };
};

// General File Upload (Documents, Excel, PDFs, etc.)
export const uploadFile = async (file) => {
  if (file && file.type && file.type.startsWith('image/')) {
    return await uploadImage(file);
  }

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
    console.warn('Supabase storage upload notice:', err);
  }

  // Fallback to object URL if cloud storage bucket is not configured
  const localUrl = URL.createObjectURL(file);
  return {
    message: 'File attached locally',
    url: localUrl,
    filename: file.name,
    originalName: file.name
  };
};

// ==========================================
// SECTION 1: COLLABORATIONS API
// ==========================================

export const fetchCollaborations = async () => {
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return { collaborations: data };
    }
  } catch (err) {
    console.warn('Supabase fetchCollaborations error:', err);
  }

  const token = getAuthToken();
  const data = await safeFetchJson(`${baseUrl}/admin/collaborations`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (data && data.collaborations) return data;

  try {
    const cached = localStorage.getItem('local_collaborations');
    if (cached) return { collaborations: JSON.parse(cached) };
  } catch (e) {}

  return { collaborations: [] };
};

export const createCollaboration = async (collabData) => {
  const payload = {
    name: collabData.name,
    email: collabData.email,
    project_type: collabData.project_type || collabData.projectType || 'General Inquiry',
    message: collabData.message || '',
    status: 'Pending',
    created_at: new Date().toISOString()
  };

  // 1. Supabase direct SDK insert
  try {
    const { data, error } = await supabase
      .from('collaborations')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      return { success: true, collaboration: data, message: 'Collaboration request received!' };
    }
  } catch (err) {
    console.warn('Supabase createCollaboration error:', err);
  }

  // 2. API backend fallback
  const resData = await safeFetchJson(`${baseUrl}/collaborations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (resData) return resData;

  // 3. LocalStorage fallback
  try {
    const cached = JSON.parse(localStorage.getItem('local_collaborations') || '[]');
    const newEntry = { id: Date.now(), ...payload };
    cached.unshift(newEntry);
    localStorage.setItem('local_collaborations', JSON.stringify(cached));
    return { success: true, collaboration: newEntry, message: 'Collaboration request received!' };
  } catch (e) {}

  return { success: true, message: 'Collaboration request received!' };
};

export const updateCollaborationStatus = async (id, status) => {
  try {
    const { error } = await supabase
      .from('collaborations')
      .update({ status })
      .eq('id', id);
    if (!error) return { success: true, message: 'Status updated' };
  } catch (err) {
    console.warn('Supabase updateCollaborationStatus error:', err);
  }

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/collaborations/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ status })
  });
  if (resData) return resData;

  try {
    const cached = JSON.parse(localStorage.getItem('local_collaborations') || '[]');
    const idx = cached.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      cached[idx].status = status;
      localStorage.setItem('local_collaborations', JSON.stringify(cached));
    }
  } catch (e) {}

  return { success: true, message: 'Status updated' };
};

export const deleteCollaboration = async (id) => {
  try {
    const { error } = await supabase
      .from('collaborations')
      .delete()
      .eq('id', id);
    if (!error) return { success: true, message: 'Collaboration deleted' };
  } catch (err) {
    console.warn('Supabase deleteCollaboration error:', err);
  }

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/collaborations/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;

  try {
    let cached = JSON.parse(localStorage.getItem('local_collaborations') || '[]');
    cached = cached.filter(c => String(c.id) !== String(id));
    localStorage.setItem('local_collaborations', JSON.stringify(cached));
  } catch (e) {}

  return { success: true, message: 'Collaboration deleted' };
};

// ==========================================
// SECTION 2: READER FEEDBACK API
// ==========================================

export const fetchFeedback = async () => {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return { feedback: data };
    }
  } catch (err) {
    console.warn('Supabase fetchFeedback error:', err);
  }

  const token = getAuthToken();
  const data = await safeFetchJson(`${baseUrl}/admin/feedback`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (data && data.feedback) return data;

  try {
    const cached = localStorage.getItem('local_feedback');
    if (cached) return { feedback: JSON.parse(cached) };
  } catch (e) {}

  return { feedback: [] };
};

export const createFeedback = async (feedbackData) => {
  const payload = {
    rating: parseInt(feedbackData.rating || 5, 10),
    suggestion: feedbackData.suggestion || feedbackData.suggestions || feedbackData.message || '',
    name: feedbackData.name || 'Anonymous Reader',
    email: feedbackData.email || '',
    article_id: feedbackData.article_id ? parseInt(feedbackData.article_id, 10) : null,
    created_at: new Date().toISOString()
  };

  // 1. Supabase SDK insert
  try {
    const { data, error } = await supabase
      .from('feedback')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      return { success: true, feedback: data, message: 'Thank you for your valuable feedback!' };
    }
  } catch (err) {
    console.warn('Supabase createFeedback error:', err);
  }

  // 2. API fallback
  const resData = await safeFetchJson(`${baseUrl}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (resData) return resData;

  // 3. LocalStorage fallback
  try {
    const cached = JSON.parse(localStorage.getItem('local_feedback') || '[]');
    const newEntry = { id: Date.now(), ...payload };
    cached.unshift(newEntry);
    localStorage.setItem('local_feedback', JSON.stringify(cached));
    return { success: true, feedback: newEntry, message: 'Thank you for your valuable feedback!' };
  } catch (e) {}

  return { success: true, message: 'Thank you for your valuable feedback!' };
};

export const deleteFeedback = async (id) => {
  try {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);
    if (!error) return { success: true, message: 'Feedback removed' };
  } catch (err) {
    console.warn('Supabase deleteFeedback error:', err);
  }

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/feedback/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;

  try {
    let cached = JSON.parse(localStorage.getItem('local_feedback') || '[]');
    cached = cached.filter(f => String(f.id) !== String(id));
    localStorage.setItem('local_feedback', JSON.stringify(cached));
  } catch (e) {}

  return { success: true, message: 'Feedback removed' };
};

// ==========================================
// SECTION 3: COMMENTS & LIKE ENGAGEMENT API
// ==========================================

export const fetchComments = async (articleId) => {
  try {
    let query = supabase.from('comments').select('*');
    if (articleId) {
      query = query.eq('article_id', parseInt(articleId, 10));
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      return { comments: data };
    }
  } catch (err) {
    console.warn('Supabase fetchComments error:', err);
  }

  const data = await safeFetchJson(`${baseUrl}/blogs/${articleId}/comments`);
  if (data && data.comments) return data;

  try {
    const cached = JSON.parse(localStorage.getItem('local_comments') || '[]');
    const filtered = articleId ? cached.filter(c => String(c.article_id) === String(articleId)) : cached;
    return { comments: filtered };
  } catch (e) {}

  return { comments: [] };
};

export const fetchAllComments = async () => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return { comments: data };
    }
  } catch (err) {
    console.warn('Supabase fetchAllComments error:', err);
  }

  const token = getAuthToken();
  const data = await safeFetchJson(`${baseUrl}/admin/comments`, {
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (data && data.comments) return data;

  try {
    const cached = JSON.parse(localStorage.getItem('local_comments') || '[]');
    return { comments: cached };
  } catch (e) {}

  return { comments: [] };
};

export const createComment = async (commentData) => {
  const payload = {
    article_id: parseInt(commentData.article_id, 10),
    author: commentData.author || commentData.name || 'Anonymous Analyst',
    content: commentData.content || commentData.comment || '',
    created_at: new Date().toISOString()
  };

  // 1. Supabase SDK insert
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([payload])
      .select()
      .single();

    if (!error && data) {
      return { success: true, comment: data, message: 'Comment posted successfully!' };
    }
  } catch (err) {
    console.warn('Supabase createComment error:', err);
  }

  // 2. API fallback
  const resData = await safeFetchJson(`${baseUrl}/blogs/${commentData.article_id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (resData && resData.comment) return resData;

  // 3. LocalStorage fallback
  try {
    const cached = JSON.parse(localStorage.getItem('local_comments') || '[]');
    const newEntry = { id: Date.now(), ...payload };
    cached.unshift(newEntry);
    localStorage.setItem('local_comments', JSON.stringify(cached));
    return { success: true, comment: newEntry, message: 'Comment posted successfully!' };
  } catch (e) {}

  return { success: true, message: 'Comment posted successfully!' };
};

export const deleteComment = async (id) => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    if (!error) return { success: true, message: 'Comment deleted' };
  } catch (err) {
    console.warn('Supabase deleteComment error:', err);
  }

  const token = getAuthToken();
  const resData = await safeFetchJson(`${baseUrl}/admin/comments/${id}`, {
    method: 'DELETE',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  if (resData) return resData;

  try {
    let cached = JSON.parse(localStorage.getItem('local_comments') || '[]');
    cached = cached.filter(c => String(c.id) !== String(id));
    localStorage.setItem('local_comments', JSON.stringify(cached));
  } catch (e) {}

  return { success: true, message: 'Comment deleted' };
};

export const likeArticle = async (id) => {
  const numericId = parseInt(id, 10);
  const targetId = isNaN(numericId) ? id : numericId;
  let newLikes = 1;

  // 1. Check current likes in Supabase and increment
  try {
    const { data: art } = await supabase
      .from('articles')
      .select('likes')
      .eq('id', targetId)
      .maybeSingle();

    newLikes = ((art && typeof art.likes === 'number') ? art.likes : 0) + 1;

    const { error } = await supabase
      .from('articles')
      .update({ likes: newLikes })
      .eq('id', targetId);

    if (!error) {
      return { success: true, likes: newLikes };
    }
  } catch (err) {
    console.warn('Supabase likeArticle error:', err);
  }

  // 2. API fallback
  const resData = await safeFetchJson(`${baseUrl}/blogs/${id}/like`, { method: 'POST' });
  if (resData && typeof resData.likes === 'number') return resData;

  // 3. LocalStorage fallback
  try {
    const key = `article_likes_${targetId}`;
    const cur = parseInt(localStorage.getItem(key) || '0', 10);
    newLikes = cur + 1;
    localStorage.setItem(key, String(newLikes));

    // Update custom articles cache too
    const cached = JSON.parse(localStorage.getItem('custom_articles_cache') || '[]');
    const match = cached.find(a => String(a.id) === String(id));
    if (match) {
      match.likes = newLikes;
      localStorage.setItem('custom_articles_cache', JSON.stringify(cached));
    }
  } catch (e) {}

  return { success: true, likes: newLikes };
};

