const RecoveryAction = require('../models/RecoveryAction');
const Invoice = require('../models/Invoice');

const createRecoveryAction = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.body.invoice);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    req.body.performedBy = req.user.id;
    
    const action = await RecoveryAction.create(req.body);
    
    res.status(201).json({
      success: true,
      action,
    });
  } catch (error) {
    next(error);
  }
};

const getRecoveryActions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, invoice, status } = req.query;
    
    let query = {};
    if (invoice) query.invoice = invoice;
    if (status) query.status = status;
    
    const actions = await RecoveryAction.find(query)
      .populate('invoice', 'invoiceNumber amount status')
      .populate('performedBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ actionDate: -1 });
      
    const total = await RecoveryAction.countDocuments(query);
    
    res.json({
      success: true,
      count: actions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      actions,
    });
  } catch (error) {
    next(error);
  }
};

const getRecoveryAction = async (req, res, next) => {
  try {
    const action = await RecoveryAction.findById(req.params.id)
      .populate('invoice')
      .populate('performedBy', 'name email');
    
    if (!action) {
      return res.status(404).json({ message: 'Recovery action not found' });
    }
    
    res.json({
      success: true,
      action,
    });
  } catch (error) {
    next(error);
  }
};

const updateRecoveryAction = async (req, res, next) => {
  try {
    const action = await RecoveryAction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!action) {
      return res.status(404).json({ message: 'Recovery action not found' });
    }
    
    res.json({
      success: true,
      action,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecoveryAction = async (req, res, next) => {
  try {
    const action = await RecoveryAction.findById(req.params.id);
    
    if (!action) {
      return res.status(404).json({ message: 'Recovery action not found' });
    }
    
    await action.deleteOne();
    
    res.json({
      success: true,
      message: 'Recovery action deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecoveryAction,
  getRecoveryActions,
  getRecoveryAction,
  updateRecoveryAction,
  deleteRecoveryAction,
};