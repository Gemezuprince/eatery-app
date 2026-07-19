const { body } = require('express-validator');

exports.createOrderValidator = [
  body('deliveryAddress')
    .trim()
    .notEmpty().withMessage('Delivery address is required'),

  body('paymentMethod')
    .isIn(['cash', 'card', 'transfer']).withMessage('Payment method must be cash, card, or transfer')
];

exports.updateOrderStatusValidator = [
  body('status')
    .isIn(['pending', 'preparing', 'out for delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid status value')
];

exports.updatePaymentStatusValidator = [
  body('paymentStatus')
    .isIn(['unpaid', 'paid']).withMessage('Payment status must be unpaid or paid')
];