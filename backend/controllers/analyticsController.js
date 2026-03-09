const Order = require('../models/Order');
const User = require('../models/User');
const Furniture = require('../models/Furniture');
const Booking = require('../models/Booking');
const Door = require('../models/Door');
const Window = require('../models/Window');
const Locker = require('../models/Locker');
const Wood = require('../models/Wood');

// Get dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    // Total counts
    const totalOrders = await Order.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Furniture.countDocuments();

    // This month's data
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Last month's revenue for comparison
    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          isPaid: true
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Payment status distribution
    const paymentStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Daily orders for the last 7 days
    const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Monthly revenue for the last 6 months
    const last6Months = new Date(today.getFullYear(), today.getMonth() - 5, 1);
    const monthlyRevenueChart = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last6Months },
          isPaid: true
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort('-createdAt')
      .limit(10);

    // User registration trends
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: last6Months },
          role: 'user'
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Delivery agent performance
    const deliveryAgentPerformance = await Order.aggregate([
      {
        $match: {
          deliveryAgent: { $exists: true },
          orderStatus: 'delivered'
        }
      },
      {
        $group: {
          _id: '$deliveryAgent',
          deliveries: { $sum: 1 }
        }
      },
      { $sort: { deliveries: -1 } },
      { $limit: 5 }
    ]);

    // Populate delivery agent names
    const populatedAgentPerformance = await User.populate(deliveryAgentPerformance, {
      path: '_id',
      select: 'name email'
    });

    // Stock alerts (low stock items)
    const lowStockFurniture = await Furniture.find({ stock: { $lte: 5 }, isAvailable: true })
      .select('name stock')
      .limit(10);

    res.json({
      success: true,
      data: {
        summary: {
          totalOrders,
          totalBookings,
          totalUsers,
          totalProducts,
          monthlyOrders,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
          revenueGrowth: lastMonthRevenue[0]?.total 
            ? (((monthlyRevenue[0]?.total || 0) - lastMonthRevenue[0].total) / lastMonthRevenue[0].total * 100).toFixed(2)
            : 0
        },
        charts: {
          orderStatusDistribution,
          paymentStatusDistribution,
          dailyOrders,
          monthlyRevenueChart,
          userRegistrations
        },
        tables: {
          topProducts,
          recentOrders,
          deliveryAgentPerformance: populatedAgentPerformance,
          lowStockAlerts: lowStockFurniture
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = {};
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const salesData = await Order.aggregate([
      { $match: { ...matchQuery, isPaid: true } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const productWiseSales = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            productType: '$items.productType',
            name: '$items.name'
          },
          quantity: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        summary: salesData[0] || { totalSales: 0, totalOrders: 0, averageOrderValue: 0 },
        productWiseSales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get inventory report
exports.getInventoryReport = async (req, res) => {
  try {
    const furniture = await Furniture.find().select('name stock price category isAvailable');
    const doors = await Door.find().select('name stock price isAvailable');
    const windows = await Window.find().select('name stock price isAvailable');
    const lockers = await Locker.find().select('name stock price isAvailable');
    const woods = await Wood.find().select('name stock price isAvailable');

    const totalInventoryValue = [
      ...furniture.map(f => (f.stock || 0) * f.price),
      ...doors.map(d => (d.stock || 0) * d.price),
      ...windows.map(w => (w.stock || 0) * w.price),
      ...lockers.map(l => (l.stock || 0) * l.price),
      ...woods.map(w => (w.stock || 0) * w.price)
    ].reduce((a, b) => a + b, 0);

    res.json({
      success: true,
      data: {
        totalInventoryValue,
        inventory: {
          furniture: {
            count: furniture.length,
            items: furniture
          },
          doors: {
            count: doors.length,
            items: doors
          },
          windows: {
            count: windows.length,
            items: windows
          },
          lockers: {
            count: lockers.length,
            items: lockers
          },
          woods: {
            count: woods.length,
            items: woods
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
