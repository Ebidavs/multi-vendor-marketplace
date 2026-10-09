const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
  // SHA-256 hash of the JWT access token — never the raw token.
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// Remove revocation records automatically once the token it references expires,
// keeping the collection bounded.
revokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RevokedToken = mongoose.model('RevokedToken', revokedTokenSchema);
module.exports = { RevokedToken };