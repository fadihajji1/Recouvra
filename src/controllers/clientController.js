const Client = require('../models/Client');

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find()
      .populate('createdBy', 'firstName lastName email')
      .sort('-createdAt');

    res.json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    next(error);
  }
};

const getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const client = await Client.create(req.body);
    res.status(201).json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ success: true, client });
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) return res.status(404).json({ message: 'Client not found' });

    await client.deleteOne();
    res.json({ success: true, message: 'Client removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};