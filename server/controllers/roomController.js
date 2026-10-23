const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get rooms with dynamic filters (City, Price Range, Category, Amenities, Capacity)
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const { 
      city, 
      category, 
      minPrice, 
      maxPrice, 
      capacity, 
      amenity, 
      hotelId, 
      status,
      checkIn,
      checkOut
    } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (category) query.categoryName = { $regex: category, $options: 'i' };
      if (status) query.status = status;
      if (capacity) query.capacity = { $gte: Number(capacity) };
      if (hotelId) query.hotelId = hotelId;
      if (amenity) query.amenities = { $in: [amenity] };

      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
      }

      let rooms = await Room.find(query).populate('hotelId');

      if (city) {
        rooms = rooms.filter(r => r.hotelId && r.hotelId.city.toLowerCase().includes(city.toLowerCase()));
      }

      return res.status(200).json({ success: true, count: rooms.length, data: rooms });
    } else {
      let results = mockStore.rooms.map(room => {
        const hotel = mockStore.hotels.find(h => h._id.toString() === room.hotelId.toString());
        return { ...room, hotelId: hotel };
      });

      if (city) {
        results = results.filter(r => r.hotelId && r.hotelId.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (hotelId) {
        results = results.filter(r => r.hotelId && r.hotelId._id.toString() === hotelId.toString());
      }
      if (category) {
        results = results.filter(r => r.categoryName.toLowerCase() === category.toLowerCase());
      }
      if (status) {
        results = results.filter(r => r.status.toLowerCase() === status.toLowerCase());
      }
      if (capacity) {
        results = results.filter(r => r.capacity >= Number(capacity));
      }
      if (minPrice) {
        results = results.filter(r => r.pricePerNight >= Number(minPrice));
      }
      if (maxPrice) {
        results = results.filter(r => r.pricePerNight <= Number(maxPrice));
      }
      if (amenity) {
        results = results.filter(r => r.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase())));
      }

      return res.status(200).json({ success: true, count: results.length, data: results });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room by ID
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const room = await Room.findById(id).populate('hotelId');
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      return res.status(200).json({ success: true, data: room });
    } else {
      const room = mockStore.rooms.find(r => r._id.toString() === id.toString());
      if (!room) {
        return res.status(404).json({ success: false, message: 'Room not found' });
      }
      const hotel = mockStore.hotels.find(h => h._id.toString() === room.hotelId.toString());
      return res.status(200).json({ success: true, data: { ...room, hotelId: hotel } });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for given dates
// @route   POST /api/rooms/check-availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'Room ID, check-in and check-out dates are required' });
    }

    const reqCheckIn = new Date(checkIn);
    const reqCheckOut = new Date(checkOut);

    if (reqCheckIn >= reqCheckOut) {
      return res.status(400).json({ success: false, message: 'Check-out date must be strictly after check-in date' });
    }

    let isAvailable = true;

    if (getDBStatus()) {
      const conflict = await Booking.findOne({
        roomId,
        bookingStatus: { $in: ['confirmed', 'checked-in'] },
        $or: [
          { checkInDate: { $lt: reqCheckOut }, checkOutDate: { $gt: reqCheckIn } }
        ]
      });
      if (conflict) isAvailable = false;
    } else {
      const conflict = mockStore.bookings.find(b => {
        if (b.roomId.toString() !== roomId.toString()) return false;
        if (!['confirmed', 'checked-in'].includes(b.bookingStatus)) return false;
        const bStart = new Date(b.checkInDate);
        const bEnd = new Date(b.checkOutDate);
        return (bStart < reqCheckOut && bEnd > reqCheckIn);
      });
      if (conflict) isAvailable = false;
    }

    return res.status(200).json({
      success: true,
      available: isAvailable,
      message: isAvailable ? 'Room is available for these dates' : 'Room is already booked for selected dates'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
exports.createRoom = async (req, res, next) => {
  try {
    const { hotelId, roomNumber, title, categoryName, pricePerNight, capacity, amenities, images, bedType, roomSizeSqFt } = req.body;

    if (!hotelId || !roomNumber || !title || !pricePerNight) {
      return res.status(400).json({ success: false, message: 'Please provide hotelId, roomNumber, title and price' });
    }

    if (getDBStatus()) {
      const room = await Room.create(req.body);
      return res.status(201).json({ success: true, data: room });
    } else {
      const newRoom = {
        _id: 'r' + Date.now(),
        hotelId,
        roomNumber,
        title,
        categoryName: categoryName || 'Deluxe',
        pricePerNight: Number(pricePerNight),
        capacity: Number(capacity) || 2,
        amenities: amenities || ['Free WiFi', 'Air Conditioning', 'LED TV'],
        images: images && images.length ? images : ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        bedType: bedType || 'King Bed',
        roomSizeSqFt: Number(roomSizeSqFt) || 350,
        status: 'available',
        isFeatured: false,
        createdAt: new Date()
      };
      mockStore.rooms.push(newRoom);
      return res.status(201).json({ success: true, data: newRoom });
    }
  } catch (error) {
    next(error);
  }
};
