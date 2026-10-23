const Hotel = require('../models/Hotel');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get all hotels (optional filter by city)
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const { city, search } = req.query;

    if (getDBStatus()) {
      let query = {};
      if (city) {
        query.city = { $regex: city, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } }
        ];
      }
      const hotels = await Hotel.find(query);
      return res.status(200).json({ success: true, count: hotels.length, data: hotels });
    } else {
      let results = [...mockStore.hotels];
      if (city) {
        results = results.filter(h => h.city.toLowerCase().includes(city.toLowerCase()));
      }
      if (search) {
        results = results.filter(h => 
          h.name.toLowerCase().includes(search.toLowerCase()) || 
          h.city.toLowerCase().includes(search.toLowerCase())
        );
      }
      return res.status(200).json({ success: true, count: results.length, data: results });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).json({ success: false, message: 'Hotel not found' });
      }
      return res.status(200).json({ success: true, data: hotel });
    } else {
      const hotel = mockStore.hotels.find(h => h._id.toString() === id.toString());
      if (!hotel) {
        return res.status(404).json({ success: false, message: 'Hotel not found' });
      }
      return res.status(200).json({ success: true, data: hotel });
    }
  } catch (error) {
    next(error);
  }
};
