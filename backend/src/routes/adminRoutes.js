const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  updateReservationSchema,
} = require('../validators/reservationValidator');

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard statistics
 * @access  Private (admin)
 */
router.get('/stats', protect, authorize('admin'), adminController.getStats);

/**
 * @route   GET /api/admin/reservations
 * @desc    Get all reservations
 * @access  Private (admin)
 */
router.get(
  '/reservations',
  protect,
  authorize('admin'),
  adminController.getAllReservations
);

/**
 * @route   PATCH /api/admin/reservations/:id
 * @desc    Update a reservation
 * @access  Private (admin)
 */
router.patch(
  '/reservations/:id',
  protect,
  authorize('admin'),
  validate(updateReservationSchema),
  adminController.updateReservation
);

/**
 * @route   DELETE /api/admin/reservations/:id
 * @desc    Cancel a reservation (admin)
 * @access  Private (admin)
 */
router.delete(
  '/reservations/:id',
  protect,
  authorize('admin'),
  adminController.cancelReservation
);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (admin)
 * @access  Private (admin)
 */
router.get(
  '/users',
  protect,
  authorize('admin'),
  adminController.getAllUsers
);

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Update a user's role (admin)
 * @access  Private (admin)
 */
router.patch(
  '/users/:id/role',
  protect,
  authorize('admin'),
  adminController.updateUserRole
);

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user (admin)
 * @access  Private (admin)
 */
router.delete(
  '/users/:id',
  protect,
  authorize('admin'),
  adminController.deleteUser
);

module.exports = router;
