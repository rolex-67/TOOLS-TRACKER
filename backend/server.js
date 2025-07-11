// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// ✅ Use routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// ✅ Root health check
app.get('/', (req, res) => {
  res.send('Tools Tracker Backend Running');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
