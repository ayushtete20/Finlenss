import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './config/db.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js';
import collaborationRoutes from './routes/collaborationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Security: Allowed origin checking
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://finlenss.com',
  'https://www.finlenss.com',
  'https://finlenss-portfolio-aayush-6845.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman/cURL/mobile native) or whitelisted domains or any *.vercel.app
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow during staging development
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Rate Limiters
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many login attempts. Please try again in 15 minutes.'
});

const submissionLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Hourly submission limit reached. Please try again later.'
});

// Serve static uploaded assets (Excel, PDFs, documents)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Initialize DB schema and seed data
initDB();

// API routes
app.use('/api/blogs', articleRoutes);
app.use('/api/admin', authLimiter, authRoutes);
app.use('/api', consultationRoutes);
app.use('/api', collaborationRoutes);
app.use('/api', feedbackRoutes);
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
