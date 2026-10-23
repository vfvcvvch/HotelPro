const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole, 
  updateRoomPrice 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/rooms/:id/price', updateRoomPrice);

module.exports = router;
