const { NODE_ENV } = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Centralised Express error-handling middleware.
 * Converts known Mongoose / JWT errors into AppError instances and
 * sends a consistent JSON response.
 */
const errorHandler = (err, req, res, _next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  // ── Mongoose bad ObjectId ──────────────────────────────────────
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // ── Mongoose validation error ──────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError(`Validation failed: ${messages.join('. ')}`, 400);
  }

  // ── Mongoose duplicate key (code 11000) ────────────────────────
  if (err.code === 11000) {
    if (err.keyPattern && err.keyPattern.table && err.keyPattern.startTime) {
      error = new AppError('Race condition prevented: This table was just booked by someone else. Please select another slot.', 409);
    } else {
      const field = Object.keys(err.keyValue || {}).join(', ');
      error = new AppError(`Duplicate value for field(s): ${field}. Please use another value.`, 409);
    }
  }

  // ── JWT invalid token ──────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  // ── JWT expired token ──────────────────────────────────────────
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token has expired. Please log in again.', 401);
  }

  // ── Determine final status code & message ──────────────────────
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  const response = {
    success: false,
    status,
    message: error.message || 'Internal Server Error',
  };

  // Include stack trace only in development
  if (NODE_ENV === 'development') {
    response.stack = error.stack || err.stack;
  }

  // In production, hide details of unexpected (non-operational) errors
  if (NODE_ENV === 'production' && !error.isOperational) {
    response.message = 'Something went wrong. Please try again later.';
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
