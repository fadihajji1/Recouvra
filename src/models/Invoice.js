const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description for the item'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add a quantity'],
    min: [1, 'Quantity cannot be less than 1']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  total: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    description: "Unique reference (e.g., INV-2026-001)"
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: [true, 'Invoice must belong to a client']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [itemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  taxRate: {
    type: Number,
    default: 20 
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Cancelled'],
    default: 'Draft'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  }
}, {
  timestamps: true
});

//Total auto calculated
invoiceSchema.pre('validate', async function() {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((acc, item) => {
      if (item.price && item.quantity) {
        item.total = item.quantity * item.price;
      } else {
        item.total = 0;
      }
      return acc + item.total;
    }, 0);

    const currentTaxRate = this.taxRate || 0;
    const taxAmount = (this.subtotal * currentTaxRate) / 100;
    this.totalAmount = this.subtotal + taxAmount;
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);