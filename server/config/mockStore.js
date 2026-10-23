const bcrypt = require('bcryptjs');

// Realistic MakeMyTrip style hotel images & rooms
const hotelsData = [
  {
    _id: 'h101',
    name: 'The Grand Azure Beach Resort & Spa',
    city: 'Goa',
    address: 'Calangute Beach Road, North Goa, 403516',
    starRating: 5,
    bannerImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A luxurious 5-star beachfront haven nestled along the Arabian Sea. Enjoy infinity pools, private beach cabanas, multi-cuisine dining, and Ayurvedic spa treatments.',
    amenities: ['Free WiFi', 'Swimming Pool', 'Private Beach', 'Spa & Wellness', 'Free Breakfast', 'Airport Shuttle', 'Bar & Lounge'],
    isFeatured: true
  },
  {
    _id: 'h102',
    name: 'The Imperial Heights & Suites',
    city: 'Mumbai',
    address: 'Senapati Bapat Marg, Lower Parel, Mumbai, 400013',
    starRating: 5,
    bannerImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Towering above the financial capital, offering panoramic skyline and sea views, award-winning international dining, rooftop observatory lounge, and premier conference suites.',
    amenities: ['Free High-Speed WiFi', 'Rooftop Infinity Pool', 'Fitness Center', 'Valet Parking', 'Fine Dining', 'Business Center'],
    isFeatured: true
  },
  {
    _id: 'h103',
    name: 'Rajmahal Palace Heritage Sanctuary',
    city: 'Jaipur',
    address: 'Civil Lines, Sardar Patel Marg, Jaipur, 302006',
    starRating: 5,
    bannerImage: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Experience genuine Rajasthani royalty inside a restored 250-year-old royal residence surrounded by peacock gardens, marble courtyards, and traditional folk evenings.',
    amenities: ['Free WiFi', 'Royal Courtyard Pool', 'Folk Performances', 'Heritage Spa', 'Free Royal Breakfast', 'Vintage Car Tour'],
    isFeatured: true
  },
  {
    _id: 'h104',
    name: 'The Crown Regency Diplomatic Enclave',
    city: 'Delhi',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi, 110021',
    starRating: 4,
    bannerImage: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Located in the green heart of the capital city, blending neoclassical architecture with modern executive conveniences, high-level security, and luxury spas.',
    amenities: ['Free High-Speed WiFi', 'Heated Pool', 'Executive Lounge', 'Airport Concierge', 'Multi-Cuisine Cafe'],
    isFeatured: false
  },
  {
    _id: 'h105',
    name: 'Cedar Pine Alpine Chalet & Resort',
    city: 'Manali',
    address: 'Hadimba Temple Road, Old Manali, Himachal Pradesh, 175131',
    starRating: 4,
    bannerImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Surrounded by snow-capped Himalayan peaks and deodar forests. Features wood-fired fireplaces, heated rooms, private balconies, and mountain adventure treks.',
    amenities: ['Free High-Speed WiFi', 'Bonfire Nights', 'Mountain View Balconies', 'Heated Rooms', 'Adventure Desk', 'Free Breakfast'],
    isFeatured: true
  }
];

