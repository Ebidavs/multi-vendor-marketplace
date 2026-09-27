require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const adminRoutes =  require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

// each teammate should add their own two lines here as their routes are ready

app.use('/api/auth', authRoutes);       // Backend Dev 1
app.use('/api/user', userRoutes)    // Backend Dev 1
app.use('/api/admin', adminRoutes);                     // Backend Dev 1

// app.use('/api/cart', require('./routes/cartRoutes'));       // Backend Dev 3
// app.use('/api/orders', require('./routes/orderRoutes'));    // Backend Dev 3
// app.use('/api/shops', require('./routes/shopRoutes'));      // Backend Dev 4
// app.use('/api/admin', require('./routes/adminRoutes'));     // Backend Dev 4

// must be registered after every route, this is what catches every error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;