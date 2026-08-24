import pg from 'pg';

const connectionString = 'postgresql://postgres:MRsWqilkZIMBlftz@db.qgoctcpqebkrieqjwntz.supabase.co:5432/postgres';
const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function verifyTrendingSorting() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT id, title, category, views, is_trending FROM articles;');
    const articles = res.rows;

    // Exact Home.jsx sorting function
    const sortedByTrending = [...articles].sort((a, b) => {
      const isTrendingA = parseInt(a.is_trending, 10) || 0;
      const isTrendingB = parseInt(b.is_trending, 10) || 0;
      const viewsA = parseInt(a.views, 10) || 0;
      const viewsB = parseInt(b.views, 10) || 0;

      if (isTrendingB !== isTrendingA) {
        return isTrendingB - isTrendingA;
      }
      return viewsB - viewsA;
    });

    console.log('====================================================');
    console.log('🔥 LIVE TRENDING SIDEBAR RANKINGS (Home.jsx logic):');
    console.log('====================================================');

    sortedByTrending.slice(0, 4).forEach((art, idx) => {
      const rank = `0${idx + 1}`;
      const isPinned = (parseInt(art.is_trending, 10) || 0) === 1 ? '📌 PINNED' : '⚪ REGULAR';
      console.log(`Rank ${rank} | ${isPinned.padEnd(10)} | Views: ${String(art.views).padStart(5)} | ID: ${art.id} | ${art.title}`);
    });

  } finally {
    client.release();
    await pool.end();
  }
}

verifyTrendingSorting();
