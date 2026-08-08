import db from '../config/db.js';

export const createComment = (req, res) => {
  const { id } = req.params; // article_id
  const { author, content, name, comment } = req.body;

  const finalAuthor = author || name || 'Anonymous Analyst';
  const finalContent = content || comment;

  if (!finalContent) {
    return res.status(400).json({ error: 'Comment content is required.' });
  }

  const sql = `
    INSERT INTO comments (article_id, author, content)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [id, finalAuthor, finalContent], function (err) {
    if (err) {
      console.error('Error saving comment:', err.message);
      return res.status(500).json({ error: 'Failed to record comment.' });
    }

    db.get('SELECT * FROM comments WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(201).json({ message: 'Comment posted successfully', id: this.lastID });
      }
      res.status(201).json({
        message: 'Comment posted successfully',
        comment: row
      });
    });
  });
};

export const getCommentsByArticle = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC`;

  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error fetching comments:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
    res.json({ comments: rows || [] });
  });
};

export const getAllComments = (req, res) => {
  const sql = `SELECT * FROM comments ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching all comments:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve comments.' });
    }
    res.json({ comments: rows || [] });
  });
};

export const deleteComment = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM comments WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete comment.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Comment not found.' });
    }
    res.json({ message: 'Comment deleted successfully', id });
  });
};

export const likeArticle = (req, res) => {
  const { id } = req.params;
  db.run('UPDATE articles SET likes = COALESCE(likes, 0) + 1 WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to like article.' });
    }
    db.get('SELECT likes FROM articles WHERE id = ?', [id], (err, row) => {
      res.json({ success: true, likes: row ? row.likes : 1 });
    });
  });
};
