const express = require('express');
const router = express.Router();
const { 
  getStaffOverview, 
  checkInGuest, 
  checkOutGuest, 
  updateRoomStatus, 
  updateServiceRequest 
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('staff', 'admin'));

router.get('/overview', getStaffOverview);
router.post('/check-in/:bookingId', checkInGuest);
router.post('/check-out/:bookingId', checkOutGuest);
router.put('/room-status/:roomId', updateRoomStatus);
router.put('/service-request/:ticketId', updateServiceRequest);

module.exports = router;
