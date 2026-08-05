import db from '../config/db.js';

// Public: Get all certifications
export const getCertifications = (req, res) => {
  const sql = `SELECT * FROM certifications ORDER BY id ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching certifications:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve certifications.' });
    }

    const formatted = (rows || []).map(row => {
      let insightsArr = [];
      if (row.insights) {
        try {
          insightsArr = JSON.parse(row.insights);
        } catch (e) {
          insightsArr = [row.insights];
        }
      }
      return {
        ...row,
        insights: insightsArr,
        // backward-compat: merge old attachment_url -> excel_url if only old field present
        excel_url: row.excel_url || row.attachment_url || null,
        excel_name: row.excel_name || row.attachment_name || null
      };
    });

    res.json({ certifications: formatted });
  });
};

// Admin: Create new certification credential
export const createCertification = (req, res) => {
  const {
    title,
    issuer,
    dates,
    icon,
    article_id,
    article_title,
    article_content,
    insights,
    excel_url,
    excel_name,
    cert_doc_url,
    cert_doc_name,
    status
  } = req.body;

  if (!title || !issuer) {
    return res.status(400).json({ error: 'Title and issuer are required.' });
  }

  const sql = `
    INSERT INTO certifications (
      title, issuer, dates, icon, article_id, article_title, article_content, insights,
      excel_url, excel_name, cert_doc_url, cert_doc_name, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const insightsStr = Array.isArray(insights) ? JSON.stringify(insights) : (insights || '');

  db.run(
    sql,
    [
      title,
      issuer,
      dates || '',
      icon || 'Award',
      article_id || null,
      article_title || '',
      article_content || '',
      insightsStr,
      excel_url || null,
      excel_name || null,
      cert_doc_url || null,
      cert_doc_name || null,
      status || 'Verified'
    ],
    function (err) {
      if (err) {
        console.error('Error creating certification:', err.message);
        return res.status(500).json({ error: 'Failed to create certification record.' });
      }

      db.get('SELECT * FROM certifications WHERE id = ?', [this.lastID], (err, row) => {
        res.status(201).json({
          message: 'Certification created successfully',
          certification: row
        });
      });
    }
  );
};

// Admin: Update certification
export const updateCertification = (req, res) => {
  const { id } = req.params;
  const {
    title,
    issuer,
    dates,
    icon,
    article_id,
    article_title,
    article_content,
    insights,
    excel_url,
    excel_name,
    cert_doc_url,
    cert_doc_name,
    status
  } = req.body;

  const insightsStr = Array.isArray(insights) ? JSON.stringify(insights) : (insights || '');

  const sql = `
    UPDATE certifications
    SET title = ?, issuer = ?, dates = ?, icon = ?, article_id = ?, article_title = ?,
        article_content = ?, insights = ?, excel_url = ?, excel_name = ?,
        cert_doc_url = ?, cert_doc_name = ?, status = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      title,
      issuer,
      dates,
      icon || 'Award',
      article_id || null,
      article_title || '',
      article_content || '',
      insightsStr,
      excel_url || null,
      excel_name || null,
      cert_doc_url || null,
      cert_doc_name || null,
      status || 'Verified',
      id
    ],
    function (err) {
      if (err) {
        console.error('Error updating certification:', err.message);
        return res.status(500).json({ error: 'Failed to update certification.' });
      }
      res.json({ message: 'Certification updated successfully', id });
    }
  );
};

// Admin: Delete certification
export const deleteCertification = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM certifications WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting certification:', err.message);
      return res.status(500).json({ error: 'Failed to delete certification record.' });
    }
    res.json({ message: 'Certification deleted successfully', id });
  });
};
