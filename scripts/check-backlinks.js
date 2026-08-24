import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DOMAIN = 'finlenss.com';
const QUERY = `"${TARGET_DOMAIN}" -site:${TARGET_DOMAIN}`;
const REPORT_DIR = path.resolve(__dirname, '../seo-reports');
const REPORT_FILE = path.join(REPORT_DIR, 'backlink-audit.json');

// Blacklist of internal or search-engine artifact domains to exclude
const EXCLUDED_DOMAINS = [
  'finlenss.com',
  'www.finlenss.com',
  'vercel.app',
  'duckduckgo.com',
  'html.duckduckgo.com',
  'localhost',
  '127.0.0.1'
];

/**
 * Clean and decode search engine redirect URLs (e.g., DuckDuckGo /l/?uddg=URL)
 */
function extractActualUrl(rawHref) {
  if (!rawHref) return null;
  
  if (rawHref.includes('uddg=')) {
    try {
      const match = rawHref.match(/uddg=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    } catch (e) {}
  }
  
  if (rawHref.startsWith('//')) {
    return 'https:' + rawHref;
  }
  
  return rawHref.startsWith('http') ? rawHref : null;
}

/**
 * Extract hostname from URL
 */
function getHostname(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

/**
 * Strip HTML tags and entities
 */
function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Fetch HTML search results from DuckDuckGo HTML endpoint
 */
async function fetchDuckDuckGoResults(query) {
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;

  const response = await fetch(searchUrl, {
    method: 'POST',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `q=${encodedQuery}&b=&kl=us-en`
  });

  if (!response.ok) {
    throw new Error(`Search engine responded with HTTP ${response.status} (${response.statusText})`);
  }

  return await response.text();
}

/**
 * Parse DuckDuckGo HTML output into structured mention items
 */
function parseSearchResults(html) {
  const results = [];
  
  // Match standard DuckDuckGo result blocks
  // <div class="result results_links results_links_deep web-result ">
  const resultBlocks = html.split(/class=["']result\s+results_links/gi);

  for (let i = 1; i < resultBlocks.length; i++) {
    const block = resultBlocks[i];

    // Extract URL
    const urlMatch = block.match(/<a[^>]*class=["'][^"']*result__url[^"']*["'][^>]*href=["']([^"']+)["']/i) ||
                     block.match(/<a[^>]*class=["'][^"']*result__snippet[^"']*["'][^>]*href=["']([^"']+)["']/i) ||
                     block.match(/<a[^>]*href=["']([^"']+)["'][^>]*class=["'][^"']*result__url/i) ||
                     block.match(/href=["'](\/\/duckduckgo\.com\/l\/\?[^"']+)["']/i) ||
                     block.match(/href=["'](https?:\/\/[^"']+)["']/i);

    if (!urlMatch) continue;

    const rawHref = urlMatch[1];
    const actualUrl = extractActualUrl(rawHref);
    if (!actualUrl) continue;

    const domain = getHostname(actualUrl);
    if (!domain) continue;

    // Filter out self-domain & internal domains
    const isExcluded = EXCLUDED_DOMAINS.some(
      (excluded) => domain === excluded || domain.endsWith('.' + excluded)
    );
    if (isExcluded) continue;

    // Extract Title
    const titleMatch = block.match(/<a[^>]*class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/a>/i) ||
                       block.match(/<h2[^>]*class=["'][^"']*result__title[^"']*["']>([\s\S]*?)<\/h2>/i) ||
                       block.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
    const title = titleMatch ? cleanText(titleMatch[1]) : 'Untitled Page';

    // Extract Snippet
    const snippetMatch = block.match(/<a[^>]*class=["'][^"']*result__snippet[^"']*["'][^>]*>([\s\S]*?)<\/a>/i) ||
                         block.match(/<div[^>]*class=["'][^"']*result__snippet[^"']*["']>([\s\S]*?)<\/div>/i);
    const snippet = snippetMatch ? cleanText(snippetMatch[1]) : '';

    // Determine Link Type
    const isDirectLink = block.toLowerCase().includes(`href="https://${TARGET_DOMAIN}`) || 
                         block.toLowerCase().includes(`href="http://${TARGET_DOMAIN}`) ||
                         actualUrl.toLowerCase().includes(TARGET_DOMAIN);
    const linkType = isDirectLink ? 'Direct Backlink' : 'Text Mention';

    // Avoid duplicate URLs
    if (!results.some((r) => r.url === actualUrl)) {
      results.push({
        domain,
        url: actualUrl,
        title: title || 'External Resource',
        snippet: snippet || `Mention of ${TARGET_DOMAIN}`,
        linkType
      });
    }
  }

  return results;
}

/**
 * Main Audit Execution
 */
async function runBacklinkAudit() {
  console.log('\n' + '='.repeat(70));
  console.log(`🔍  FINLENSS BACKLINK & WEB MENTION SCANNER`);
  console.log(`🌐  Target Domain:  https://${TARGET_DOMAIN}`);
  console.log(`🔎  Search Query:   ${QUERY}`);
  console.log(`⏱️   Scan Date:      ${new Date().toISOString()}`);
  console.log('='.repeat(70) + '\n');

  let rawHtml = '';
  let mentions = [];

  try {
    console.log('⏳ Querying search engines for referring sources...');
    rawHtml = await fetchDuckDuckGoResults(QUERY);
    mentions = parseSearchResults(rawHtml);
  } catch (err) {
    console.warn(`⚠️  Live search query notice: ${err.message}`);
    // Fallback gracefully
    mentions = [];
  }

  // Aggregate unique domains
  const uniqueDomains = Array.from(new Set(mentions.map((m) => m.domain)));

  // Ensure output directory exists
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }

  // Construct structured audit report
  const auditReport = {
    targetDomain: TARGET_DOMAIN,
    searchQuery: QUERY,
    timestamp: new Date().toISOString(),
    metrics: {
      totalMentions: mentions.length,
      uniqueReferringDomains: uniqueDomains.length,
      directBacklinks: mentions.filter((m) => m.linkType === 'Direct Backlink').length,
      textMentions: mentions.filter((m) => m.linkType === 'Text Mention').length
    },
    referringDomains: uniqueDomains,
    results: mentions
  };

  // Write report to JSON file
  fs.writeFileSync(REPORT_FILE, JSON.stringify(auditReport, null, 2), 'utf-8');

  // Console Reporting
  if (mentions.length > 0) {
    console.log(`✅  Found ${mentions.length} backlink(s) / web mention(s) across ${uniqueDomains.length} unique domain(s):\n`);

    const tableData = mentions.map((m, index) => ({
      '#': index + 1,
      'Source Domain': m.domain,
      'Page Title': m.title.length > 40 ? m.title.substring(0, 37) + '...' : m.title,
      'Type': m.linkType,
      'Referring URL': m.url.length > 55 ? m.url.substring(0, 52) + '...' : m.url
    }));

    console.table(tableData);

    console.log('\n📄 Mention Snippets:');
    mentions.forEach((m, idx) => {
      console.log(`\n[${idx + 1}] ${m.domain} (${m.linkType})`);
      console.log(`    🔗 URL:     ${m.url}`);
      console.log(`    📝 Snippet: "${m.snippet}"`);
    });
  } else {
    console.log('\n' + '─'.repeat(70));
    console.log('⚠️  No external backlinks detected.');
    console.log('💡 Recommended action:');
    console.log('   1. Share https://finlenss.com on LinkedIn, GitHub, X (Twitter), and Reddit.');
    console.log('   2. Submit your sitemap.xml to Google Search Console & Bing Webmaster Tools.');
    console.log('   3. Publish financial models & guest articles on Substack / Medium linking to finlenss.com.');
    console.log('─'.repeat(70));
  }

  console.log(`\n📁 Audit report saved to: ${path.relative(process.cwd(), REPORT_FILE)}\n`);
}

runBacklinkAudit().catch((err) => {
  console.error('❌ Fatal error running backlink audit:', err);
  process.exit(1);
});
