const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, checkAvailability, createRoom } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/check-availability', checkAvailability);
router.post('/', protect, authorize('admin'), createRoom);

module.exports = router;
