const express = require('express');
const router = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  updateInvoiceStatus,
  deleteInvoice,
} = require('../controllers/invoiceController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/', authorizeRoles('agent', 'manager', 'admin'), getInvoices);

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             invoiceNumber: INV-2025-001
 *             client: 64bfa2c8f91a2d1f88a1a123
 *             dueDate: 2025-12-31
 *             items:
 *               - description: Website design
 *                 quantity: 2
 *                 price: 500
 *               - description: Hosting
 *                 quantity: 1
 *                 price: 100
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       403:
 *         description: Managers only
 */
router.post('/', authorizeRoles('manager', 'admin'), createInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get a single invoice
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice data
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', authorizeRoles('agent', 'manager', 'admin'), getInvoice);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice updated
 *       403:
 *         description: Managers only
 */
router.put('/:id', authorizeRoles('manager', 'admin'), updateInvoice);

/**
 * @swagger
 * /api/invoices/{id}/status:
 *   patch:
 *     summary: Update invoice status
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: Paid
 *     responses:
 *       200:
 *         description: Invoice status updated
 */
router.patch('/:id/status', authorizeRoles('manager', 'admin'), updateInvoiceStatus);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags:
 *       - Invoices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted
 *       403:
 *         description: Managers only
 */
router.delete('/:id', authorizeRoles('manager', 'admin'), deleteInvoice);

module.exports = router;