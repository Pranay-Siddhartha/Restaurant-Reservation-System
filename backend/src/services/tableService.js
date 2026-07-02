const Table = require('../models/Table');
const Reservation = require('../models/Reservation');
const AppError = require('../utils/AppError');

/**
 * Create a new table.
 *
 * @param {object} data - { tableNumber, capacity, isActive }
 * @returns {Promise<object>} Created table document.
 */
const createTable = async (data) => {
  const existing = await Table.findOne({ tableNumber: data.tableNumber });
  if (existing) {
    throw new AppError(
      `Table number ${data.tableNumber} already exists.`,
      409
    );
  }

  const table = await Table.create(data);
  return table;
};

/**
 * Get all tables with pagination.
 *
 * @param {object} options - { page, limit }
 * @returns {Promise<{ tables, total, page, pages }>}
 */
const getAllTables = async ({ page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [tables, total] = await Promise.all([
    Table.find().sort({ tableNumber: 1 }).skip(skip).limit(limitNum).lean(),
    Table.countDocuments(),
  ]);

  return {
    tables,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

/**
 * Update a table by ID.
 *
 * @param {string} id   - Table ObjectId.
 * @param {object} data - Fields to update.
 * @returns {Promise<object>} Updated table.
 */
const updateTable = async (id, data) => {
  const table = await Table.findById(id);

  if (!table) {
    throw new AppError('Table not found.', 404);
  }

  // Update allowed fields
  if (data.tableNumber !== undefined) table.tableNumber = data.tableNumber;
  if (data.capacity !== undefined) table.capacity = data.capacity;
  if (data.isActive !== undefined) table.isActive = data.isActive;

  await table.save();
  return table;
};

/**
 * Delete a table by ID.
 * Prevents deletion if the table has future confirmed reservations.
 *
 * @param {string} id - Table ObjectId.
 * @returns {Promise<void>}
 */
const deleteTable = async (id) => {
  const table = await Table.findById(id);

  if (!table) {
    throw new AppError('Table not found.', 404);
  }

  // Check for future confirmed reservations on this table
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const futureReservations = await Reservation.countDocuments({
    table: id,
    reservationDate: { $gte: today },
    status: 'confirmed',
  });

  if (futureReservations > 0) {
    throw new AppError(
      'Cannot delete table with future confirmed reservations. Cancel them first.',
      400
    );
  }

  await Table.findByIdAndDelete(id);
};

module.exports = { createTable, getAllTables, updateTable, deleteTable };
