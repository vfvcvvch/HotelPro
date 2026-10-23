const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const ServiceRequest = require('../models/ServiceRequest');
const ActivityLog = require('../models/ActivityLog');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get staff dashboard overview (arrivals, departures, room matrix, tickets)
// @route   GET /api/staff/overview
// @access  Private/Staff/Admin
exports.getStaffOverview = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const bookings = await Booking.find().populate('hotelId').populate('roomId').sort({ createdAt: -1 });
      const rooms = await Room.find().populate('hotelId');
      const serviceRequests = await ServiceRequest.find().sort({ createdAt: -1 });

      const arrivals = bookings.filter(b => b.bookingStatus === 'confirmed');
      const checkedInGuests = bookings.filter(b => b.bookingStatus === 'checked-in');
      const departures = bookings.filter(b => b.bookingStatus === 'checked-in');

      return res.status(200).json({
        success: true,
        data: {
          arrivals,
          checkedInGuests,
          departures,
          rooms,
          serviceRequests
        }
      });
    } else {
      const populatedBookings = mockStore.bookings.map(b => {
        const hotel = mockStore.hotels.find(h => h._id.toString() === b.hotelId.toString());
        const room = mockStore.rooms.find(r => r._id.toString() === b.roomId.toString());
        return { ...b, hotelId: hotel, roomId: room };
      });

      const populatedRooms = mockStore.rooms.map(r => {
        const hotel = mockStore.hotels.find(h => h._id.toString() === r.hotelId.toString());
        return { ...r, hotelId: hotel };
      });

      const arrivals = populatedBookings.filter(b => b.bookingStatus === 'confirmed');
      const checkedInGuests = populatedBookings.filter(b => b.bookingStatus === 'checked-in');
      const departures = populatedBookings.filter(b => b.bookingStatus === 'checked-in');

      return res.status(200).json({
        success: true,
        data: {
          arrivals,
          checkedInGuests,
          departures,
          rooms: populatedRooms,
          serviceRequests: mockStore.serviceRequests
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check-in guest at front desk
// @route   POST /api/staff/check-in/:bookingId
// @access  Private/Staff/Admin
exports.checkInGuest = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (getDBStatus()) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.bookingStatus = 'checked-in';
      await booking.save();

      await Room.findByIdAndUpdate(booking.roomId, { status: 'occupied' });

      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'GUEST_CHECKIN',
        details: `Guest ${booking.guestDetails?.name || 'Customer'} checked into room (${booking.bookingNumber})`
      });

      return res.status(200).json({ success: true, message: 'Guest checked in successfully', data: booking });
    } else {
      const booking = mockStore.bookings.find(b => b._id.toString() === bookingId.toString());
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.bookingStatus = 'checked-in';

      const room = mockStore.rooms.find(r => r._id.toString() === booking.roomId.toString());
      if (room) room.status = 'occupied';

      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'GUEST_CHECKIN',
        details: `Guest ${booking.guestDetails?.name || 'Customer'} checked into room (${booking.bookingNumber})`,
        timestamp: new Date()
      });

      return res.status(200).json({ success: true, message: 'Guest checked in successfully', data: booking });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check-out guest at front desk
// @route   POST /api/staff/check-out/:bookingId
// @access  Private/Staff/Admin
exports.checkOutGuest = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (getDBStatus()) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.bookingStatus = 'checked-out';
      await booking.save();

      // Set room to cleaning so housekeeping team can prepare it
      await Room.findByIdAndUpdate(booking.roomId, { status: 'cleaning' });

      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'GUEST_CHECKOUT',
        details: `Guest ${booking.guestDetails?.name || 'Customer'} checked out. Room set to Cleaning.`
      });

      return res.status(200).json({ success: true, message: 'Guest checked out successfully. Room assigned to cleaning queue.', data: booking });
    } else {
      const booking = mockStore.bookings.find(b => b._id.toString() === bookingId.toString());
      if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

      booking.bookingStatus = 'checked-out';

      const room = mockStore.rooms.find(r => r._id.toString() === booking.roomId.toString());
      if (room) room.status = 'cleaning';

      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'GUEST_CHECKOUT',
        details: `Guest ${booking.guestDetails?.name || 'Customer'} checked out. Room set to Cleaning.`,
        timestamp: new Date()
      });

      return res.status(200).json({ success: true, message: 'Guest checked out successfully. Room assigned to cleaning queue.', data: booking });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update room status (Housekeeping: available, cleaning, maintenance)
// @route   PUT /api/staff/room-status/:roomId
// @access  Private/Staff/Admin
exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { status } = req.body;

    if (!['available', 'occupied', 'cleaning', 'maintenance'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid room status value' });
    }

    if (getDBStatus()) {
      const room = await Room.findByIdAndUpdate(roomId, { status }, { new: true });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'ROOM_STATUS_CHANGE',
        details: `Room ${room.roomNumber} status toggled to '${status}'`
      });

      return res.status(200).json({ success: true, message: `Room status updated to ${status}`, data: room });
    } else {
      const room = mockStore.rooms.find(r => r._id.toString() === roomId.toString());
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      room.status = status;

      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'ROOM_STATUS_CHANGE',
        details: `Room ${room.roomNumber} status toggled to '${status}'`,
        timestamp: new Date()
      });

      return res.status(200).json({ success: true, message: `Room status updated to ${status}`, data: room });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update service ticket status
// @route   PUT /api/staff/service-request/:ticketId
// @access  Private/Staff/Admin
exports.updateServiceRequest = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid ticket status' });
    }

    if (getDBStatus()) {
      const ticket = await ServiceRequest.findByIdAndUpdate(
        ticketId, 
        { status, ...(status === 'completed' ? { completedAt: new Date() } : {}) },
        { new: true }
      );
      return res.status(200).json({ success: true, message: `Ticket updated to ${status}`, data: ticket });
    } else {
      const ticket = mockStore.serviceRequests.find(t => t._id.toString() === ticketId.toString());
      if (!ticket) return res.status(404).json({ success: false, message: 'Service ticket not found' });

      ticket.status = status;
      if (status === 'completed') ticket.completedAt = new Date();

      return res.status(200).json({ success: true, message: `Ticket updated to ${status}`, data: ticket });
    }
  } catch (error) {
    next(error);
  }
};
