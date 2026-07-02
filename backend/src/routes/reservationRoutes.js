const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createReservationSchema,
} = require('../validators/reservationValidator');

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation
 * @access  Private (customer)
 */
router.post(
  '/',
  protect,
  authorize('customer'),
  validate(createReservationSchema),
  reservationController.createReservation
);

/**
 * @route   GET /api/reservations/availability
 * @desc    Get real-time availability
 * @access  Private (customer)
 */
router.get(
  '/availability',
  protect,
  authorize('customer'),
  reservationController.checkAvailability
);

/**
 * @route   GET /api/reservations/my
 * @desc    Get customer's own reservations
 * @access  Private (customer)
 */
router.get(
  '/my',
  protect,
  authorize('customer'),
  reservationController.getMyReservations
);

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Cancel a reservation
 * @access  Private (customer)
 */
router.delete(
  '/:id',
  protect,
  authorize('customer'),
  reservationController.cancelReservation
);

module.exports = router;
