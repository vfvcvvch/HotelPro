const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide hotel name'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide city location'],
    trim: true,
    index: true
  },
  address: {
    type: String,
    required: [true, 'Please provide full address']
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4
  },
  bannerImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);
