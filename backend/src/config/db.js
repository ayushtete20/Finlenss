import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Initialize database schema and initial seed data
export const initDB = () => {
  db.serialize(() => {
    // Create Articles Table
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        category TEXT NOT NULL,
        thumbnail_url TEXT,
        author TEXT DEFAULT 'Lead Analyst',
        read_time TEXT DEFAULT '5 min read',
        views INTEGER DEFAULT 0,
        is_trending INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safely add is_trending column if table already exists without it
    db.run(`ALTER TABLE articles ADD COLUMN is_trending INTEGER DEFAULT 0`, () => {});

    // Create Site Visitor & Click Analytics Table
    db.run(`
      CREATE TABLE IF NOT EXISTS site_stats (
        key TEXT PRIMARY KEY,
        value INTEGER DEFAULT 0
      )
    `);

    // Create Categories Table
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Consultation Reservations Table
    db.run(`
      CREATE TABLE IF NOT EXISTS consultations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        topic TEXT DEFAULT 'Financial Valuation',
        message TEXT,
        status TEXT DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Licenses & Certifications Table
    db.run(`
      CREATE TABLE IF NOT EXISTS certifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        dates TEXT,
        icon TEXT DEFAULT 'Award',
        article_id INTEGER,
        article_title TEXT,
        article_content TEXT,
        insights TEXT,
        excel_url TEXT,
        excel_name TEXT,
        cert_doc_url TEXT,
        cert_doc_name TEXT,
        status TEXT DEFAULT 'Verified',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Safely migrate old single attachment columns
    db.run(`ALTER TABLE certifications ADD COLUMN excel_url TEXT`, () => {});
    db.run(`ALTER TABLE certifications ADD COLUMN excel_name TEXT`, () => {});
    db.run(`ALTER TABLE certifications ADD COLUMN cert_doc_url TEXT`, () => {});
    db.run(`ALTER TABLE certifications ADD COLUMN cert_doc_name TEXT`, () => {});
    // Migrate old attachment_url -> excel_url for existing rows
    db.run(`UPDATE certifications SET excel_url = attachment_url, excel_name = attachment_name WHERE excel_url IS NULL AND attachment_url IS NOT NULL`, () => {});

    // Seed default certifications if empty
    db.get('SELECT COUNT(*) as count FROM certifications', [], (err, row) => {
      if (!err && row && row.count === 0) {
        const stmt = db.prepare(`
          INSERT INTO certifications (title, issuer, dates, icon, article_id, article_title, article_content, insights, excel_url, excel_name, cert_doc_url, cert_doc_name, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run([
          'Equity valuation and Financial modelling',
          'Caplexus Capital',
          'Issued Jul 2026 – Expires Jul 2030',
          'Award',
          5,
          'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
          'Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company\'s financial performance.',
          JSON.stringify([
            "Revenue growth remains steady, supported by the strength of Dabur's FMCG portfolio.",
            "Gross margins stay resilient despite fluctuations in raw material costs.",
            "Operating margins improve gradually through better cost management and efficiency.",
            "Working capital assumptions play a crucial role in determining free cash flow generation.",
            "Capital expenditure remains disciplined, reflecting an asset-light growth approach.",
            "Operating cash flow continues to be the primary source of liquidity.",
            "Debt levels remain manageable, indicating a strong and stable financial position.",
            "The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.",
            "Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions."
          ]),
          '/Dabur_India_3_Statement_Financial_Model.xlsx',
          'Dabur_India_3_Statement_Financial_Model.xlsx',
          '/uploads/ECC-CEH-Certificate_page-0001__1__1785995910796.jpg', 'CEH_Certificate.jpg',
          'Verified'
        ]);

        stmt.run(['Financial modelling and analysis', 'PwC India', 'Verified Credential', 'BadgeCheck', null, null, null, null, null, null, null, null, 'Verified']);
        stmt.run(['Microsoft Excel 2013 Certification', 'Great Learning', 'Issued Jul 2022 – Expired Jul 2022', 'Award', null, null, null, null, null, null, null, null, 'Verified']);
        stmt.run(['Fundamentals accounting', 'National Skill Development Corporation', 'Issued Jun 2026', 'BadgeCheck', null, null, null, null, null, null, null, null, 'Verified']);
        stmt.run(['NISM Certifications (NISM-securities market foundation certification)', 'National Institute of Securities Markets (NISM)', 'Issued Apr 2026 – Expires Apr 2029', 'BadgeCheck', null, null, null, null, null, null, null, null, 'Verified']);
        stmt.run(['UpGrad (Financial Analysis / Working Capital Management)', 'UpGrad', 'Issued Feb 2026 – Expires Mar 2028', 'Award', null, null, null, null, null, null, null, null, 'Verified']);
        stmt.run(['skill india certificate for finance', 'Government of India', 'Issued Feb 2026 – Expired Jun 2026', 'Award', null, null, null, null, null, null, null, null, 'Verified']);

        stmt.finalize();
      }
    });

    // Seed default sample consultation if empty
    db.get('SELECT COUNT(*) as count FROM consultations', [], (err, row) => {
      if (!err && row && row.count === 0) {
        db.run(`
          INSERT INTO consultations (name, email, phone, topic, message, status)
          VALUES ('Rajesh Kumar', 'rajesh.kumar@investments.in', '+91 98765 43210', 'Financial Valuation', 'Looking for an executive equity valuation model for our tech startup seed round.', 'Pending')
        `);
      }
    });

    // Initialize visitor and click counters
    db.run(`INSERT OR IGNORE INTO site_stats (key, value) VALUES ('total_visits', 125)`);
    db.run(`INSERT OR IGNORE INTO site_stats (key, value) VALUES ('total_clicks', 0)`);

    // Seed default categories if empty
    db.get('SELECT COUNT(*) as count FROM categories', [], (err, row) => {
      if (!err && row && row.count === 0) {
        const defaultCats = [
          'Stocks',
          'Cryptocurrency',
          'Macroeconomics',
          'Wealth Management',
          'SaaS & Tech',
          'DeFi 3.0'
        ];
        const stmt = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
        defaultCats.forEach(cat => stmt.run(cat));
        stmt.finalize();
      }
    });

    // Check if table is empty, and seed initial financial posts
    db.get('SELECT COUNT(*) as count FROM articles', [], (err, row) => {
      if (err) {
        console.error('Error checking articles count:', err.message);
        return;
      }
      if (row.count === 0) {
        console.log('Seeding initial financial articles into database...');
        const stmt = db.prepare(`
          INSERT INTO articles (title, content, excerpt, category, thumbnail_url, author, read_time, views)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const initialArticles = [
          {
            title: 'Global Macro Analysis Q3 2026: Interest Rate Pivots & Inflation Control',
            excerpt: 'An in-depth breakdown of global central bank shifts, yield curve inversions, and institutional asset allocation strategies in the evolving macroeconomic landscape.',
            category: 'Macroeconomics',
            thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
            author: 'Tushar Singh, CFA',
            read_time: '7 min read',
            views: 1420,
            content: `
# Global Macro Analysis Q3 2026

As central banks navigate complex labor statistics and persistent underlying price pressures, institutional investors are recalculating portfolio durations. 

## Key Monetary Trends

1. **Yield Curve Normalization**: The long-standing inversion in sovereign debt yields is gradually uncoiling, signalling shifts in forward growth expectations.
2. **Equity Valuation Multiples**: High-performing tech sectors continue to command premium price-to-earnings ratios, while defensive sectors offer attractive dividend yields.
3. **Currency Volatility**: Emerging market currencies display resilience as trade flows realign toward high-growth corridors in Asia and Latin America.

### Strategic Portfolio Takeaways

Investors should maintain balanced exposure between inflation-hedged physical commodities, private credit instruments, and high-quality dividend-growth equities.
            `
          },
          {
            title: 'DeFi 3.0 & Real World Asset Tokenization: The Institutional Gateway',
            excerpt: 'How tokenized U.S. Treasury bills and private credit protocols are bridging traditional finance liquidity with decentralized settlement rails.',
            category: 'Cryptocurrency',
            thumbnail_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1000&q=80',
            author: 'Alex Vance',
            read_time: '6 min read',
            views: 980,
            content: `
# The Convergence of Real-World Assets and Blockchain Tech

Real-World Asset (RWA) tokenization has scaled past $15 Billion in Total Value Locked (TVL). Institutional treasury desks are increasingly adopting tokenized money market funds for instant, 24/7 liquidity management.

## Driving Catalysts

- **Instant Settlement**: T+0 settlement cycles eliminate traditional custodian lag.
- **Yield Optimization**: Automated yield routing across audited lending protocols unlocks capital efficiency.
- **Regulatory Clarity**: Standardized compliance frameworks across major financial hubs provide corporate treasurers with legal certainty.
            `
          },
          {
            title: 'Building Tax-Efficient Wealth: A Guide to High Net Worth Asset Location',
            excerpt: 'Optimizing returns by strategically distributing growth equities, bonds, and real estate assets across taxable, tax-deferred, and tax-exempt accounts.',
            category: 'Wealth Management',
            thumbnail_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80',
            author: 'Sophia Chen',
            read_time: '8 min read',
            views: 2150,
            content: `
# Tax Efficiency in High Net Worth Wealth Preservation

Maximizing net investment income is not merely a matter of security selection; it requires precise asset location strategy.

## Three-Tiered Location Strategy

1. **Taxable Brokerage Accounts**: Ideal for broad-market index ETFs and capital gains assets qualified for long-term tax rates.
2. **Tax-Deferred Accounts (Traditional IRA / 401k)**: Best suited for high-yielding corporate bonds and active trading strategies subject to short-term income rates.
3. **Tax-Exempt Accounts (Roth IRA / Roth 401k)**: Reserve for your highest expected growth vehicles, such as early-stage tech growth equities and alternative investments.
            `
          },
          {
            title: 'Quantitative Trading Strategies: Leveraging Machine Learning for Alpha Generation',
            excerpt: 'Exploring statistical arbitrage, algorithmic trend following, and sentiment analysis models transforming modern systematic hedge funds.',
            category: 'Quantitative Finance',
            thumbnail_url: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80',
            author: 'Tushar Singh, CFA',
            read_time: '10 min read',
            views: 3100,
            content: `
# Machine Learning in Systematic Trading

Systematic funds are incorporating natural language processing (NLP) and transformer-based sentiment encoders to evaluate earnings transcripts within seconds of release.

## Key Algorithmic Pillars

- **Factor Modeling**: Combining momentum, value, quality, and low volatility factors into dynamic weighting matrices.
- **Execution Optimization**: Utilizing TWAP and VWAP algorithms to minimize market impact cost during large institutional block orders.
- **Risk Metrics**: Real-time VaR (Value at Risk) stress testing under tail-risk market conditions.
            `
          }
        ];

        initialArticles.forEach((art) => {
          stmt.run([art.title, art.content, art.excerpt, art.category, art.thumbnail_url, art.author, art.read_time, art.views]);
        });
        stmt.finalize();
        console.log('Seeding completed successfully!');
      }
    });
  });
};

export default db;
