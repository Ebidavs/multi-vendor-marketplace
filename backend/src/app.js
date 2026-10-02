require('dotenv').config();

const requiredEnvVars = ['JWT_SECRET', 'EXPIRES_IN'];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const shopRoutes = require('./routes/shopRoutes');
const addressRoutes = require('./routes/addressRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/shops', shopRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1/admin', adminRoutes);

// Unmatched routes return the shared error envelope instead of the default HTML page.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

// Registered last so it catches errors thrown by any route above.
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;