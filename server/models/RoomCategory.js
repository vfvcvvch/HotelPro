const mongoose = require('mongoose');

const roomCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Standard', 'Deluxe', 'Executive Suite', 'Presidential Suite']
  },
  description: {
    type: String
  },
  basePrice: {
    type: Number,
    required: true
  },
  maxOccupancy: {
    type: Number,
    required: true,
    default: 2
  }
});

module.exports = mongoose.model('RoomCategory', roomCategorySchema);
