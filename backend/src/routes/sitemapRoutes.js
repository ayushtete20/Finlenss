import express from 'express';
import db from '../config/db.js';

const router = express.Router();

// Helper to escape XML special characters
const escapeXml = (unsafe) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// GET /sitemap.xml
router.get(['/sitemap.xml', '/sitemap'], (req, res) => {
  const baseUrl = 'https://finlenss.com';

  db.all('SELECT id, title, category, thumbnail_url, created_at FROM articles ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error generating sitemap:', err.message);
      return res.status(500).send('Error generating sitemap');
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/certifications`, changefreq: 'weekly', priority: '0.85' },
      { loc: `${baseUrl}/skills`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/experience-education`, changefreq: 'monthly', priority: '0.8' },
      { loc: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.8' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
    xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Add static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${page.loc}</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Add dynamic articles
    for (const art of rows || []) {
      const artDate = art.created_at ? new Date(art.created_at).toISOString().split('T')[0] : todayStr;
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/post/${art.id}</loc>\n`;
      xml += `    <lastmod>${artDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.85</priority>\n`;
      if (art.thumbnail_url) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(art.thumbnail_url)}</image:loc>\n`;
        xml += `      <image:title>${escapeXml(art.title)}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.header('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  });
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  const robots = `# Finlenss Production Robots.txt\nUser-agent: *\nAllow: /\nAllow: /post/\nAllow: /about\nAllow: /certifications\nAllow: /skills\nAllow: /experience-education\nAllow: /contact\n\nDisallow: /admin/\nDisallow: /admin\nDisallow: /api/\n\nSitemap: https://finlenss.com/sitemap.xml\nSitemap: https://finlenss-portfolio-aayush-6845.vercel.app/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.send(robots);
});

export default router;
