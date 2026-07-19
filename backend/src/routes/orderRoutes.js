const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createOrderValidator,
  updateOrderStatusValidator,
  updatePaymentStatusValidator
} = require('../validators/orderValidator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  verifyOrderPayment
} = require('../controllers/orderController');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array().map((e) => e.msg).join(', '));
    error.statusCode = 400;
    return next(error);
  }
  next();
};

// Private — any logged-in user
router.post('/', protect, createOrderValidator, handleValidation, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id/verify-payment', protect, verifyOrderPayment);

// Admin only
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatusValidator, handleValidation, updateOrderStatus);
router.patch('/:id/payment', protect, adminOnly, updatePaymentStatusValidator, handleValidation, updatePaymentStatus);

// Private/Admin — ownership checked inside controller
router.get('/:id', protect, getOrderById);

module.exports = router;