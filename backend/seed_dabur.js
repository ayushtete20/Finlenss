import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath);

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

db.get('SELECT * FROM articles WHERE title LIKE ?', ['%Dabur%'], (err, row) => {
  if (err) {
    console.error('Error checking DB:', err);
    process.exit(1);
  }
  if (!row) {
    db.run(
      `INSERT INTO articles (title, content, excerpt, category, thumbnail_url, author, read_time, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Equity Valuation & Financial Modelling — Dabur India 3-Statement Model',
        contentText,
        excerptText,
        'Financial Valuation',
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
        'Tushar Singh, CFA',
        '5 min read',
        0
      ],
      function (err) {
        if (err) {
          console.error('Error inserting Dabur article:', err);
        } else {
          console.log('Dabur article inserted successfully with ID:', this.lastID);
        }
        db.close();
      }
    );
  } else {
    // Update existing row to ensure content matches exact prompt
    db.run(
      `UPDATE articles SET content = ?, excerpt = ? WHERE id = ?`,
      [contentText, excerptText, row.id],
      (err) => {
        console.log('Updated existing Dabur article ID:', row.id);
        db.close();
      }
    );
  }
});
