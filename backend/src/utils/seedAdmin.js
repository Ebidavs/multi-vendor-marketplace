
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('../models/user');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    const existingAdmin = await Admin.findOne({ email: 'admin@yourapp.com' });
    if (existingAdmin) {
      console.log('Admin already exists — skipping seed');
      process.exit();
    }

    if (!process.env.SEED_ADMIN_PASSWORD) {
      console.error('SEED_ADMIN_PASSWORD is not set — cannot seed the first admin');
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD, 10);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@yourapp.com',
      phoneNumber: '08000000000',
      password: hashedPassword,
    });

    await admin.save();

    console.log('First admin created:', admin.email);
    process.exit();

  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();