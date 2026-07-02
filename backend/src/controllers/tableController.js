const asyncHandler = require('../middlewares/asyncHandler');
const tableService = require('../services/tableService');

/**
 * @desc    Get all tables
 * @route   GET /api/tables
 * @access  Private
 */
const getAllTables = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await tableService.getAllTables({ page, limit });

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Create a new table
 * @route   POST /api/tables
 * @access  Private (admin)
 */
const createTable = asyncHandler(async (req, res) => {
  const table = await tableService.createTable(req.body);

  res.status(201).json({
    success: true,
    message: 'Table created successfully.',
    data: table,
  });
});

/**
 * @desc    Update a table
 * @route   PATCH /api/tables/:id
 * @access  Private (admin)
 */
const updateTable = asyncHandler(async (req, res) => {
  const table = await tableService.updateTable(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Table updated successfully.',
    data: table,
  });
});

/**
 * @desc    Delete a table
 * @route   DELETE /api/tables/:id
 * @access  Private (admin)
 */
const deleteTable = asyncHandler(async (req, res) => {
  await tableService.deleteTable(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Table deleted successfully.',
  });
});

module.exports = { getAllTables, createTable, updateTable, deleteTable };
