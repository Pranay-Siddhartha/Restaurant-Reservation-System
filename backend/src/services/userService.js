const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Get a user's profile by their ID.
 * @param {string} userId - Mongoose ObjectId.
 * @returns {Promise<object>} User document (without password).
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password').lean();

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

/**
 * Get all users with optional search/filtering (Admin)
 */
const getAllUsers = async (query = {}) => {
  const filter = {};
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } }
    ];
  }
  if (query.role && query.role !== 'all') {
    filter.role = query.role;
  }

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 }).lean();
  return users;
};

/**
 * Update user role (Admin)
 */
const updateUserRole = async (userId, role) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  user.role = role;
  await user.save();
  return user;
};

/**
 * Delete a user (Admin)
 */
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);

  await user.deleteOne();
  return true;
};

module.exports = { getProfile, getAllUsers, updateUserRole, deleteUser };
