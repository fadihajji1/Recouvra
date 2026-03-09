const express = require('express');
const router = express.Router();

const {
  createPayment,
  getPayments,
  getPayment,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: invoice
 *         schema:
 *           type: string
 *         description: Filter by invoice ID
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [bank_transfer, check, cash, credit_card, other]
 *         description: Filter by payment method
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter payments from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter payments up to this date
 *     responses:
 *       200:
 *         description: List of payments
 *       401:
 *         description: Not authorized
 */
router.get('/', authorizeRoles('manager', 'admin'), getPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get a single payment by ID
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment retrieved
 *       404:
 *         description: Payment not found
 */
router.get('/:id', authorizeRoles('agent', 'manager', 'admin'), getPayment);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a new payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invoice
 *               - amount
 *               - paymentMethod
 *             properties:
 *               invoice:
 *                 type: string
 *                 example: 64f3b2e8d3c2a5a1b2c3d4e5
 *               amount:
 *                 type: number
 *                 example: 250.00
 *               paymentMethod:
 *                 type: string
 *                 enum: [bank_transfer, check, cash, credit_card, other]
 *                 example: cash
 *               reference:
 *                 type: string
 *                 example: "REF12345"
 *               notes:
 *                 type: string
 *                 example: "Payment for March invoice"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error or overpayment
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Invoice not found
 */
router.post('/', authorizeRoles('agent', 'manager', 'admin'), createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update an existing payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 300.00
 *               paymentMethod:
 *                 type: string
 *                 enum: [bank_transfer, check, cash, credit_card, other]
 *                 example: cash
 *               reference:
 *                 type: string
 *                 example: "REF54321"
 *               notes:
 *                 type: string
 *                 example: "Updated payment notes"
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       403:
 *         description: Managers/Admin only
 *       404:
 *         description: Payment not found
 */
router.put('/:id', authorizeRoles('manager', 'admin'), updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     summary: Delete a payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       403:
 *         description: Admin only
 *       404:
 *         description: Payment not found
 */
router.delete('/:id', authorizeRoles('admin'), deletePayment);

module.exports = router;