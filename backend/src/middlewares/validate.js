const AppError = require('../utils/AppError');

/**
 * Factory function that returns Express middleware for validating
 * req.body against the supplied Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - A Zod schema to validate against.
 * @returns {Function} Express middleware
 */
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const messages = result.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join('. ');

    throw new AppError(messages, 400);
  }

  // Replace body with the parsed (coerced / transformed) data
  req.body = result.data;
  next();
};

module.exports = validate;
