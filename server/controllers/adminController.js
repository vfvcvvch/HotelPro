const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Payment = require('../models/Payment');
const ActivityLog = require('../models/ActivityLog');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get executive dashboard metrics, charts data & logs
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    let totalRevenue = 0;
    let totalBookings = 0;
    let activeBookings = 0;
    let totalRooms = 0;
    let occupiedRooms = 0;
    let totalUsers = 0;
    let recentLogs = [];

    if (getDBStatus()) {
      const bookings = await Booking.find();
      const rooms = await Room.find();
      const users = await User.find();
      recentLogs = await ActivityLog.find().sort({ timestamp: -1 }).limit(10);

      totalBookings = bookings.length;
      activeBookings = bookings.filter(b => ['confirmed', 'checked-in'].includes(b.bookingStatus)).length;
      totalRevenue = bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      totalRooms = rooms.length;
      occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
      totalUsers = users.length;
    } else {
      totalBookings = mockStore.bookings.length;
      activeBookings = mockStore.bookings.filter(b => ['confirmed', 'checked-in'].includes(b.bookingStatus)).length;
      totalRevenue = mockStore.bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

      totalRooms = mockStore.rooms.length;
      occupiedRooms = mockStore.rooms.filter(r => r.status === 'occupied').length;
      totalUsers = mockStore.users.length;
      recentLogs = mockStore.activityLogs.slice(0, 10);
    }

    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // Monthly revenue chart series
    const monthlyRevenue = [
      { month: 'Jun', revenue: 42000, bookings: 6 },
      { month: 'Jul', revenue: 58000, bookings: 8 },
      { month: 'Aug', revenue: 64500, bookings: 9 },
      { month: 'Sep', revenue: 78000, bookings: 12 },
      { month: 'Oct', revenue: 89000, bookings: 15 },
      { month: 'Nov', revenue: totalRevenue > 0 ? totalRevenue : 95000, bookings: totalBookings + 5 }
    ];

    // Room categories occupancy chart series
    const categoryDistribution = [
      { category: 'Deluxe', rooms: 5, occupied: 2 },
      { category: 'Executive Suite', rooms: 2, occupied: 1 },
      { category: 'Presidential', rooms: 2, occupied: 0 },
      { category: 'Standard', rooms: 1, occupied: 0 }
    ];

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalBookings,
        activeBookings,
        totalRooms,
        occupiedRooms,
        occupancyRate,
        totalUsers,
        monthlyRevenue,
        categoryDistribution,
        recentLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    if (getDBStatus()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    } else {
      const sanitized = mockStore.users.map(({ password, ...rest }) => rest);
      return res.status(200).json({ success: true, count: sanitized.length, data: sanitized });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['guest', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    if (getDBStatus()) {
      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.status(200).json({ success: true, message: `Role updated to ${role}`, data: user });
    } else {
      const user = mockStore.users.find(u => u._id.toString() === id.toString());
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.role = role;
      const { password, ...rest } = user;
      return res.status(200).json({ success: true, message: `Role updated to ${role}`, data: rest });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update room price / seasonal surge
// @route   PUT /api/admin/rooms/:id/price
// @access  Private/Admin
exports.updateRoomPrice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { pricePerNight } = req.body;

    if (!pricePerNight || Number(pricePerNight) <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid price' });
    }

    if (getDBStatus()) {
      const room = await Room.findByIdAndUpdate(id, { pricePerNight: Number(pricePerNight) }, { new: true });
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      await ActivityLog.create({
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'PRICE_UPDATE',
        details: `Updated room ${room.roomNumber} price to ₹${pricePerNight}`
      });

      return res.status(200).json({ success: true, message: 'Room price updated successfully', data: room });
    } else {
      const room = mockStore.rooms.find(r => r._id.toString() === id.toString());
      if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

      room.pricePerNight = Number(pricePerNight);

      mockStore.activityLogs.unshift({
        _id: 'log' + Date.now(),
        userId: req.user._id,
        userName: req.user.name,
        role: req.user.role,
        action: 'PRICE_UPDATE',
        details: `Updated room ${room.roomNumber} price to ₹${pricePerNight}`,
        timestamp: new Date()
      });

      return res.status(200).json({ success: true, message: 'Room price updated successfully', data: room });
    }
  } catch (error) {
    next(error);
  }
};
