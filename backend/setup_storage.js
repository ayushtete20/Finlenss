import pg from 'pg';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function setupBuckets() {
  const client = await pool.connect();
  try {
    console.log('Creating public storage buckets in Supabase...');
    await client.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES 
        ('article-images', 'article-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']),
        ('financial-models', 'financial-models', true, 52428800, NULL)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    // Ensure RLS policies exist on storage.objects
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access All Objects'
        ) THEN
          CREATE POLICY "Public Access All Objects" ON storage.objects FOR SELECT USING (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Insert All Objects'
        ) THEN
          CREATE POLICY "Public Insert All Objects" ON storage.objects FOR INSERT WITH CHECK (true);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Update All Objects'
        ) THEN
          CREATE POLICY "Public Update All Objects" ON storage.objects FOR UPDATE USING (true);
        END IF;
      END $$;
    `);

    console.log(' Storage buckets and RLS policies created successfully!');
    const res = await client.query('SELECT id, name, public FROM storage.buckets;');
    console.table(res.rows);
  } catch (err) {
    console.error(' Error creating storage buckets:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

setupBuckets();
