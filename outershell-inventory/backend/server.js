const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'OuterShell API running' }));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/outershell')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
