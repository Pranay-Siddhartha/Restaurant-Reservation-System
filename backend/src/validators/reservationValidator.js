const { z } = require('zod');

/**
 * Helper: validate HH:mm format.
 */
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Helper: convert "HH:mm" to total minutes since midnight.
 * @param {string} time
 * @returns {number}
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Zod schema for creating a reservation.
 */
const createReservationSchema = z
  .object({
    reservationDate: z
      .string({ required_error: 'Reservation date is required' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .refine(
        (val) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selected = new Date(val + 'T00:00:00');
          return selected >= today;
        },
        { message: 'Reservation date must be today or in the future' }
      ),
    startTime: z
      .string({ required_error: 'Start time is required' })
      .regex(timeRegex, 'Start time must be in HH:mm format'),
    endTime: z
      .string({ required_error: 'End time is required' })
      .regex(timeRegex, 'End time must be in HH:mm format'),
    guestCount: z
      .number({ required_error: 'Guest count is required' })
      .int('Guest count must be an integer')
      .min(1, 'Guest count must be at least 1')
      .max(20, 'Guest count must be at most 20'),
  })
  .refine(
    (data) => timeToMinutes(data.endTime) > timeToMinutes(data.startTime),
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

/**
 * Zod schema for updating a reservation (admin).
 * All fields are optional so partial updates are supported.
 */
const updateReservationSchema = z.object({
  status: z
    .enum(['confirmed', 'cancelled', 'completed'], {
      invalid_type_error: 'Status must be confirmed, cancelled, or completed',
    })
    .optional(),
  reservationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  startTime: z
    .string()
    .regex(timeRegex, 'Start time must be in HH:mm format')
    .optional(),
  endTime: z
    .string()
    .regex(timeRegex, 'End time must be in HH:mm format')
    .optional(),
  guestCount: z
    .number()
    .int('Guest count must be an integer')
    .min(1, 'Guest count must be at least 1')
    .max(20, 'Guest count must be at most 20')
    .optional(),
});

module.exports = { createReservationSchema, updateReservationSchema };
