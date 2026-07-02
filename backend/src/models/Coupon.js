const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountText: {
    type: String,
    required: true,
    default: '10% OFF',
  },
  isUsed: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

// A user can only claim one coupon per reservation
couponSchema.index({ user: 1, reservation: 1 }, { unique: true });

module.exports = mongoose.model('Coupon', couponSchema);
