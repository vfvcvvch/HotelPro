const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

const JWT_SECRET = process.env.JWT_SECRET || 'hotelpro_super_secret_jwt_key_2026_xyz987';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (getDBStatus()) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = mockStore.users.find(u => u._id.toString() === decoded.id.toString());
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'anonymous'}' is not authorized to access this endpoint`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
