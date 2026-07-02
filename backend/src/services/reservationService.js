const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const AppError = require('../utils/AppError');

/**
 * Create a reservation with automatic table assignment.
 *
 * Finds the smallest active table that fits the guest count and
 * is not occupied during the requested time window.
 *
 * @param {object} data - { customer, reservationDate, startTime, endTime, guestCount }
 * @returns {Promise<object>} Populated reservation document.
 */
const createReservation = async ({
  customer,
  reservationDate,
  startTime,
  endTime,
  guestCount,
}) => {
  // 1. Find all active tables with sufficient capacity (smallest first)
  const suitableTables = await Table.find({
    isActive: true,
    capacity: { $gte: guestCount },
  })
    .sort({ capacity: 1 })
    .lean();

  if (suitableTables.length === 0) {
    throw new AppError('No tables available with sufficient capacity.', 404);
  }

  // 2. Parse the reservation date to build a date-only range for querying
  const dateObj = new Date(reservationDate + 'T00:00:00.000Z');
  const nextDay = new Date(dateObj);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  // 3. Find all CONFIRMED reservations on the same date whose time overlaps
  const overlappingReservations = await Reservation.find({
    reservationDate: { $gte: dateObj, $lt: nextDay },
    status: 'confirmed',
  }).lean();

  // 4. Determine which tables are occupied during the exact requested start time
  const occupiedTableIds = new Set();

  for (const res of overlappingReservations) {
    if (res.startTime === startTime) {
      occupiedTableIds.add(res.table.toString());
    }
  }

  // 5. Filter out occupied tables
  const availableTables = suitableTables.filter(
    (t) => !occupiedTableIds.has(t._id.toString())
  );

  if (availableTables.length === 0) {
    throw new AppError('No tables available for the selected time.', 409);
  }

  // 6. Assign the first (smallest suitable) available table
  const assignedTable = availableTables[0];

  // 7. Create the reservation
  const reservation = await Reservation.create({
    customer,
    table: assignedTable._id,
    reservationDate: dateObj,
    startTime,
    endTime,
    guestCount,
    status: 'confirmed',
  });

  // 8. Return populated reservation
  const populated = await Reservation.findById(reservation._id)
    .populate('table', 'tableNumber capacity')
    .populate('customer', 'name email');

  return populated;
};

/**
 * Get reservations belonging to a specific customer.
 *
 * @param {string} userId  - Customer's ObjectId.
 * @param {object} options - { page, limit, status }
 * @returns {Promise<{ reservations, total, page, pages }>}
 */
const getMyReservations = async (userId, { page = 1, limit = 10, status }) => {
  const query = { customer: userId };

  if (status) {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const [reservations, total] = await Promise.all([
    Reservation.find(query)
      .sort({ reservationDate: -1, startTime: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('table', 'tableNumber capacity')
      .lean(),
    Reservation.countDocuments(query),
  ]);

  return {
    reservations,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

/**
 * Cancel a reservation (customer action).
 * Only the owning customer can cancel, and only confirmed reservations.
 *
 * @param {string} userId        - Customer's ObjectId.
 * @param {string} reservationId - Reservation ObjectId.
 * @returns {Promise<object>} Updated reservation.
 */
const cancelReservation = async (userId, reservationId) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError('Reservation not found.', 404);
  }

  if (reservation.customer.toString() !== userId) {
    throw new AppError('You are not authorized to cancel this reservation.', 403);
  }

  if (reservation.status !== 'confirmed') {
    throw new AppError('Only confirmed reservations can be cancelled.', 400);
  }

  reservation.status = 'cancelled';
  await reservation.save();

  const populated = await Reservation.findById(reservation._id)
    .populate('table', 'tableNumber capacity')
    .populate('customer', 'name email');

  return populated;
};

/**
 * Get all reservations (admin).
 *
 * @param {object} options - { page, limit, date, status, search }
 * @returns {Promise<{ reservations, total, page, pages }>}
 */
const getAllReservations = async ({
  page = 1,
  limit = 10,
  date,
  status,
  search,
}) => {
  const query = {};

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by specific date
  if (date) {
    const dateObj = new Date(date + 'T00:00:00.000Z');
    const nextDay = new Date(dateObj);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    query.reservationDate = { $gte: dateObj, $lt: nextDay };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  // Build the base query
  let reservationQuery = Reservation.find(query)
    .sort({ reservationDate: -1, startTime: -1 })
    .populate('customer', 'name email')
    .populate('table', 'tableNumber capacity')
    .lean();

  // If there's a search term, we filter after populating
  if (search) {
    // Fetch all matching reservations, then filter by customer name/email
    const allReservations = await reservationQuery.exec();

    const searchLower = search.toLowerCase();
    const filtered = allReservations.filter((r) => {
      if (!r.customer) return false;
      return (
        r.customer.name.toLowerCase().includes(searchLower) ||
        r.customer.email.toLowerCase().includes(searchLower)
      );
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limitNum);

    return {
      reservations: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    };
  }

  // No search – use standard pagination
  const [reservations, total] = await Promise.all([
    reservationQuery.skip(skip).limit(limitNum).exec(),
    Reservation.countDocuments(query),
  ]);

  return {
    reservations,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  };
};

/**
 * Update a reservation (admin).
 *
 * @param {string} reservationId - Reservation ObjectId.
 * @param {object} data          - Fields to update.
 * @returns {Promise<object>} Updated, populated reservation.
 */
const updateReservation = async (reservationId, data) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError('Reservation not found.', 404);
  }

  // Update allowed fields
  const allowedFields = [
    'status',
    'reservationDate',
    'startTime',
    'endTime',
    'guestCount',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'reservationDate') {
        reservation[field] = new Date(data[field] + 'T00:00:00.000Z');
      } else {
        reservation[field] = data[field];
      }
    }
  }

  await reservation.save();

  const populated = await Reservation.findById(reservation._id)
    .populate('table', 'tableNumber capacity')
    .populate('customer', 'name email');

  return populated;
};

/**
 * Cancel a reservation (admin action).
 *
 * @param {string} reservationId - Reservation ObjectId.
 * @returns {Promise<object>} Updated reservation.
 */
const adminCancelReservation = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError('Reservation not found.', 404);
  }

  reservation.status = 'cancelled';
  await reservation.save();

  const populated = await Reservation.findById(reservation._id)
    .populate('table', 'tableNumber capacity')
    .populate('customer', 'name email');

  return populated;
};

