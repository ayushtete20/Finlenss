import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const sqlQuery = process.argv[2] || 'SELECT id, title, category, author, views FROM articles ORDER BY id DESC LIMIT 10;';

async function runQuery() {
  const client = await pool.connect();
  try {
    console.log(`\n🔍 Executing SQL on Supabase:\n${sqlQuery}\n`);
    const res = await client.query(sqlQuery);
    if (res.rows && res.rows.length > 0) {
      console.table(res.rows);
    } else {
      console.log(`✅ Query executed successfully. Row count / affected: ${res.rowCount || 0}`);
    }
  } catch (err) {
    console.error('❌ SQL Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runQuery();
