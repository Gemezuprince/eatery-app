const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu');

// @route   GET /api/admin/dashboard
// @desc    Admin only — key metrics overview
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalUsers,
      totalMenuItems,
      revenueResult
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'out for delivery' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({ role: 'customer' }),
      Menu.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ])
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: {
        totalOrders,
        totalRevenue,
        ordersByStatus: {
          pending: pendingOrders,
          preparing: preparingOrders,
          outForDelivery: outForDeliveryOrders,
          delivered: deliveredOrders,
          cancelled: cancelledOrders
        },
        totalUsers,
        totalMenuItems
      }
    });
  } catch (err) {
    next(err);
  }
};