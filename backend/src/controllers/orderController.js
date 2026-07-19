const Order = require('../models/Order');
const Menu = require('../models/Menu');
const Cart = require('../models/Cart');
const { initializeTransaction, verifyTransaction } = require('../services/paystackService');

// @route   POST /api/orders
// @desc    Private — checkout: builds an order from the user's cart
exports.createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      const error = new Error('Your cart is empty');
      error.statusCode = 400;
      return next(error);
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const entry of cart.items) {
      const menuItem = await Menu.findById(entry.menuItem);

      if (!menuItem) {
        const error = new Error(`Menu item no longer exists: ${entry.menuItem}`);
        error.statusCode = 404;
        return next(error);
      }

      if (!menuItem.isAvailable) {
        const error = new Error(`Menu item is currently unavailable: ${menuItem.name}`);
        error.statusCode = 400;
        return next(error);
      }

      totalPrice += menuItem.price * entry.quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: entry.quantity
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      deliveryAddress,
      paymentMethod
    });

    // Clear the cart now that its contents have become a real order
    cart.items = [];
    await cart.save();

    // Card payments — initialize with Paystack and return a checkout link
    if (paymentMethod === 'card') {
      const reference = `order_${order._id}_${Date.now()}`;

      const paystackResponse = await initializeTransaction(
        req.user.email,
        totalPrice,
        reference
      );

      if (!paystackResponse.status) {
        const error = new Error('Failed to initialize payment');
        error.statusCode = 500;
        return next(error);
      }

      order.paymentReference = reference;
      await order.save();

      return res.status(201).json({
        success: true,
        message: 'Order created — proceed to payment',
        data: {
          order,
          paymentUrl: paystackResponse.data.authorization_url
        }
      });
    }

    // Cash or transfer — no online payment step needed right now
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders/my-orders
// @desc    Private — view own orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: { count: orders.length, orders }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders/:id
// @desc    Private/Admin — owner or admin can view a specific order
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('Access denied: you do not have permission to view this order');
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders
// @desc    Admin only — view all orders, with pagination
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      message: 'All orders retrieved successfully',
      data: {
        orders,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

// @route   PATCH /api/orders/:id/status
// @desc    Admin only — update order fulfillment status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    });
  } catch (err) {
    next(err);
  }
};

// @route   PATCH /api/orders/:id/payment
// @desc    Admin only — manually set payment status (mainly for cash orders, or corrections)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    order.paymentStatus = paymentStatus;
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `Order marked as ${paymentStatus}`,
      data: { order: updatedOrder }
    });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/orders/:id/cancel
// @desc    Owner (if still pending) or admin (unless already delivered/cancelled) — cancel an order
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      const error = new Error('Access denied: you do not have permission to cancel this order');
      error.statusCode = 403;
      return next(error);
    }

    // Customers can only cancel while still pending
    if (!isAdmin && order.status !== 'pending') {
      const error = new Error('Order can only be cancelled while still pending');
      error.statusCode = 400;
      return next(error);
    }

    // Even admins can't cancel an order that's already in a final state
    if (isAdmin && ['delivered', 'cancelled'].includes(order.status)) {
      const error = new Error(`Cannot cancel an order that is already ${order.status}`);
      error.statusCode = 400;
      return next(error);
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: updatedOrder }
    });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/orders/:id/verify-payment
// @desc    Private — manually verify and confirm payment for an order
exports.verifyOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    if (!order.paymentReference) {
      const error = new Error('This order has no payment to verify');
      error.statusCode = 400;
      return next(error);
    }

    const result = await verifyTransaction(order.paymentReference);

    if (
      result.data &&
      result.data.status === 'success' &&
      result.data.amount / 100 === order.totalPrice
    ) {
      order.paymentStatus = 'paid';
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: `Payment status: ${order.paymentStatus}`,
      data: { order }
    });
  } catch (err) {
    next(err);
  }
};