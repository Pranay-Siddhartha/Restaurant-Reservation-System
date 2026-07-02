const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');
const { JWT_SECRET } = require('../config/env');

/**
 * Protect middleware – verifies the JWT from the Authorization header,
 * looks up the user, and attaches it to req.user.
 */
const protect = asyncHandler(async (req, _res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized. No token provided.', 401);
  }

  // Verify token
  const decoded = jwt.verify(token, JWT_SECRET);

  // Attach user (without password) to the request, using lean for performance
  const user = await User.findById(decoded.id).select('_id role name email').lean();

  if (!user) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  // Map _id to id to preserve compatibility with controllers that use req.user.id
  user.id = user._id.toString();
  req.user = user;
  next();
});

/**
 * Authorize middleware – restricts access to users whose role
 * is included in the provided list.
 *
 * @param  {...string} roles - Allowed roles, e.g. 'admin', 'customer'
 * @returns {Function} Express middleware
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'Forbidden. You do not have permission to perform this action.',
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
