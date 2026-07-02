const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/**
 * Generate a signed JSON Web Token for the given user.
 * @param {string} userId - The Mongoose _id of the user.
 * @param {string} role   - The user's role (e.g. 'admin', 'customer').
 * @returns {string} Signed JWT string.
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
