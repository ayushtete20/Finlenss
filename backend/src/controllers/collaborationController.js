import db from '../config/db.js';

export const createCollaboration = (req, res) => {
  const { name, email, project_type, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  const sql = `
    INSERT INTO collaborations (name, email, project_type, message, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.run(sql, [name, email, project_type || 'Financial Modeling & Valuation', message || ''], function (err) {
    if (err) {
      console.error('Error saving collaboration:', err.message);
      return res.status(500).json({ error: 'Failed to record collaboration request.' });
    }

    db.get('SELECT * FROM collaborations WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(201).json({ message: 'Collaboration request submitted successfully', id: this.lastID });
      }
      res.status(201).json({
        message: 'Collaboration request submitted successfully',
        collaboration: row
      });
    });
  });
};

export const getCollaborations = (req, res) => {
  const sql = `SELECT * FROM collaborations ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching collaborations:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve collaborations.' });
    }
    res.json({ collaborations: rows || [] });
  });
};

export const updateCollaborationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status field is required.' });
  }

  const sql = `UPDATE collaborations SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update collaboration status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Collaboration record not found.' });
    }
    res.json({ message: 'Status updated successfully', id, status });
  });
};

export const deleteCollaboration = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM collaborations WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete collaboration record.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Collaboration record not found.' });
    }
    res.json({ message: 'Collaboration deleted successfully', id });
  });
};
