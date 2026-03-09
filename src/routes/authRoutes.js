/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Mohamed Aziz
 *               lastName:
 *                 type: string
 *                 example: Hafhouf
 *               email:
 *                 type: string
 *                 example: azizhafhouf@gmail.com
 *               password:
 *                 type: string
 *                 example: TestingPass123
 *               role:
 *                 type: string
 *                 enum:
 *                   - agent
 *                   - manager
 *                   - admin
 *                 example: agent
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */

const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: azizhafhouf@gmail.com
 *               password:
 *                 type: string
 *                 example: TestingPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', authController.login);

module.exports = router;