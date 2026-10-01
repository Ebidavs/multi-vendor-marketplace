// models/otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },   
  purpose: { type: String, enum: ['password-reset', 'account-reactivation'], required: true },   
  expiresAt: { type: Date, required: true },
  }, 
  
  { timestamps: true }

);

Otp = mongoose.model('Otp', otpSchema)
module.exports = { Otp };