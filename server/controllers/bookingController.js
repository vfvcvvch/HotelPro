const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Payment = require('../models/Payment');
const ActivityLog = require('../models/ActivityLog');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Create new room reservation & payment record
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomId,
      checkInDate,
      checkOutDate,
      guestsCount = 1,
      guestDetails,
      promoCode = '',
      paymentMethod = 'card'
    } = req.body;

    if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: 'Please provide hotelId, roomId, check-in and check-out dates' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const diffTime = Math.abs(checkOut - checkIn);
    const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let room, hotel;

    if (getDBStatus()) {
      room = await Room.findById(roomId);
      hotel = await Hotel.findById(hotelId);
    } else {
      room = mockStore.rooms.find(r => r._id.toString() === roomId.toString());
      hotel = mockStore.hotels.find(h => h._id.toString() === hotelId.toString());
    }

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Availability validation check
    let isAvailable = true;
    if (getDBStatus()) {
      const conflict = await Booking.findOne({
        roomId,
        bookingStatus: { $in: ['confirmed', 'checked-in'] },
        $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }]
      });
      if (conflict) isAvailable = false;
    } else {
      const conflict = mockStore.bookings.find(b => {
        if (b.roomId.toString() !== roomId.toString()) return false;
        if (!['confirmed', 'checked-in'].includes(b.bookingStatus)) return false;
        return new Date(b.checkInDate) < checkOut && new Date(b.checkOutDate) > checkIn;
      });
      if (conflict) isAvailable = false;
    }

    if (!isAvailable) {
      return res.status(400).json({ success: false, message: 'Room is already booked for selected dates. Please pick alternative dates or room.' });
    }

    // Pricing calculation
    const basePrice = room.pricePerNight * nights;
    let discountAmount = 0;
    if (promoCode && promoCode.toUpperCase() === 'HOTELPRO20') {
      discountAmount = Math.round(basePrice * 0.20); // 20% discount
    }

    const taxesAndFees = Math.round((basePrice - discountAmount) * 0.12); // 12% GST
    const totalAmount = (basePrice - discountAmount) + taxesAndFees;

    const bookingNumber = 'MMT-HP-' + Math.floor(10000 + Math.random() * 90000);
    const transactionId = 'TXN-' + Date.now();
    const invoiceNumber = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);

    const bookingPayload = {
      bookingNumber,
      userId: req.user._id,
      hotelId,
      roomId,
      guestDetails: {
        name: guestDetails?.name || req.user.name,
        email: guestDetails?.email || req.user.email,
        phone: guestDetails?.phone || req.user.phone || '+91 9876543210',
        specialRequests: guestDetails?.specialRequests || ''
      },
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nights,
      guestsCount: Number(guestsCount) || 1,
      basePrice,
      taxesAndFees,
      discountAmount,
      promoCode,
      totalAmount,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: new Date()
    };

    let createdBooking, createdPayment;

    if (getDBStatus()) {
      createdBooking = await Booking.create(bookingPayload);
      createdPayment = await Payment.create({
        bookingId: createdBooking._id,
        userId: req.user._id,
        transactionId,
        invoiceNumber,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod,
        status: 'success'
      });
      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'BOOKING_CREATED',
        details: `Reserved room ${room.roomNumber} at ${hotel?.name || 'Hotel'} (${bookingNumber}) for ₹${totalAmount}`
      });
    } else {
      createdBooking = {
        _id: 'b' + Date.now(),
        ...bookingPayload
      };
      createdPayment = {
        _id: 'p' + Date.now(),
        bookingId: createdBooking._id,
        userId: req.user._id,
        transactionId,
        invoiceNumber,
        amount: totalAmount,
        currency: 'INR',
        paymentMethod,
        status: 'success',
        paidAt: new Date()
      };
      mockStore.bookings.unshift(createdBooking);
      mockStore.payments.unshift(createdPayment);
      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'BOOKING_CREATED',
        details: `Reserved room ${room.roomNumber} at ${hotel?.name || 'Hotel'} (${bookingNumber}) for ₹${totalAmount}`,
        timestamp: new Date()
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: {
        booking: createdBooking,
        payment: createdPayment,
        hotel,
        room
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for currently logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const bookings = await Booking.find({ userId: req.user._id })
        .populate('hotelId')
        .populate('roomId')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const userBookings = mockStore.bookings
        .filter(b => b.userId.toString() === req.user._id.toString())
        .map(b => {
          const hotel = mockStore.hotels.find(h => h._id.toString() === b.hotelId.toString());
          const room = mockStore.rooms.find(r => r._id.toString() === b.roomId.toString());
          const payment = mockStore.payments.find(p => p.bookingId.toString() === b._id.toString());
          return { ...b, hotelId: hotel, roomId: room, payment };
        });

      return res.status(200).json({ success: true, count: userBookings.length, data: userBookings });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking and initiate refund
// @route   POST /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Plans changed' } = req.body;

    if (getDBStatus()) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.cancellationReason = reason;
      booking.cancelledAt = new Date();
      await booking.save();

      await Payment.findOneAndUpdate(
        { bookingId: booking._id },
        { status: 'refunded' }
      );

      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'BOOKING_CANCELLED',
        details: `Cancelled booking ${booking.bookingNumber}. Reason: ${reason}`
      });

      return res.status(200).json({ success: true, message: 'Booking cancelled and 100% refund initiated', data: booking });
    } else {
      const bookingIndex = mockStore.bookings.findIndex(b => b._id.toString() === id.toString());
      if (bookingIndex === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      const booking = mockStore.bookings[bookingIndex];
      if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      booking.cancellationReason = reason;
      booking.cancelledAt = new Date();

      const payment = mockStore.payments.find(p => p.bookingId.toString() === id.toString());
      if (payment) payment.status = 'refunded';

      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'BOOKING_CANCELLED',
        details: `Cancelled booking ${booking.bookingNumber}. Reason: ${reason}`,
        timestamp: new Date()
      });

      return res.status(200).json({ success: true, message: 'Booking cancelled and 100% refund initiated', data: booking });
    }
  } catch (error) {
    next(error);
  }
};
