const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

//confirm logged out user
const crypto = require('crypto');
const { RevokedToken } = require('../models/revokedToken');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or missing bearer token',
        data: null,
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided',
        data: null});
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const revoked = await RevokedToken.findOne({ token: tokenHash });
    if (revoked) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token', data: null });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.deletedAt) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
        data: null,
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
        data: null,
      });
    }

    req.user = user;
    req.token = token;
    req.tokenExp = decoded.exp;
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        data: null,
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
      data: null,
    });
  }
};

const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action',
      data: null,
    });
  }
  next();
};

module.exports = { protect, restrictTo };
