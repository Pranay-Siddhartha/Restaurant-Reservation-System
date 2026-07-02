const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  createTableSchema,
  updateTableSchema,
} = require('../validators/tableValidator');

/**
 * @route   GET /api/tables
 * @desc    Get all tables
 * @access  Private
 */
router.get('/', protect, tableController.getAllTables);

/**
 * @route   POST /api/tables
 * @desc    Create a new table
 * @access  Private (admin)
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  validate(createTableSchema),
  tableController.createTable
);

/**
 * @route   PATCH /api/tables/:id
 * @desc    Update a table
 * @access  Private (admin)
 */
router.patch(
  '/:id',
  protect,
  authorize('admin'),
  validate(updateTableSchema),
  tableController.updateTable
);

/**
 * @route   DELETE /api/tables/:id
 * @desc    Delete a table
 * @access  Private (admin)
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  tableController.deleteTable
);

module.exports = router;