const roomsData = [
  {
    _id: 'r201',
    hotelId: 'h101',
    roomNumber: '101',
    title: 'Sea-Facing Premium Deluxe Room',
    categoryName: 'Deluxe',
    pricePerNight: 5499,
    capacity: 2,
    bedType: 'King Size Bed',
    roomSizeSqFt: 420,
    status: 'available',
    isFeatured: true,
    amenities: ['Ocean View Balcony', 'Free High-Speed WiFi', 'Bathtub & Rain Shower', 'Smart TV 55"', 'Complimentary Breakfast', 'Mini Bar'],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r202',
    hotelId: 'h101',
    roomNumber: '102',
    title: 'Azure Lagoon Luxury Suite',
    categoryName: 'Executive Suite',
    pricePerNight: 8999,
    capacity: 4,
    bedType: '1 King + 1 Queen Bed',
    roomSizeSqFt: 650,
    status: 'occupied',
    isFeatured: true,
    amenities: ['Private Plunge Pool', 'Beach Access', 'Free High-Speed WiFi', 'Jacuzzi', 'Espresso Machine', '24/7 Butler Service'],
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r203',
    hotelId: 'h101',
    roomNumber: '103',
    title: 'Garden View Classic Room',
    categoryName: 'Standard',
    pricePerNight: 3999,
    capacity: 2,
    bedType: 'Queen Size Bed',
    roomSizeSqFt: 320,
    status: 'cleaning',
    isFeatured: false,
    amenities: ['Garden Patio', 'Free WiFi', 'Air Conditioning', 'Work Desk', 'Tea/Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r204',
    hotelId: 'h102',
    roomNumber: '501',
    title: 'Skyline City View Executive Suite',
    categoryName: 'Executive Suite',
    pricePerNight: 9500,
    capacity: 2,
    bedType: 'Super King Bed',
    roomSizeSqFt: 580,
    status: 'available',
    isFeatured: true,
    amenities: ['Panoramic Sea & City View', 'Executive Club Lounge Access', 'Bathtub with Skyline View', 'High-Speed WiFi', 'Complimentary Evening Cocktails'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r205',
    hotelId: 'h102',
    roomNumber: '502',
    title: 'Grand Presidential Penthouse Suite',
    categoryName: 'Presidential Suite',
    pricePerNight: 24999,
    capacity: 6,
    bedType: '2 King Beds + Private Living Room',
    roomSizeSqFt: 1400,
    status: 'available',
    isFeatured: true,
    amenities: ['Private Terrace Jacuzzi', 'Dining Room for 8', 'Private Bar', 'Dedicated Chauffeur Airport Transfer', 'Personal Chef on Request'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r206',
    hotelId: 'h103',
    roomNumber: '201',
    title: 'Maharaja Heritage Royal Suite',
    categoryName: 'Presidential Suite',
    pricePerNight: 14500,
    capacity: 3,
    bedType: 'Royal Four-Poster Canopy Bed',
    roomSizeSqFt: 750,
    status: 'available',
    isFeatured: true,
    amenities: ['Authentic Fresco Ceilings', 'Carved Marble Bathtub', 'Royal Garden View', 'Free Royal High Tea', 'Private Butler Service'],
    images: [
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r207',
    hotelId: 'h103',
    roomNumber: '202',
    title: 'Courtyard Palace Deluxe Room',
    categoryName: 'Deluxe',
    pricePerNight: 6200,
    capacity: 2,
    bedType: 'King Size Bed',
    roomSizeSqFt: 460,
    status: 'occupied',
    isFeatured: false,
    amenities: ['Peacock Courtyard View', 'Free Breakfast Buffet', 'High-Speed WiFi', 'Handcrafted Jharokha Seating'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r208',
    hotelId: 'h104',
    roomNumber: '301',
    title: 'Diplomatic Ambassador Club Room',
    categoryName: 'Deluxe',
    pricePerNight: 4800,
    capacity: 2,
    bedType: 'King Size Bed',
    roomSizeSqFt: 380,
    status: 'available',
    isFeatured: false,
    amenities: ['Ergonomic Work Station', 'Soundproof Windows', 'High-Speed WiFi', 'Rain Shower', 'Club Lounge Access'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    _id: 'r209',
    hotelId: 'h105',
    roomNumber: '104',
    title: 'Cedar Forest Pine Chalet with Fireplace',
    categoryName: 'Deluxe',
    pricePerNight: 5200,
    capacity: 3,
    bedType: 'King Size Bed + Daybed',
    roomSizeSqFt: 480,
    status: 'available',
    isFeatured: true,
    amenities: ['Wood-Burning Fireplace', 'Panoramic Snow Mountain Balcony', 'Heated Flooring', 'Complimentary Breakfast & Bonfire', 'High-Speed Starlink WiFi'],
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

// Pre-hashed password for "Password123!" using bcryptjs
const HASHED_PWD = bcrypt.hashSync('Password123!', 10);

const usersData = [
  {
    _id: 'u301',
    name: 'Rahul Sharma (Guest)',
    email: 'guest@hotelpro.com',
    password: HASHED_PWD,
    role: 'guest',
    phone: '+91 9823456789',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date('2026-01-10')
  },
  {
    _id: 'u302',
    name: 'Priya Patel (Front Desk Staff)',
    email: 'staff@hotelpro.com',
    password: HASHED_PWD,
    role: 'staff',
    phone: '+91 9812345670',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date('2026-01-05')
  },
  {
    _id: 'u303',
    name: 'Aniket Jadon (Hotel Admin)',
    email: 'admin@hotelpro.com',
    password: HASHED_PWD,
    role: 'admin',
    phone: '+91 9999888877',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date('2026-01-01')
  }
];

const bookingsData = [
  {
    _id: 'b401',
    bookingNumber: 'MMT-HP-98421',
    userId: 'u301',
    hotelId: 'h101',
    roomId: 'r201',
    guestDetails: {
      name: 'Rahul Sharma',
      email: 'guest@hotelpro.com',
      phone: '+91 9823456789',
      specialRequests: 'High floor preferred, sea-facing room with extra pillows.'
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
    bookingStatus: 'confirmed',
    createdAt: new Date('2026-10-20')
  },
  {
    _id: 'b402',
    bookingNumber: 'MMT-HP-87612',
    userId: 'u301',
    hotelId: 'h102',
    roomId: 'r204',
    guestDetails: {
      name: 'Rahul Sharma',
      email: 'guest@hotelpro.com',
      phone: '+91 9823456789',
      specialRequests: 'Late check-in around 10 PM.'
    },
    checkInDate: new Date('2026-09-15'),
    checkOutDate: new Date('2026-09-17'),
    nights: 2,
    guestsCount: 2,
    basePrice: 19000,
    taxesAndFees: 2280,
    discountAmount: 0,
    promoCode: '',
    totalAmount: 21280,
    paymentStatus: 'paid',
    bookingStatus: 'checked-out',
    createdAt: new Date('2026-09-01')
  }
];

const paymentsData = [
  {
    _id: 'p501',
    bookingId: 'b401',
    userId: 'u301',
    transactionId: 'TXN-9842183921',
    invoiceNumber: 'INV-2026-00481',
    amount: 16827,
    currency: 'INR',
    paymentMethod: 'card',
    status: 'success',
    paidAt: new Date('2026-10-20')
  },
  {
    _id: 'p502',
    bookingId: 'b402',
    userId: 'u301',
    transactionId: 'TXN-8761239014',
    invoiceNumber: 'INV-2026-00329',
    amount: 21280,
    currency: 'INR',
    paymentMethod: 'upi',
    status: 'success',
    paidAt: new Date('2026-09-01')
  }
];

const reviewsData = [
  {
    _id: 'rv601',
    userId: 'u301',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    hotelId: 'h101',
    roomId: 'r201',
    rating: 5,
    title: 'Absolute bliss by the beach!',
    comment: 'The check-in was swift, the balcony offered breathtaking sunset views, and the breakfast buffet was lavish. Truly a MakeMyTrip Assured experience.',
    createdAt: new Date('2026-09-18')
  },
  {
    _id: 'rv602',
    userId: 'u301',
    userName: 'Sneha Kapur',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hotelId: 'h103',
    roomId: 'r206',
    rating: 5,
    title: 'Felt like real royalty',
    comment: 'The peacock gardens, royal architecture, and attentive hospitality in Jaipur were unforgettable. Highly recommend the Maharaja suite.',
    createdAt: new Date('2026-10-02')
  }
];

const serviceRequestsData = [
  {
    _id: 'sr701',
    bookingId: 'b401',
    roomId: 'r201',
    roomNumber: '101',
    guestName: 'Rahul Sharma',
    serviceType: 'housekeeping',
    priority: 'medium',
    status: 'pending',
    notes: 'Extra set of fresh towels and bath amenities needed before evening.',
    assignedTo: 'Housekeeping Shift A',
    createdAt: new Date()
  },
  {
    _id: 'sr702',
    bookingId: 'b401',
    roomId: 'r202',
    roomNumber: '102',
    guestName: 'Vikram Seth',
    serviceType: 'room_service',
    priority: 'high',
    status: 'in-progress',
    notes: 'Continental breakfast order for 2 guests.',
    assignedTo: 'Culinary Team',
    createdAt: new Date(Date.now() - 3600000)
  }
];

const activityLogsData = [
  {
    _id: 'log801',
    userId: 'u303',
    userName: 'Aniket Jadon (Admin)',
    role: 'admin',
    action: 'SYSTEM_BOOT',
    details: 'HotelPro enterprise services initialized with MMT design system.',
    ipAddress: '127.0.0.1',
    timestamp: new Date()
  },
  {
    _id: 'log802',
    userId: 'u301',
    userName: 'Rahul Sharma (Guest)',
    role: 'guest',
    action: 'BOOKING_CREATED',
    details: 'Reserved room 101 at The Grand Azure Beach Resort & Spa (MMT-HP-98421).',
    ipAddress: '127.0.0.1',
    timestamp: new Date('2026-10-20')
  }
];

// In-Memory store container
const store = {
  hotels: hotelsData,
  rooms: roomsData,
  users: usersData,
  bookings: bookingsData,
  payments: paymentsData,
  reviews: reviewsData,
  serviceRequests: serviceRequestsData,
  activityLogs: activityLogsData
};

module.exports = store;
