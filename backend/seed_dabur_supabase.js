import pg from 'pg';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const contentText = `Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company's financial performance.

Key Insights:
• Revenue growth remains steady, supported by the strength of Dabur's FMCG portfolio.
• Gross margins stay resilient despite fluctuations in raw material costs.
• Operating margins improve gradually through better cost management and efficiency.
• Working capital assumptions play a crucial role in determining free cash flow generation.
• Capital expenditure remains disciplined, reflecting an asset-light growth approach.
• Cash flow from operations continues to be the primary source of liquidity.
• Debt levels remain manageable, indicating a strong and stable financial position.
• The integrated model ensures that every financial statement is linked, maintaining balance sheet integrity and accurate cash flow forecasting.
• Sensitivity to revenue growth and operating margins highlights the importance of key forecasting assumptions.`;

const excerptText = `Completed a 3-Statement Financial Model of Dabur India, integrating the Income Statement, Balance Sheet, and Cash Flow Statement to forecast the company's financial performance.`;

async function seedDaburSupabase() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM articles WHERE title ILIKE '%Dabur%'");
    if (res.rows.length === 0) {
      const insertRes = await client.query(`
        INSERT INTO articles (title, content, excerpt, category, thumbnail_url, author, read_time, views, is_trending, likes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, title;
      `, [
        'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
        contentText,
        excerptText,
        'Financial Valuation',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
        'Tushar Singh, CFA',
        '5 min read',
        142,
        1,
        15
      ]);
      console.log('✅ Dabur article inserted into Supabase with ID:', insertRes.rows[0].id);
    } else {
      const existing = res.rows[0];
      await client.query(`
        UPDATE articles 
        SET content = $1, excerpt = $2, is_trending = 1
        WHERE id = $3
      `, [contentText, excerptText, existing.id]);
      console.log('✅ Updated existing Dabur article in Supabase with ID:', existing.id);
    }
  } catch (err) {
    console.error('❌ Error seeding Supabase:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDaburSupabase();
