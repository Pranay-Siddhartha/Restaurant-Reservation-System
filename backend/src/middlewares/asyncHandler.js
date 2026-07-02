/**
 * Higher-order function that wraps an async Express route handler
 * so that any rejected promise is automatically forwarded to
 * Express's next() error handler.
 *
 * @param {Function} fn - Async route handler (req, res, next) => Promise
 * @returns {Function} Express middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
