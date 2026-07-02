const { z } = require('zod');

/**
 * Zod schema for creating a table.
 */
const createTableSchema = z.object({
  tableNumber: z
    .number({ required_error: 'Table number is required' })
    .int('Table number must be an integer')
    .positive('Table number must be a positive integer'),
  capacity: z
    .number({ required_error: 'Capacity is required' })
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(20, 'Capacity must be at most 20'),
  isActive: z.boolean().optional(),
});

/**
 * Zod schema for updating a table – all fields optional.
 */
const updateTableSchema = z.object({
  tableNumber: z
    .number()
    .int('Table number must be an integer')
    .positive('Table number must be a positive integer')
    .optional(),
  capacity: z
    .number()
    .int('Capacity must be an integer')
    .min(1, 'Capacity must be at least 1')
    .max(20, 'Capacity must be at most 20')
    .optional(),
  isActive: z.boolean().optional(),
});

module.exports = { createTableSchema, updateTableSchema };
