const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res, next) => {
  try {
    // Check if client exists
    const client = await Client.findById(req.body.client);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check authorization for agents
    if (req.user.role === 'agent' && client.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create invoice for this client' });
    }
    
    req.body.createdBy = req.user.id;
    
    const invoice = await Invoice.create(req.body);
    
    res.status(201).json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, client, startDate, endDate } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by client
    if (client) {
      query.client = client;
    }
    
    // Filter by date range
    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }
    
    // Agents only see invoices from their clients
    if (req.user.role === 'agent') {
      const clients = await Client.find({ createdBy: req.user.id }).select('_id');
      const clientIds = clients.map(c => c._id);
      query.client = { $in: clientIds };
    }
    
    const invoices = await Invoice.find(query)
      .populate('client', 'name email company')
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Invoice.countDocuments(query);
    
    // Calculate totals
    const totals = await Invoice.aggregate([
      { $match: query },
      { $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalPaid: { $sum: '$paidAmount' },
        totalUnpaid: { $sum: { $subtract: ['$amount', '$paidAmount'] } }
      }}
    ]);
    
    res.json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      invoices,
      summary: totals[0] || { totalAmount: 0, totalPaid: 0, totalUnpaid: 0 },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('createdBy', 'name email');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Check authorization for agents
    if (req.user.role === 'agent') {
      const client = await Client.findById(invoice.client._id);
      if (client.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this invoice' });
      }
    }
    
    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = async (req, res, next) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    // Check authorization for agents
    if (req.user.role === 'agent') {
      const client = await Client.findById(invoice.client);
      if (client.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this invoice' });
      }
    }
    
    invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'name email company');
    
    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private (Admin/Manager)
const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    await invoice.deleteOne();
    
    res.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
};