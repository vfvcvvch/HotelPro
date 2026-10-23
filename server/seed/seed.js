require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const ServiceRequest = require('../models/ServiceRequest');
const ActivityLog = require('../models/ActivityLog');
const mockStore = require('../config/mockStore');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Hotel.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      ServiceRequest.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);

    console.log('[Seed] Populating Hotels...');
    const createdHotels = await Hotel.insertMany(mockStore.hotels.map(({ _id, ...h }) => h));

    console.log('[Seed] Populating Users...');
    const createdUsers = await User.insertMany(mockStore.users.map(({ _id, ...u }) => u));

    console.log('[Seed] Populating Rooms...');
    const roomsToInsert = mockStore.rooms.map(({ _id, hotelId, ...r }, idx) => {
      // Map to newly inserted MongoDB hotel ObjectId
      const targetHotel = createdHotels[idx % createdHotels.length];
      return { ...r, hotelId: targetHotel._id };
    });
    const createdRooms = await Room.insertMany(roomsToInsert);

    console.log('[Seed] Populating Sample Bookings & Payments...');
    const booking = await Booking.create({
      bookingNumber: 'MMT-HP-98421',
      userId: createdUsers[0]._id,
      hotelId: createdHotels[0]._id,
      roomId: createdRooms[0]._id,
      guestDetails: {
        name: createdUsers[0].name,
        email: createdUsers[0].email,
        phone: createdUsers[0].phone,
        specialRequests: 'Sea view room with extra pillows'
      },
      checkInDate: new Date('2026-11-05'),
      checkOutDate: new Date('2026-11-08'),
      nights: 3,
      guestsCount: 2,
      basePrice: 16497,
      taxesAndFees: 1979,
      discountAmount: 1649,
      promoCode: 'HOTELPRO20',
      totalAmount: 16827,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed'
    });

    await Payment.create({
      bookingId: booking._id,
      userId: createdUsers[0]._id,
      transactionId: 'TXN-9842183921',
      invoiceNumber: 'INV-2026-00481',
      amount: 16827,
      currency: 'INR',
      paymentMethod: 'card',
      status: 'success'
    });

    console.log('[Seed] Database populated successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
