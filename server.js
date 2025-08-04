const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// Route imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/adminRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();

// Environment config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amaravathi';

// ✅ Allow all origins (CORS)
app.use(cors({ origin: '*', credentials: false }));

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve static profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/vendors', vendorRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🌐 Amaravathi Admin Backend is running successfully!');
});

// ✅ Handle preflight requests (optional if using `cors` like this)
app.options('*', cors());

// Connect to MongoDB and start server
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
