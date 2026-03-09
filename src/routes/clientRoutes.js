const express = require('express');
const router = express.Router();

const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient
} = require('../controllers/clientController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *       401:
 *         description: Not authorized
 */
router.get('/', authorizeRoles('agent', 'manager', 'admin'), getClients);

/**
 * @swagger
 * /api/clients/{id}:
 *   get:
 *     summary: Get client details
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client retrieved
 *       404:
 *         description: Client not found
 */
router.get('/:id', authorizeRoles('agent', 'manager', 'admin'), getClient);

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Fadi
 *               lastName:
 *                 type: string
 *                 example: Hajji
 *               email:
 *                 type: string
 *                 example: fadi@example.com
 *               phone:
 *                 type: string
 *                 example: "12345678"
 *               company:
 *                 type: string
 *                 example: Tekup SARL
 *               address:
 *                 type: string
 *                 example: Technopole Ghazela, Tunis
 *     responses:
 *       201:
 *         description: Client created
 *       403:
 *         description: Managers only
 */
router.post('/', authorizeRoles('manager', 'admin'), createClient);


/**
 * @swagger
 * /api/clients/{id}:
 *   put:
 *     summary: Update client
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client updated
 *       403:
 *         description: Managers only
 */
router.put('/:id', authorizeRoles('manager', 'admin'), updateClient);


/**
 * @swagger
 * /api/clients/{id}:
 *   delete:
 *     summary: Delete client
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client deleted
 *       403:
 *         description: Managers only
 */
router.delete('/:id', authorizeRoles('manager', 'admin'), deleteClient);
module.exports = router;