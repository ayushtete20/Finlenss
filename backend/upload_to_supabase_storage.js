import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import pg from 'pg';

const supabaseUrl = 'https://qgoctcpqebkrieqjwntz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnb2N0Y3BxZWJrcmllcWp3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTkwNDUsImV4cCI6MjEwMTQ5NTA0NX0.cpXQYapoVWXxIe0WZBew2CpGZh3P-L9fCvdazsMS5VU';
const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadToSupabaseStorage() {
  const imagePath = 'C:/Users/ayush/.gemini/antigravity-ide/brain/56a2484e-4e84-4d1b-8a0b-ae77ae8ae44b/.user_uploaded/media_1787581167005.jpg';
  const fileBuffer = fs.readFileSync(imagePath);
  const filename = `india_growth_infrastructure_${Date.now()}.jpg`;

  console.log(`Uploading ${filename} to Supabase Storage bucket 'article-images'...`);
  const { data, error } = await supabase.storage
    .from('article-images')
    .upload(filename, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error(' Supabase Storage Upload error:', error.message);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('article-images')
    .getPublicUrl(filename);

  const publicUrl = publicUrlData.publicUrl;
  console.log(' Successfully uploaded to Supabase Storage!');
  console.log('Public CDN URL:', publicUrl);

  // Update article ID 1 in Supabase PostgreSQL
  const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    const res = await client.query(
      `UPDATE articles SET thumbnail_url = $1 WHERE id = 1 RETURNING id, title, thumbnail_url;`,
      [publicUrl]
    );
    console.log(' Updated article in Supabase Database:');
    console.table(res.rows);
  } finally {
    client.release();
    await pool.end();
  }
}

uploadToSupabaseStorage();
