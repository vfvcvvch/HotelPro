const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomCategory'
  },
  roomNumber: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    default: 'Deluxe'
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'cleaning', 'maintenance'],
    default: 'available',
    index: true
  },
  bedType: {
    type: String,
    default: 'King Size Bed'
  },
  roomSizeSqFt: {
    type: Number,
    default: 350
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', roomSchema);
