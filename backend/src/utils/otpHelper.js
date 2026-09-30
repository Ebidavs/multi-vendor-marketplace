// utils/otpHelper.js

const bcrypt = require('bcryptjs');
const { Otp } = require('../models/otp');
const crypto = require('crypto');

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode() {
  return crypto.randomInt(100000, 999999).toString();
}



async function verifyOtpHelper({ email, otp, purpose }) {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    return { valid: false };
  }

  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id });
    return { valid: false };
  }

  const isMatch = await bcrypt.compare(otp, record.otp);
  if (!isMatch) {
    return { valid: false };
  }

  return { valid: true, record };
}

module.exports = { generateOtpCode, verifyOtpHelper, OTP_EXPIRY_MINUTES };