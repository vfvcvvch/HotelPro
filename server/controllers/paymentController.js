const Payment = require('../models/Payment');
const { getDBStatus } = require('../config/db');
const mockStore = require('../config/mockStore');

// @desc    Get payment and tax invoice by booking ID
// @route   GET /api/payments/booking/:bookingId
// @access  Private
exports.getPaymentByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    if (getDBStatus()) {
      const payment = await Payment.findOne({ bookingId }).populate('bookingId');
      if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });
      return res.status(200).json({ success: true, data: payment });
    } else {
      const payment = mockStore.payments.find(p => p.bookingId.toString() === bookingId.toString());
      if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });
      const booking = mockStore.bookings.find(b => b._id.toString() === bookingId.toString());
      return res.status(200).json({ success: true, data: { ...payment, bookingId: booking } });
    }
  } catch (error) {
    next(error);
  }
};
