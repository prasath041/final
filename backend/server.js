const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable not set');
    return;
  }
  
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
  }
};

// Root route (before DB middleware)
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Welcome to FurnitureHub API',
    version: '1.0.0'
  });
});

// Health check route (before DB middleware)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FurnitureHub API is running' });
});

// Middleware to ensure DB connection for each request (serverless-friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database middleware error:', err.message);
    next();
  }
});

// Lazy load routes to catch import errors
const loadRoute = (routePath) => {
  try {
    return require(routePath);
  } catch (err) {
    console.error(`Failed to load route ${routePath}:`, err.message);
    const router = express.Router();
    router.all('*', (req, res) => {
      res.status(500).json({ success: false, message: `Route module error: ${err.message}` });
    });
    return router;
  }
};

// Routes
app.use('/api/auth', loadRoute('./routes/authRoutes'));
app.use('/api/furniture', loadRoute('./routes/furnitureRoutes'));
app.use('/api/categories', loadRoute('./routes/categoryRoutes'));
app.use('/api/bookings', loadRoute('./routes/bookingRoutes'));
app.use('/api/users', loadRoute('./routes/userRoutes'));
app.use('/api/woods', loadRoute('./routes/woodRoutes'));
app.use('/api/doors', loadRoute('./routes/doorRoutes'));
app.use('/api/windows', loadRoute('./routes/windowRoutes'));
app.use('/api/lockers', loadRoute('./routes/lockerRoutes'));
app.use('/api/upload', loadRoute('./routes/uploadRoutes'));
app.use('/api/orders', loadRoute('./routes/orderRoutes'));
app.use('/api/analytics', loadRoute('./routes/analyticsRoutes'));
app.use('/api/delivery', loadRoute('./routes/deliveryRoutes'));
app.use('/api/shopkeeper', loadRoute('./routes/shopkeeperRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!', 
    error: err.message 
  });
});

// Export for Vercel serverless
module.exports = app;

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
