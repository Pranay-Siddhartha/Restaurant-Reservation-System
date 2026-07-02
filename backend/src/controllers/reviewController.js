const Review = require('../models/Review');
const Reservation = require('../models/Reservation');

/**
 * @desc    Submit a review for a completed reservation
 * @route   POST /api/reviews/:reservationId
 * @access  Private (Customer)
 */
exports.submitReview = async (req, res, next) => {
  try {
    const { reservationId } = req.params;
    const { rating, comment } = req.body;

    // Check if reservation exists and belongs to user
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this reservation' });
    }

    if (reservation.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed reservations' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ user: req.user.id, reservation: reservationId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this reservation' });
    }

    const review = await Review.create({
      user: req.user.id,
      reservation: reservationId,
      rating,
      comment
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews (for Admin)
 * @route   GET /api/reviews
 * @access  Private (Admin)
 */
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('reservation', 'reservationDate startTime')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};
