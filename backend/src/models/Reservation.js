const mongoose = require('mongoose');

/**
 * Reservation schema linking a customer to a table at a specific date/time.
 */
const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required'],
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table is required'],
  },
  reservationDate: {
    type: Date,
    required: [true, 'Reservation date is required'],
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required'],
    min: [1, 'Guest count must be at least 1'],
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient overlap / availability queries
reservationSchema.index({ table: 1, reservationDate: 1, status: 1 });
reservationSchema.index({ reservationDate: 1, status: 1 });

// Partial Unique Index to completely prevent Race Condition double-bookings
reservationSchema.index(
  { table: 1, reservationDate: 1, startTime: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

module.exports = mongoose.model('Reservation', reservationSchema);
