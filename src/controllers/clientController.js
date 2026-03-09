const Client = require('../models/Client');

// @desc    Create client
// @route   POST /api/clients
// @access  Private
const createClient = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    
    const client = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
const getClients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Search by name, email, or company
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    
    // Managers and admins see all clients, agents see only theirs
    if (req.user.role === 'agent') {
      query.createdBy = req.user.id;
    }
    
    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await Client.countDocuments(query);
    
    res.json({
      success: true,
      count: clients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      clients,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
const getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check authorization for agents
    if (req.user.role === 'agent' && client.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this client' });
    }
    
    res.json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
const updateClient = async (req, res, next) => {
  try {
    let client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Check authorization for agents
    if (req.user.role === 'agent' && client.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this client' });
    }
    
    client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin/Manager)
const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    await client.deleteOne();
    
    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
};