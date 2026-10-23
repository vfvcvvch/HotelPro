const Review = require('../models/Review');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get reviews for a hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
exports.getHotelReviews = async (req, res, next) => {
  try {
    const { hotelId } = req.params;

    if (getDBStatus()) {
      const reviews = await Review.find({ hotelId }).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } else {
      const reviews = mockStore.reviews.filter(r => r.hotelId.toString() === hotelId.toString());
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new verified review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { hotelId, roomId, rating, title, comment } = req.body;

    if (!hotelId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide hotelId, rating and comment' });
    }

    if (getDBStatus()) {
      const review = await Review.create({
        userId: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        hotelId,
        roomId,
        rating: Number(rating),
        title: title || 'Verified Guest Review',
        comment
      });
      return res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
    } else {
      const newReview = {
        _id: 'rv' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        hotelId,
        roomId,
        rating: Number(rating),
        title: title || 'Verified Guest Review',
        comment,
        createdAt: new Date()
      };
      mockStore.reviews.unshift(newReview);
      return res.status(201).json({ success: true, message: 'Review submitted successfully', data: newReview });
    }
  } catch (error) {
    next(error);
  }
};
