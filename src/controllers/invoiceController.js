const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

const createInvoice = async (req, res, next) => {
  try {
    const client = await Client.findById(req.body.client);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    if (req.user.role === 'agent' && client.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to create invoice for this client' });
    }

    req.body.createdBy = req.user.id;
    const invoice = await Invoice.create(req.body);

    res.status(201).json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, client, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (client) query.client = client;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (req.user.role === 'agent') {
      const clients = await Client.find({ createdBy: req.user.id }).select('_id');
      const clientIds = clients.map(c => c._id);
      query.client = { $in: clientIds };
    }

    const invoices = await Invoice.find(query)
      .populate('client', 'firstName lastName email company')
      .populate('createdBy', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    const stats = await Invoice.aggregate([
      { $match: query },
      { $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
      }}
    ]);

    res.json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      invoices,
      summary: stats[0] || { totalRevenue: 0, count: 0 },
    });
  } catch (error) {
    next(error);
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client')
      .populate('createdBy', 'firstName lastName');

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Authorization: Agents can only view if they own the client
    if (req.user.role === 'agent') {
      const client = await Client.findById(invoice.client._id);
      if (client.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to view this invoice' });
      }
    }

    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const updateInvoice = async (req, res, next) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Authorization check
    if (req.user.role === 'agent') {
      const client = await Client.findById(invoice.client);
      if (client.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this invoice' });
      }
    }

    //triggers the calculator in the model
    Object.assign(invoice, req.body);
    await invoice.save();

    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};

const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    res.json({ success: true, invoice });
  } catch (error) {
    next(error);
  }
};


const deleteInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Logic: Only Admins can delete, or Managers can delete their own
    if (req.user.role === 'agent') {
       return res.status(403).json({ message: 'Agents cannot delete invoices' });
    }

    await invoice.deleteOne();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
};