import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://qgoctcpqebkrieqjwntz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnb2N0Y3BxZWJrcmllcWp3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTkwNDUsImV4cCI6MjEwMTQ5NTA0NX0.cpXQYapoVWXxIe0WZBew2CpGZh3P-L9fCvdazsMS5VU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorageAndUpload() {
  console.log('Listing Supabase storage buckets...');
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  console.log('Buckets:', buckets, 'Error:', bError);

  const imagePath = 'C:/Users/ayush/.gemini/antigravity-ide/brain/56a2484e-4e84-4d1b-8a0b-ae77ae8ae44b/.user_uploaded/media_1787581167005.jpg';
  const fileBuffer = fs.readFileSync(imagePath);
  const filename = `india_growth_infrastructure_${Date.now()}.jpg`;

  if (buckets && buckets.length > 0) {
    for (const b of buckets) {
      console.log(`Trying upload to bucket: ${b.name}`);
      const { data, error } = await supabase.storage.from(b.name).upload(filename, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
      if (!error) {
        const { data: publicUrlData } = supabase.storage.from(b.name).getPublicUrl(filename);
        console.log(` Uploaded to Supabase bucket '${b.name}'! Public URL:`, publicUrlData.publicUrl);
        return publicUrlData.publicUrl;
      } else {
        console.warn(`Upload to ${b.name} failed:`, error.message);
      }
    }
  }
  return null;
}

checkStorageAndUpload();
