import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgoctcpqebkrieqjwntz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnb2N0Y3BxZWJrcmllcWp3bnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MTkwNDUsImV4cCI6MjEwMTQ5NTA0NX0.cpXQYapoVWXxIe0WZBew2CpGZh3P-L9fCvdazsMS5VU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
