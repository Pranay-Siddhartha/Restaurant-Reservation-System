const asyncHandler = require('../middlewares/asyncHandler');
const reservationService = require('../services/reservationService');
const userService = require('../services/userService');

/**
 * @desc    Get all reservations (admin)
 * @route   GET /api/admin/reservations
 * @access  Private (admin)
 */
const getAllReservations = asyncHandler(async (req, res) => {
  const { page, limit, date, status, search } = req.query;

  const result = await reservationService.getAllReservations({
    page,
    limit,
    date,
    status,
    search,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Update a reservation (admin)
 * @route   PATCH /api/admin/reservations/:id
 * @access  Private (admin)
 */
const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.updateReservation(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: 'Reservation updated successfully.',
    data: reservation,
  });
});

/**
 * @desc    Cancel a reservation (admin)
 * @route   DELETE /api/admin/reservations/:id
 * @access  Private (admin)
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.adminCancelReservation(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully.',
    data: reservation,
  });
});

/**
 * @desc    Get reservation statistics (admin dashboard)
 * @route   GET /api/admin/stats
 * @access  Private (admin)
 */
const getStats = asyncHandler(async (_req, res) => {
  const stats = await reservationService.getReservationStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private (admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers(req.query);
  res.status(200).json({
    success: true,
    data: users,
  });
});

/**
 * @desc    Update user role (admin)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (admin)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role || !['customer', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role.' });
  }

  const user = await userService.updateUserRole(req.params.id, role);
  res.status(200).json({
    success: true,
    message: 'User role updated successfully.',
    data: user,
  });
});

/**
 * @desc    Delete a user (admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User deleted successfully.',
  });
});

module.exports = {
  getAllReservations,
  updateReservation,
  cancelReservation,
  getStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
