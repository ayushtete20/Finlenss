import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://finlenss.com';
const TODAY = new Date().toISOString().split('T')[0];

const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const articles = [
  {
    id: 1,
    title: 'Global Macro Analysis Q3 2026: Interest Rate Pivots & Inflation Control',
    category: 'Macroeconomics',
    created_at: '2026-07-31',
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    title: 'DeFi 3.0 & Real World Asset Tokenization: The Institutional Gateway',
    category: 'Cryptocurrency',
    created_at: '2026-07-31',
    thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    title: 'Building Tax-Efficient Wealth: A Guide to High Net Worth Asset Location',
    category: 'Wealth Management',
    created_at: '2026-07-31',
    thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    title: 'Quantitative Trading Strategies: Leveraging Machine Learning for Alpha Generation',
    category: 'Quantitative Finance',
    created_at: '2026-07-31',
    thumbnail_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 5,
    title: 'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
    category: 'Financial Valuation',
    created_at: '2026-08-05',
    thumbnail_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80'
  }
];

function generateMainSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n`;
  xml += `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n`;
  xml += `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n`;
  xml += `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n`;

  // Homepage
  xml += `  <url>\n`;
  xml += `    <loc>${BASE_URL}/</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `    <image:image>\n`;
  xml += `      <image:loc>${BASE_URL}/logo.png</image:loc>\n`;
  xml += `      <image:title>Finlenss Financial Insights and Quantitative Intelligence</image:title>\n`;
  xml += `      <image:caption>Finlenss Institutional Financial Research and Valuation Models</image:caption>\n`;
  xml += `    </image:image>\n`;
  xml += `  </url>\n`;

  // Articles
  for (const art of articles) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/post/${art.id}</loc>\n`;
    xml += `    <lastmod>${art.created_at}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${art.id === 5 ? '0.90' : '0.85'}</priority>\n`;
    if (art.thumbnail_url) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(art.thumbnail_url)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(art.title)}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;
  return xml;
}

const mainSitemapPath = path.resolve(__dirname, 'frontend-main/public/sitemap.xml');
fs.writeFileSync(mainSitemapPath, generateMainSitemap(), 'utf-8');
console.log('✅ Generated sitemap.xml for frontend-main at:', mainSitemapPath);
