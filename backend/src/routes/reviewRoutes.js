const express = require('express');
const { submitReview, getReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/:reservationId', protect, authorize('customer'), submitReview);
router.get('/', protect, authorize('admin'), getReviews);

module.exports = router;
