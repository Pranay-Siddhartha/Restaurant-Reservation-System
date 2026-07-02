const asyncHandler = require('../middlewares/asyncHandler');
const userService = require('../services/userService');

/**
 * @desc    Get current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = { getProfile };
