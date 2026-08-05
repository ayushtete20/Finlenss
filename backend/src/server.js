import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend applications
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Serve static uploaded assets (Excel, PDFs, documents)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Initialize DB schema and seed data
initDB();

// API routes
app.use('/api/blogs', articleRoutes);
app.use('/api/admin', authRoutes);
app.use('/api', consultationRoutes);
app.use('/api', certificationRoutes);
app.use('/api', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Financial Blog API',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send('Financial Blog Platform API Server running on port ' + PORT);
});

app.listen(PORT, () => {
  console.log(`🚀 Financial Blog Platform API Server listening on http://localhost:${PORT}`);
});
