const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['housekeeping', 'room_service', 'maintenance', 'laundry'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    default: 'Front Desk Team'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
