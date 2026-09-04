require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Serve frontend React app if built in client/dist
const path = require('path');
const fs = require('fs');
const clientDistPath = path.join(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root API route fallback
  app.get('/', (req, res) => {
    res.json({
      message: '🚀 AI-Powered Resume Tailor Backend API is running.',
      endpoints: {
        health: '/api/health',
        uploadResume: 'POST /api/upload-resume',
        tailorResume: 'POST /api/tailor-resume',
        exportDocx: 'POST /api/export/docx',
        history: 'GET /api/history'
      }
    });
  });
}

// Optional MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumetailor';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully.'))
  .catch(err => console.log('ℹ️ MongoDB connection skipped/not running. Server will use resilient in-memory mode:', err.message));

app.listen(PORT, () => {
  console.log(`⚡ Server running on http://localhost:${PORT}`);
});
