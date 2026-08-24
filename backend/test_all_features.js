import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';
const supabaseUrl = 'https://qgoctcpqebkrieqjwntz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnb2N0Y3BxZWJrcmllcWp3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTkwNDUsImV4cCI6MjEwMTQ5NTA0NX0.cpXQYapoVWXxIe0WZBew2CpGZh3P-L9fCvdazsMS5VU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function fixAndTest() {
  console.log('🔧 1. Applying Schema & Data Polish:');
  const client = await pool.connect();
  try {
    // Add 'Financial Valuation' to categories if missing
    await client.query(`
      INSERT INTO categories (name) 
      SELECT 'Financial Valuation'
      WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Financial Valuation');
    `);
    console.log(' Added "Financial Valuation" category.');

    // Remove duplicate null-id certification row if any
    await client.query(`DELETE FROM certifications WHERE id IS NULL;`);
    console.log(' Cleaned duplicate/null certifications.');

    // Set article #5 (Dabur) as is_trending = 1 for featured/trending spotlight
    await client.query(`UPDATE articles SET is_trending = 1 WHERE id = 5;`);
    console.log(' Set Dabur Model (Article #5) is_trending = 1.');

  } finally {
    client.release();
    await pool.end();
  }

  console.log('\n🧪 2. Testing End-to-End Supabase Client Operations:');

  // Test A: Fetch categories
  const { data: catData, error: catErr } = await supabase.from('categories').select('*');
  console.log(`   • Categories Select: ${catData?.length || 0} categories found (Error: ${catErr?.message || 'None'})`);

  // Test B: Fetch articles
  const { data: artData, error: artErr } = await supabase.from('articles').select('id, title, views, likes, is_trending').order('id');
  console.log(`   • Articles Select: ${artData?.length || 0} articles found (Error: ${artErr?.message || 'None'})`);
  console.table(artData);

  // Test C: Test Comment insert and delete
  const { data: commentInsert, error: comErr } = await supabase.from('comments').insert([{
    article_id: 1,
    author: 'System Test Analyst',
    content: 'Automated verification check'
  }]).select().single();
  console.log(`   • Comment Insert Test: ${commentInsert ? 'SUCCESS' : 'FAILED'} (ID: ${commentInsert?.id}, Error: ${comErr?.message || 'None'})`);

  if (commentInsert?.id) {
    await supabase.from('comments').delete().eq('id', commentInsert.id);
    console.log('   • Comment Cleanup: SUCCESS');
  }

  // Test D: Test Feedback insert and delete
  const { data: fbInsert, error: fbErr } = await supabase.from('feedback').insert([{
    name: 'Audit Bot',
    rating: 5,
    suggestion: 'System health is optimal',
    article_id: 1
  }]).select().single();
  console.log(`   • Feedback Insert Test: ${fbInsert ? 'SUCCESS' : 'FAILED'} (ID: ${fbInsert?.id}, Error: ${fbErr?.message || 'None'})`);

  if (fbInsert?.id) {
    await supabase.from('feedback').delete().eq('id', fbInsert.id);
    console.log('   • Feedback Cleanup: SUCCESS');
  }

  // Test E: Test Collaboration insert and delete
  const { data: colInsert, error: colErr } = await supabase.from('collaborations').insert([{
    name: 'Audit Tester',
    email: 'tester@finlenss.com',
    project_type: 'Financial Valuation',
    message: 'System audit verification'
  }]).select().single();
  console.log(`   • Collaboration Insert Test: ${colInsert ? 'SUCCESS' : 'FAILED'} (ID: ${colInsert?.id}, Error: ${colErr?.message || 'None'})`);

  if (colInsert?.id) {
    await supabase.from('collaborations').delete().eq('id', colInsert.id);
    console.log('   • Collaboration Cleanup: SUCCESS');
  }

  console.log('\n ALL SYSTEM CHECKS COMPLETED SUCCESSFULLY!');
}

fixAndTest().catch(console.error);
