const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

const createPayment = async (req, res, next) => {
  try {
    const { invoice: invoiceId, amount, paymentMethod, reference, notes } = req.body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const payment = await Payment.create({
      invoice: invoiceId,
      amount,
      paymentMethod: paymentMethod.toLowerCase(),
      reference,
      notes,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, invoice, paymentMethod, startDate, endDate } = req.query;

    const query = {};

    if (invoice) query.invoice = invoice;
    if (paymentMethod) query.paymentMethod = paymentMethod.toLowerCase();

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) {
        const [day, month, year] = startDate.includes('/') ? startDate.split('/') : [null, null, null];
        query.paymentDate.$gte = startDate.includes('/') 
          ? new Date(`${year}-${month}-${day}T00:00:00.000Z`)
          : new Date(startDate);
      }
      if (endDate) {
        const [day, month, year] = endDate.includes('/') ? endDate.split('/') : [null, null, null];
        query.paymentDate.$lte = endDate.includes('/') 
          ? new Date(`${year}-${month}-${day}T23:59:59.999Z`)
          : new Date(endDate);
      }
    }

    const payments = await Payment.find(query)
      .populate({ path: 'invoice', select: 'invoiceNumber totalAmount status' })
      .populate('createdBy', 'firstName lastName email')
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .sort({ paymentDate: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      payments
    });
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({ path: 'invoice', select: 'invoiceNumber totalAmount status' })
      .populate('createdBy', 'firstName lastName email');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};


const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (req.body.paymentMethod) req.body.paymentMethod = req.body.paymentMethod.toLowerCase();

    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, payment: updatedPayment });
  } catch (error) {
    next(error);
  }
};

const deletePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne();
    res.json({ success: true, message: 'Payment deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment
};