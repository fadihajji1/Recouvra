const express = require('express');
const router = express.Router();

const {
  createRecoveryAction,
  getRecoveryActions,
  getRecoveryAction,
  updateRecoveryAction,
  deleteRecoveryAction
} = require('../controllers/recoveryActionController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @swagger
 * /api/recovery-actions:
 *   get:
 *     summary: Get all recovery actions
 *     tags:
 *       - RecoveryActions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: invoice
 *         schema:
 *           type: string
 *           example: 64bfa2c8f91a2d1f88a1a123
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, completed, cancelled]
 *     responses:
 *       200:
 *         description: List of recovery actions
 */
router.get('/', authorizeRoles('agent', 'manager', 'admin'), getRecoveryActions);

/**
 * @swagger
 * /api/recovery-actions:
 *   post:
 *     summary: Create a new recovery action
 *     tags:
 *       - RecoveryActions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             invoice: 64bfa2c8f91a2d1f88a1a123
 *             actionType: email
 *             actionDate: 2026-03-10
 *             status: planned
 *             notes: Follow up with client
 *             nextActionDate: 2026-03-15
 *             result: Pending response
 *     responses:
 *       201:
 *         description: Recovery action created successfully
 *       403:
 *         description: Managers only
 */
router.post('/', authorizeRoles('manager', 'admin'), createRecoveryAction);

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   get:
 *     summary: Get a single recovery action
 *     tags:
 *       - RecoveryActions
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
 *         description: Recovery action retrieved successfully
 *       404:
 *         description: Recovery action not found
 */
router.get('/:id', authorizeRoles('agent', 'manager', 'admin'), getRecoveryAction);

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   put:
 *     summary: Update a recovery action
 *     tags:
 *       - RecoveryActions
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
 *             actionType: phone_call
 *             actionDate: 2026-03-12
 *             status: completed
 *             notes: Client responded, agreed to pay
 *             nextActionDate: 2026-03-20
 *             result: Payment promised
 *     responses:
 *       200:
 *         description: Recovery action updated successfully
 *       403:
 *         description: Managers only
 */
router.put('/:id', authorizeRoles('manager', 'admin'), updateRecoveryAction);

/**
 * @swagger
 * /api/recovery-actions/{id}:
 *   delete:
 *     summary: Delete a recovery action
 *     tags:
 *       - RecoveryActions
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
 *         description: Recovery action deleted successfully
 *       403:
 *         description: Managers only
 */
router.delete('/:id', authorizeRoles('manager', 'admin'), deleteRecoveryAction);

module.exports = router;