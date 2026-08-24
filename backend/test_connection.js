import pg from 'pg';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  console.log('Testing direct connection to Supabase PostgreSQL...');
  try {
    const client = await pool.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log(' Connected to Supabase successfully!');
    console.log('Tables in public schema:');
    console.table(res.rows);
    client.release();
  } catch (err) {
    console.error(' Database connection/query error:', err.message);
  } finally {
    await pool.end();
  }
}

testConnection();
