import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Target frontend public upload dirs for instant client asset serving
const portfolioPublicUploads = path.resolve(__dirname, '../../../frontend-portfolio/public/uploads');
const mainPublicUploads = path.resolve(__dirname, '../../../frontend-main/public/uploads');

[portfolioPublicUploads, mainPublicUploads].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${basename}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const allowedExtensions = /^\.(xlsx|xls|csv|pdf|jpg|jpeg|png|gif|doc|docx)$/i;

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only Excel, PDF, Word, and Image files are permitted.'));
    }
  }
});

const router = express.Router();

router.post('/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filename = req.file.filename;
  const srcPath = req.file.path;

  // Copy to frontends for instant file download availability
  try {
    [portfolioPublicUploads, mainPublicUploads].forEach(dir => {
      fs.copyFileSync(srcPath, path.join(dir, filename));
    });
  } catch (err) {
    console.warn('Syncing uploaded file to frontends failed:', err.message);
  }

  const fileUrl = `/uploads/${filename}`;
  res.json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

export default router;
