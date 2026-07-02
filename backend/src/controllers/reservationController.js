const asyncHandler = require('../middlewares/asyncHandler');
const reservationService = require('../services/reservationService');

/**
 * @desc    Create a new reservation (auto-assign table)
 * @route   POST /api/reservations
 * @access  Private (customer)
 */
const createReservation = asyncHandler(async (req, res) => {
  const { reservationDate, startTime, endTime, guestCount } = req.body;

  const reservation = await reservationService.createReservation({
    customer: req.user.id,
    reservationDate,
    startTime,
    endTime,
    guestCount,
  });

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully.',
    data: reservation,
  });
});

/**
 * @desc    Get current customer's reservations
 * @route   GET /api/reservations/my
 * @access  Private (customer)
 */
const getMyReservations = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;

  const result = await reservationService.getMyReservations(req.user.id, {
    page,
    limit,
    status,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Cancel a reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private (customer)
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await reservationService.cancelReservation(
    req.user.id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully.',
    data: reservation,
  });
});

/**
 * @desc    Get real-time slot availability
 * @route   GET /api/reservations/availability
 * @access  Private (customer)
 */
const checkAvailability = asyncHandler(async (req, res) => {
  const { date, guests } = req.query;

  if (!date || !guests) {
    return res.status(400).json({
      success: false,
      message: 'Date and guest count are required',
    });
  }

  const guestCount = parseInt(guests, 10);
  const availableSlots = await reservationService.checkAvailability(date, guestCount);

  res.status(200).json({
    success: true,
    data: availableSlots,
  });
});

module.exports = { createReservation, getMyReservations, cancelReservation, checkAvailability };
