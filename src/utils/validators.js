const Joi = require('joi');

// User validation schemas
const userValidation = {
  register: Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('agent', 'manager', 'admin').default('agent'),
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    role: Joi.string().valid('agent', 'manager', 'admin'),
    active: Joi.boolean(),
  }),
};

// Client validation schemas
const clientValidation = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(100),
    email: Joi.string().email().required(),
    phone: Joi.string().required().pattern(/^[0-9+\-\s()]+$/),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      country: Joi.string().allow(''),
    }),
    company: Joi.string().allow(''),
    siret: Joi.string().allow(''),
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/),
    address: Joi.object({
      street: Joi.string().allow(''),
      city: Joi.string().allow(''),
      postalCode: Joi.string().allow(''),
      country: Joi.string().allow(''),
    }),
    company: Joi.string().allow(''),
    siret: Joi.string().allow(''),
  }),
};

// Invoice validation schemas
const invoiceValidation = {
  create: Joi.object({
    invoiceNumber: Joi.string().required(),
    client: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
    amount: Joi.number().required().positive(),
    issueDate: Joi.date().max('now'),
    dueDate: Joi.date().greater(Joi.ref('issueDate')).required(),
    description: Joi.string().allow(''),
  }),
  
  update: Joi.object({
    invoiceNumber: Joi.string(),
    amount: Joi.number().positive(),
    dueDate: Joi.date(),
    description: Joi.string().allow(''),
  }),
};

// Payment validation schemas
const paymentValidation = {
  create: Joi.object({
    invoice: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
    amount: Joi.number().required().positive(),
    paymentDate: Joi.date().max('now'),
    paymentMethod: Joi.string().valid('cash', 'check', 'bank_transfer', 'credit_card', 'other').required(),
    reference: Joi.string().allow(''),
    notes: Joi.string().allow(''),
  }),
};

// Recovery action validation schemas
const recoveryActionValidation = {
  create: Joi.object({
    invoice: Joi.string().required().pattern(/^[0-9a-fA-F]{24}$/),
    actionType: Joi.string().valid('email', 'phone_call', 'meeting', 'reminder', 'legal_notice', 'other').required(),
    actionDate: Joi.date().required(),
    notes: Joi.string().allow(''),
    nextActionDate: Joi.date().greater('now').allow(null),
  }),
  
  update: Joi.object({
    actionType: Joi.string().valid('email', 'phone_call', 'meeting', 'reminder', 'legal_notice', 'other'),
    actionDate: Joi.date(),
    status: Joi.string().valid('planned', 'completed', 'cancelled'),
    notes: Joi.string().allow(''),
    nextActionDate: Joi.date().greater('now').allow(null),
    result: Joi.string().allow(''),
  }),
};

module.exports = {
  userValidation,
  clientValidation,
  invoiceValidation,
  paymentValidation,
  recoveryActionValidation,
};