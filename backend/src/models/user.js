const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: { 
    type: String, 
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: { 
    type: Date, 
    default: null 
  }
},

  { 
    discriminatorKey: 'role', 
    timestamps: true 
  }
);

const User = mongoose.model('User', userSchema);

const Customer = User.discriminator('customer', new mongoose.Schema({}));

const Vendor = User.discriminator('vendor', new mongoose.Schema({
  businessName: {
    type: String,
    required: true
  },
  businessDescription: {
    type: String,
    required: true
  },
  bankDetails: {
    accountNumber: { type: String },
    accountName: { type: String },
    bankName: { type: String },
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
}));

const Admin = User.discriminator('admin', new mongoose.Schema({}));

module.exports = { User, Customer, Vendor, Admin};