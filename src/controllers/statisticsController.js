const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Payment = require('../models/Payment');
const RecoveryAction = require('../models/RecoveryAction');

const getStatistics = async (req, res, next) => {
  try {
    // Invoice statistics
    const invoiceStats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        },
      },
    ]);

    const totalClients = await Client.countDocuments();

    const recentPayments = await Payment.find()
      .populate('invoice', 'invoiceNumber totalAmount')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingActions = await RecoveryAction.find({
      actionDate: { $gte: new Date() },
      status: 'planned',
    })
      .populate('invoice', 'invoiceNumber dueDate')
      .populate('performedBy', 'firstName lastName')
      .sort({ actionDate: 1 })
      .limit(5);

    const overdueInvoices = await Invoice.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Paid' },
    });

    const formattedInvoiceStats = {
      total: invoiceStats.reduce((acc, curr) => acc + curr.count, 0),
      totalAmount: invoiceStats.reduce((acc, curr) => acc + curr.totalAmount, 0),
      byStatus: invoiceStats.reduce((acc, curr) => {
        acc[curr._id] = {
          count: curr.count,
          amount: curr.totalAmount,
        };
        return acc;
      }, {}),
    };

    formattedInvoiceStats.totalUnpaid = formattedInvoiceStats.totalAmount;

    res.json({
      success: true,
      statistics: {
        invoices: formattedInvoiceStats,
        clients: { total: totalClients },
        overdueInvoices,
        recentPayments,
        upcomingActions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyStatistics = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const monthlyInvoices = await Invoice.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $month: '$paymentDate' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const formattedMonthlyData = months.map(month => {
      const invoiceData = monthlyInvoices.find(item => item._id === month) || {};
      const paymentData = monthlyPayments.find(item => item._id === month) || {};

      return {
        month,
        invoices: {
          count: invoiceData.count || 0,
          amount: invoiceData.totalAmount || 0,
        },
        payments: {
          count: paymentData.count || 0,
          amount: paymentData.totalAmount || 0,
        }
      };
    });

    res.json({
      success: true,
      year,
      monthlyData: formattedMonthlyData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
  getMonthlyStatistics
};