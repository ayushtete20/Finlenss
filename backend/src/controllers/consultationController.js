import db from '../config/db.js';

// Public: Submit a consultation reservation
export const createConsultation = (req, res) => {
  const { name, email, phone, topic, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields.' });
  }

  const sql = `
    INSERT INTO consultations (name, email, phone, topic, message, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  db.run(sql, [name, email, phone || '', topic || 'Financial Valuation', message || ''], function (err) {
    if (err) {
      console.error('Error saving consultation:', err.message);
      return res.status(500).json({ error: 'Failed to record consultation reservation.' });
    }

    db.get('SELECT * FROM consultations WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(201).json({ message: 'Reservation submitted successfully', id: this.lastID });
      }
      res.status(201).json({
        message: 'Reservation submitted successfully',
        consultation: row
      });
    });
  });
};

// Admin: Get all consultation reservations
export const getConsultations = (req, res) => {
  const sql = `SELECT * FROM consultations ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching consultations:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve consultation records.' });
    }
    res.json({ consultations: rows || [] });
  });
};

// Admin: Update consultation status ('Pending', 'Contacted', 'Scheduled', 'Completed')
export const updateConsultationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status field is required.' });
  }

  const sql = `UPDATE consultations SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function (err) {
    if (err) {
      console.error('Error updating consultation status:', err.message);
      return res.status(500).json({ error: 'Failed to update consultation status.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Consultation record not found.' });
    }
    res.json({ message: 'Status updated successfully', id, status });
  });
};

// Admin: Delete a consultation reservation
export const deleteConsultation = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM consultations WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting consultation:', err.message);
      return res.status(500).json({ error: 'Failed to delete consultation record.' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Consultation record not found.' });
    }
    res.json({ message: 'Consultation deleted successfully', id });
  });
};
