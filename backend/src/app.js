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

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);

// each teammate should add their own two lines here as their routes are ready


app.use('/api/v1/auth', authRoutes);       // Backend Dev 1
app.use('/api/v1/user', userRoutes);       // Backend Dev 1

// app.use('/api/v1/cart', require('./routes/cartRoutes'));       // Backend Dev 3
// app.use('/api/v1/orders', require('./routes/orderRoutes'));    // Backend Dev 3
// app.use('/api/v1/shops', require('./routes/shopRoutes'));      // Backend Dev 4


// must be registered after every route, this is what catches every error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;