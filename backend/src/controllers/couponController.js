const Coupon = require('../models/Coupon');
const Reservation = require('../models/Reservation');
const crypto = require('crypto');

/**
 * @desc    Claim a coupon for a completed reservation
 * @route   POST /api/coupons/claim/:reservationId
 * @access  Private (Customer)
 */
exports.claimCoupon = async (req, res, next) => {
  try {
    const { reservationId } = req.params;

    // Check if reservation exists and belongs to user
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    if (reservation.customer.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized for this reservation' });
    }

    if (reservation.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only claim reward for completed reservations' });
    }

    // Check if user has already claimed ANY coupon (One-time reward per account)
    const existingCoupon = await Coupon.findOne({ user: req.user.id });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'You have already claimed your first-time reservation reward!' });
    }

    // Generate unique code
    const uniqueSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
    const code = `DINETOWN-50-${uniqueSuffix}`;

    const coupon = await Coupon.create({
      user: req.user.id,
      reservation: reservationId,
      code,
      discountText: '50% OFF'
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my coupons
 * @route   GET /api/coupons/my-coupons
 * @access  Private (Customer)
 */
exports.getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ user: req.user.id })
      .populate('reservation', 'reservationDate')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: coupons.length, data: coupons });
  } catch (error) {
    next(error);
  }
};
