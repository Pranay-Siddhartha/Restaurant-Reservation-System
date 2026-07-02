const User = require('../models/User');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');

/**
 * Register a new user.
 * @param {object} param0 - { name, email, password }
 * @returns {Promise<{ user: object, token: string }>}
 */
const register = async ({ name, email, password }) => {
  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use.', 409);
  }

  const user = await User.create({ name, email, password });

  const token = generateToken(user._id, user.role);

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

/**
 * Authenticate an existing user.
 * @param {object} param0 - { email, password }
 * @returns {Promise<{ user: object, token: string }>}
 */
const login = async ({ email, password }) => {
  // Explicitly select password (select: false on schema)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id, user.role);

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

module.exports = { register, login };
