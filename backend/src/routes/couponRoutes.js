const express = require('express');
const { claimCoupon, getMyCoupons } = require('../controllers/couponController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/claim/:reservationId', protect, authorize('customer'), claimCoupon);
router.get('/my-coupons', protect, authorize('customer'), getMyCoupons);

module.exports = router;
