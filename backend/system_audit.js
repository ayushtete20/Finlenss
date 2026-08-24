import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';
const supabaseUrl = 'https://qgoctcpqebkrieqjwntz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnb2N0Y3BxZWJrcmllcWp3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTkwNDUsImV4cCI6MjEwMTQ5NTA0NX0.cpXQYapoVWXxIe0WZBew2CpGZh3P-L9fCvdazsMS5VU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function fullAudit() {
  console.log('================================================================');
  console.log('📊 FINANCIAL BLOG PLATFORM - FULL SYSTEM HEALTH & DATABASE AUDIT');
  console.log('================================================================\n');

  const client = await pool.connect();
  const report = {};

  try {
    // 1. Check all tables
    console.log('1️⃣ Checking Database Tables & Row Counts:');
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    for (const row of tablesRes.rows) {
      const countRes = await client.query(`SELECT COUNT(*) FROM "${row.table_name}";`);
      report[row.table_name] = parseInt(countRes.rows[0].count, 10);
      console.log(`   • Table '${row.table_name}': ${report[row.table_name]} rows`);
    }

    // 2. Check Articles integrity
    console.log('\n2️⃣ Checking Articles Integrity:');
    const articlesRes = await client.query(`
      SELECT id, title, category, author, views, likes, is_trending, thumbnail_url 
      FROM articles ORDER BY id ASC;
    `);
    console.table(articlesRes.rows);

    // 3. Check Categories
    console.log('\n3️⃣ Checking Categories:');
    const catsRes = await client.query('SELECT * FROM categories ORDER BY id ASC;');
    console.table(catsRes.rows);

    // 4. Check Certifications
    console.log('\n4️⃣ Checking Certifications & Linked Articles:');
    const certsRes = await client.query('SELECT id, title, issuer, article_id, excel_url, cert_doc_url, status FROM certifications ORDER BY id ASC;');
    console.table(certsRes.rows);

    // 5. Check Collaborations
    console.log('\n5️⃣ Checking Collaborations:');
    const collabsRes = await client.query('SELECT id, name, email, project_type, status FROM collaborations ORDER BY id ASC;');
    console.table(collabsRes.rows);

    // 6. Check Feedback
    console.log('\n6️⃣ Checking Feedback:');
    const fbRes = await client.query('SELECT id, name, rating, suggestion, article_id FROM feedback ORDER BY id ASC;');
    console.table(fbRes.rows);

    // 7. Check Comments
    console.log('\n7️⃣ Checking Comments:');
    const commentsRes = await client.query('SELECT id, article_id, author, content FROM comments ORDER BY id ASC;');
    console.table(commentsRes.rows);

    // 8. Check Site Stats
    console.log('\n8️⃣ Checking Site Stats:');
    const statsRes = await client.query('SELECT * FROM site_stats;');
    console.table(statsRes.rows);

    // 9. Check Supabase Storage Buckets
    console.log('\n9️⃣ Checking Supabase Storage Buckets & Files:');
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log('Buckets configured:', buckets?.map(b => b.name));

    for (const b of buckets || []) {
      const { data: files } = await supabase.storage.from(b.name).list();
      console.log(`   • Bucket '${b.name}': ${files?.length || 0} files found:`, files?.map(f => f.name));
    }

  } catch (err) {
    console.error('❌ Audit query error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fullAudit();
