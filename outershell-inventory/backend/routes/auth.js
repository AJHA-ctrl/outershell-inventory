const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple in-memory user for demo (in production use MongoDB User model)
const users = [
  {
    id: 1,
    name: 'Aniket Jha',
    email: 'admin@outershell.com',
    password: bcrypt.hashSync('outershell123', 10),
    role: 'admin'
  }
];

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'outershell_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET verify token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'outershell_secret');
    res.json({ success: true, user: decoded });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

module.exports = router;
