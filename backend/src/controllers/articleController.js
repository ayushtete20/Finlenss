import db from '../config/db.js';

// Get all articles (with optional search, category, and trending ordering)
export const getAllArticles = (req, res) => {
  const { category, search, sortBy } = req.query;
  let sql = 'SELECT * FROM articles WHERE 1=1';
  const params = [];

  if (category && category !== 'All') {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    sql += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (sortBy === 'trending') {
    sql += ' ORDER BY is_trending DESC, views DESC, created_at DESC';
  } else {
    sql += ' ORDER BY created_at DESC';
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve articles', details: err.message });
    }
    res.json({ articles: rows });
  });
};

// Get single article by ID and increment view/click count
export const getArticleById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM articles WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve article', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Increment article view count and global site click count in background
    db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
    db.run("UPDATE site_stats SET value = value + 1 WHERE key = 'total_clicks'");

    res.json({ article: { ...row, views: row.views + 1 } });
  });
};

// Track global site visit/session
export const trackSiteVisit = (req, res) => {
  db.run("UPDATE site_stats SET value = value + 1 WHERE key = 'total_visits'", function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to track visit' });
    }
    res.json({ success: true });
  });
};

// Track specific article click
export const trackArticleClick = (req, res) => {
  const { id } = req.params;
  db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to track click' });
    }
    db.run("UPDATE site_stats SET value = value + 1 WHERE key = 'total_clicks'");
    res.json({ success: true, articleId: id });
  });
};

// Reset all views and visits to 0
export const resetAllViews = (req, res) => {
  db.run('UPDATE articles SET views = 0', function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to reset article views' });
    }
    db.run("UPDATE site_stats SET value = 0 WHERE key IN ('total_visits', 'total_clicks')", function() {
      res.json({ success: true, message: 'All article views and visits reset to 0' });
    });
  });
};

// Reset single article views to 0
export const resetArticleViewsById = (req, res) => {
  const { id } = req.params;
  db.run('UPDATE articles SET views = 0 WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to reset article views', details: err.message });
    }
    res.json({ success: true, message: `Article #${id} views reset to 0` });
  });
};

// Get analytics stats for Owner Dashboard
export const getSiteStats = (req, res) => {
  db.all("SELECT key, value FROM site_stats", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve stats' });
    }
    
    db.get("SELECT COUNT(*) as total_articles, SUM(views) as total_views FROM articles", [], (err, artRow) => {
      const statsMap = {};
      if (rows) {
        rows.forEach(r => statsMap[r.key] = r.value);
      }
      res.json({
        total_visits: statsMap['total_visits'] || 0,
        total_clicks: (statsMap['total_clicks'] || 0) + (artRow ? artRow.total_views || 0 : 0),
        total_articles: artRow ? artRow.total_articles : 0
      });
    });
  });
};

// Toggle article is_trending status by Owner/Admin
export const toggleTrending = (req, res) => {
  const { id } = req.params;
  const { is_trending } = req.body;

  let sql = 'UPDATE articles SET is_trending = CASE WHEN is_trending = 1 THEN 0 ELSE 1 END WHERE id = ?';
  let params = [id];

  if (typeof is_trending === 'number' || typeof is_trending === 'boolean') {
    sql = 'UPDATE articles SET is_trending = ? WHERE id = ?';
    params = [is_trending ? 1 : 0, id];
  }

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update trending status', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Trending status updated successfully' });
  });
};

// Create new article
export const createArticle = (req, res) => {
  const { title, content, excerpt, category, thumbnail_url, author, read_time, is_trending } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required fields.' });
  }

  const defaultThumbnail = thumbnail_url || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80';
  const defaultAuthor = author || 'Tushar Singh, CFA';
  const defaultReadTime = read_time || '5 min read';
  const generatedExcerpt = excerpt || (content.replace(/[#*`]/g, '').slice(0, 140) + '...');
  const trendingVal = is_trending ? 1 : 0;

  const sql = `
    INSERT INTO articles (title, content, excerpt, category, thumbnail_url, author, read_time, is_trending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [title, content, generatedExcerpt, category, defaultThumbnail, defaultAuthor, defaultReadTime, trendingVal], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to create article', details: err.message });
    }
    res.status(201).json({
      message: 'Article created successfully',
      articleId: this.lastID
    });
  });
};

// Update existing article
export const updateArticle = (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, category, thumbnail_url, author, read_time, is_trending } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required fields.' });
  }

  const generatedExcerpt = excerpt || (content.replace(/[#*`]/g, '').slice(0, 140) + '...');

  let sql = `
    UPDATE articles
    SET title = ?, content = ?, excerpt = ?, category = ?, thumbnail_url = ?, author = ?, read_time = ?
  `;
  let params = [title, content, generatedExcerpt, category, thumbnail_url, author, read_time];

  if (typeof is_trending !== 'undefined') {
    sql += `, is_trending = ?`;
    params.push(is_trending ? 1 : 0);
  }

  sql += ` WHERE id = ?`;
  params.push(id);

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update article', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article updated successfully' });
  });
};

// Delete article
export const deleteArticle = (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    // 1. Delete associated comments
    db.run('DELETE FROM comments WHERE article_id = ?', [id], () => {});
    // 2. Unlink certifications
    db.run('UPDATE certifications SET article_id = NULL WHERE article_id = ?', [id], () => {});
    // 3. Unlink feedback
    db.run('UPDATE feedback SET article_id = NULL WHERE article_id = ?', [id], () => {});
    // 4. Delete article
    db.run('DELETE FROM articles WHERE id = ?', [id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete article', details: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json({ message: 'Article deleted successfully' });
    });
  });
};

// Get all dynamic categories
export const getAllCategories = (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve categories', details: err.message });
    }
    res.json({ categories: rows || [] });
  });
};

// Create a new dynamic category
export const createCategory = (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const trimmedName = name.trim();

  db.run('INSERT INTO categories (name) VALUES (?)', [trimmedName], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Category already exists' });
      }
      return res.status(500).json({ error: 'Failed to create category', details: err.message });
    }
    res.status(201).json({ category: { id: this.lastID, name: trimmedName } });
  });
};

// Delete category by ID
export const deleteCategory = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category removed successfully' });
  });
};
