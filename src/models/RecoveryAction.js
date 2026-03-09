const mongoose = require('mongoose');

const recoveryActionSchema = new mongoose.Schema({
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  actionType: {
    type: String,
    enum: ['email', 'phone_call', 'meeting', 'reminder', 'legal_notice', 'other'],
    required: true,
  },
  actionDate: {
    type: Date,
    required: [true, 'Action date is required'],
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['planned', 'completed', 'cancelled'],
    default: 'planned',
  },
  notes: String,
  nextActionDate: Date,
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  result: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('RecoveryAction', recoveryActionSchema);