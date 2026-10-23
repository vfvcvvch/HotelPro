const express = require('express');
const router = express.Router();
const { getHotelReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:hotelId', getHotelReviews);
router.post('/', protect, createReview);

module.exports = router;
