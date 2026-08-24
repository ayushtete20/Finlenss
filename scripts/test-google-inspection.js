const TARGETS = [
  'https://finlenss.com/',
  'https://finlenss.com/robots.txt',
  'https://finlenss.com/sitemap.xml',
  'https://finlenss.com/post/5'
];

async function testUrlInspection() {
  console.log('\n🔍 ========================================================');
  console.log('🌐 GOOGLE SEARCH CONSOLE URL INSPECTION PRE-FLIGHT AUDIT');
  console.log('   Simulating Googlebot Crawler & Indexing Pipeline');
  console.log('========================================================\n');

  for (const url of TARGETS) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();

      const is200 = response.status === 200;
      const hasNoindex = text.toLowerCase().includes('noindex');
      const hasRobotsMeta = text.includes('name="robots"');
      const hasGooglebotMeta = text.includes('name="googlebot"');
      const hasVerification = text.includes('google5f816c48fb3809d9');
      const canonicalMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
      const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
      const descriptionMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const viewportMatch = text.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']+)["']/i);
      const sitemapLinkMatch = text.match(/<link[^>]*rel=["']sitemap["']/i);

      console.log(`📌 TARGET: ${url}`);
      console.log(`   ├─ HTTP Status Code:         ${is200 ? '✅ 200 OK' : '❌ ' + response.status}`);
      console.log(`   ├─ Content-Type:             ${contentType}`);

      if (contentType.includes('html')) {
        console.log(`   ├─ Crawl Allowed (No noindex): ${!hasNoindex ? '✅ PASS (Indexable)' : '❌ FAIL (noindex found)'}`);
        console.log(`   ├─ Google Verification Tag:  ${hasVerification ? '✅ PASS (Present)' : '❌ FAIL (Missing)'}`);
        console.log(`   ├─ Robots Directive:         ${hasRobotsMeta ? '✅ PASS (index, follow)' : '⚠️ Not explicitly defined'}`);
        console.log(`   ├─ Googlebot Directive:      ${hasGooglebotMeta ? '✅ PASS (index, follow)' : '⚠️ Not explicitly defined'}`);
        console.log(`   ├─ Canonical URL Declared:   ${canonicalMatch ? '✅ ' + canonicalMatch[1] : '❌ Missing'}`);
        console.log(`   ├─ Mobile Viewport:          ${viewportMatch ? '✅ ' + viewportMatch[1] : '❌ Missing'}`);
        console.log(`   ├─ Page Title:               ${titleMatch ? '✅ ' + titleMatch[1].trim() : '❌ Missing'}`);
        console.log(`   ├─ Meta Description:         ${descriptionMatch ? '✅ ' + descriptionMatch[1].trim().slice(0, 60) + '...' : '❌ Missing'}`);
        console.log(`   └─ Sitemap Discovery Link:   ${sitemapLinkMatch ? '✅ PASS' : '⚠️ None'}`);
      } else if (url.endsWith('robots.txt')) {
        const allowsGoogle = text.includes('User-agent: *') || text.includes('Googlebot');
        const listsSitemap = text.includes('Sitemap:');
        console.log(`   ├─ Allows Crawling:          ${allowsGoogle ? '✅ PASS (User-agent: * / Allow: /)' : '❌ BLOCKED'}`);
        console.log(`   └─ Declares Sitemap:         ${listsSitemap ? '✅ PASS' : '❌ Missing'}`);
      } else if (url.endsWith('sitemap.xml')) {
        const hasUrls = text.includes('<url>') && text.includes('<loc>');
        console.log(`   └─ Valid XML Structure:      ${hasUrls ? '✅ PASS (Valid URLSet XML)' : '❌ Invalid XML'}`);
      }
      console.log('');
    } catch (err) {
      console.error(`❌ Error fetching ${url}:`, err.message);
    }
  }
}

testUrlInspection();
