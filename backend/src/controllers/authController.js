import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'joy@2001';
const JWT_SECRET = process.env.JWT_SECRET || 'financial-blog-secret-key-2026';

export const loginAdmin = (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const token = jwt.sign({ role: 'admin', user: 'Tushar Singh' }, JWT_SECRET, { expiresIn: '24h' });

  return res.json({
    success: true,
    token,
    user: {
      name: 'Tushar Singh',
      title: 'Lead Financial Analyst & Admin',
      role: 'admin'
    }
  });
};

export const verifyAdminStatus = (req, res) => {
  return res.json({ success: true, authenticated: true, user: req.user });
};