/**
 * Get dashboard statistics for the admin panel.
 *
 * @returns {Promise<object>} Stats object.
 */
const getReservationStats = async () => {
  // Today's date range (UTC)
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setUTCDate(todayEnd.getUTCDate() + 1);

  const [
    totalReservations,
    todaysReservations,
    activeReservations,
    totalActiveTables,
    occupiedTablesToday,
  ] = await Promise.all([
    // Total reservations ever
    Reservation.countDocuments(),
    // Today's confirmed reservations
    Reservation.countDocuments({
      reservationDate: { $gte: todayStart, $lt: todayEnd },
      status: 'confirmed',
    }),
    // All currently confirmed reservations
    Reservation.countDocuments({ status: 'confirmed' }),
    // Total active tables
    Table.countDocuments({ isActive: true }),
    // Distinct tables with a confirmed reservation today
    Reservation.distinct('table', {
      reservationDate: { $gte: todayStart, $lt: todayEnd },
      status: 'confirmed',
    }),
  ]);

  const occupancyRate =
    totalActiveTables > 0
      ? Math.round((occupiedTablesToday.length / totalActiveTables) * 100)
      : 0;

  return {
    totalReservations,
    todaysReservations,
    activeReservations,
    totalActiveTables,
    occupancyRate,
  };
};

/**
 * Check real-time availability // The system operates on strict 1-hour slots, so we use direct string matching for max performance.
 *
 * @param {string} date - Date string YYYY-MM-DD
 * @param {number} guestCount - Number of guests
 * @returns {Promise<string[]>} Array of available start times
 */
const checkAvailability = async (date, guestCount) => {
  const suitableTables = await Table.find({
    isActive: true,
    capacity: { $gte: guestCount },
  }).lean();

  if (suitableTables.length === 0) return [];

  const dateObj = new Date(date + 'T00:00:00.000Z');
  const nextDay = new Date(dateObj);
  nextDay.setUTCDate(nextDay.getUTCDate() + 1);

  const overlappingReservations = await Reservation.find({
    reservationDate: { $gte: dateObj, $lt: nextDay },
    status: 'confirmed',
  }).lean();

  const TIME_SLOTS = [
    { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' },
    { start: '13:00', end: '14:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
    { start: '21:00', end: '22:00' },
    { start: '22:00', end: '23:00' },
  ];

  const availableSlots = [];

  for (const slot of TIME_SLOTS) {
    // Count how many reservations exist for this exact start time
    let occupiedCount = 0;
    for (const res of overlappingReservations) {
      if (res.startTime === slot.start) {
        occupiedCount++;
      }
    }

    // If there are still suitable tables left, the slot is available
    if (occupiedCount < suitableTables.length) {
      availableSlots.push(slot.start);
    }
  }

  return availableSlots;
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations,
  updateReservation,
  adminCancelReservation,
  getReservationStats,
  checkAvailability,
};
