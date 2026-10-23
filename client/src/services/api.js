const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('hotelpro_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Hotels
  getHotels: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/hotels?${query}`);
    return res.json();
  },

  getHotelById: async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`);
    return res.json();
  },

  // Rooms
  getRooms: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/rooms?${query}`);
    return res.json();
  },

  getRoomById: async (id) => {
    const res = await fetch(`${API_BASE}/rooms/${id}`);
    return res.json();
  },

  checkAvailability: async (data) => {
    const res = await fetch(`${API_BASE}/rooms/check-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    return res.json();
  },

  getMyBookings: async () => {
    const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  cancelBooking: async (id, reason) => {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return res.json();
  },

  // Staff
  getStaffOverview: async () => {
    const res = await fetch(`${API_BASE}/staff/overview`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  checkInGuest: async (bookingId) => {
    const res = await fetch(`${API_BASE}/staff/check-in/${bookingId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  checkOutGuest: async (bookingId) => {
    const res = await fetch(`${API_BASE}/staff/check-out/${bookingId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateRoomStatus: async (roomId, status) => {
    const res = await fetch(`${API_BASE}/staff/room-status/${roomId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  updateServiceTicket: async (ticketId, status) => {
    const res = await fetch(`${API_BASE}/staff/service-request/${ticketId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAdminUsers: async () => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateUserRole: async (id, role) => {
    const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return res.json();
  },

  updateRoomPrice: async (id, pricePerNight) => {
    const res = await fetch(`${API_BASE}/admin/rooms/${id}/price`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ pricePerNight })
    });
    return res.json();
  },

  // Reviews
  getHotelReviews: async (hotelId) => {
    const res = await fetch(`${API_BASE}/reviews/${hotelId}`);
    return res.json();
  },

  createReview: async (reviewData) => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData)
    });
    return res.json();
  }
};
