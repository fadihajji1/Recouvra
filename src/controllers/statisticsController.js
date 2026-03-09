const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Payment = require('../models/Payment');
const RecoveryAction = require('../models/RecoveryAction');

// @desc    Get dashboard statistics
// @route   GET /api/statistics
// @access  Private
const getStatistics = async (req, res, next) => {
  try {
    // Invoice statistics
    const invoiceStats = await Invoice.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalPaid: { $sum: '$paidAmount' },
        },
      },
    ]);

    // Total clients
    const totalClients = await Client.countDocuments();

    // Recent payments
    const recentPayments = await Payment.find()
      .populate('invoice', 'invoiceNumber amount')
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Upcoming recovery actions
    const upcomingActions = await RecoveryAction.find({
      actionDate: { $gte: new Date() },
      status: 'planned',
    })
      .populate('invoice', 'invoiceNumber dueDate')
      .populate('performedBy', 'name')
      .sort({ actionDate: 1 })
      .limit(5);

    // Overdue invoices count
    const overdueInvoices = await Invoice.countDocuments({
      status: 'overdue',
    });

    // Format invoice statistics
    const formattedInvoiceStats = {
      total: invoiceStats.reduce((acc, curr) => acc + curr.count, 0),
      totalAmount: invoiceStats.reduce((acc, curr) => acc + curr.totalAmount, 0),
      totalPaid: invoiceStats.reduce((acc, curr) => acc + (curr.totalPaid || 0), 0),
      byStatus: invoiceStats.reduce((acc, curr) => {
        acc[curr._id] = {
          count: curr.count,
          amount: curr.totalAmount,
          paid: curr.totalPaid || 0,
        };
        return acc;
      }, {}),
    };

    // Calculate total unpaid
    formattedInvoiceStats.totalUnpaid = formattedInvoiceStats.totalAmount - formattedInvoiceStats.totalPaid;

    res.json({
      success: true,
      statistics: {
        invoices: formattedInvoiceStats,
        clients: {
          total: totalClients,
        },
        overdueInvoices,
        recentPayments,
        upcomingActions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly statistics
// @route   GET /api/statistics/monthly
// @access  Private (Manager/Admin)
const getMonthlyStatistics = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Monthly invoice statistics
    const monthlyInvoices = await Invoice.aggregate([
      {
        $match: {
          issueDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$issueDate' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: { $sum: '$paidAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly payment statistics
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: '$paymentDate' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format monthly data for all 12 months
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
        },
      };
    });

    res.json({
      success: true,
      year,
      monthlyData: formattedMonthlyData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStatistics,
  getMonthlyStatistics,
};