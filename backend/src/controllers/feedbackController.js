import db from '../config/db.js';

export const createFeedback = (req, res) => {
  const { rating, suggestion, name, email, article_id } = req.body;

  const sql = `
    INSERT INTO feedback (rating, suggestion, name, email, article_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [rating || 5, suggestion || '', name || 'Anonymous Reader', email || '', article_id || null], function (err) {
    if (err) {
      console.error('Error saving feedback:', err.message);
      return res.status(500).json({ error: 'Failed to record feedback.' });
    }

    db.get('SELECT * FROM feedback WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(201).json({ message: 'Feedback submitted successfully', id: this.lastID });
      }
      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: row
      });
    });
  });
};

export const getFeedback = (req, res) => {
  const sql = `SELECT * FROM feedback ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching feedback:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve feedback.' });
    }
    res.json({ feedback: rows || [] });
  });
};

export const deleteFeedback = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM feedback WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete feedback record.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Feedback record not found.' });
    }
    res.json({ message: 'Feedback deleted successfully', id });
  });
};
