const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies JWT and attaches the authenticated user to req.user
exports.protect = async (req, res, next) => {
  let token;

  // Expect header format: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    return next(error);
  }

  // Step 1: Verify token signature and expiry (algorithm pinned to prevent alg-confusion attacks)
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch (err) {
    // err.name is TokenExpiredError or JsonWebTokenError —
    // errorHandler.js already has dedicated handling for both, so just pass it through
    return next(err);
  }

  // Step 2: Fetch the user fresh from the DB (ensures role/status is current, not stale token data)
  try {
    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error('Not authorized, user no longer exists');
      error.statusCode = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err); // DB error — errorHandler.js defaults this to 500
  }
};

// Restricts access to admin users only — must run AFTER protect
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    const error = new Error('Access denied: admin privileges required');
    error.statusCode = 403;
    return next(error);
  }
  next();
};