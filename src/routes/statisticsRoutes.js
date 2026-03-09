const express = require('express');
const router = express.Router();

const {
  getStatistics,
  getMonthlyStatistics
} = require('../controllers/statisticsController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @swagger
 * /api/statistics:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Returns overall statistics including invoices, clients, recent payments, and upcoming recovery actions
 *     tags:
 *       - Statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/', authorizeRoles('agent', 'manager', 'admin'), getStatistics);

/**
 * @swagger
 * /api/statistics/monthly:
 *   get:
 *     summary: Get monthly statistics
 *     description: Returns statistics per month for a given year, including invoices and payments
 *     tags:
 *       - Statistics
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: >
 *           Year for which to fetch statistics (default: current year)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly statistics retrieved successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Managers and Admins only
 */
router.get('/monthly', authorizeRoles('manager', 'admin'), getMonthlyStatistics);

module.exports = router;