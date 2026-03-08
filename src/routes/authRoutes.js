/**
 * @swagger
 * /api/auth/register:
 *  post:
 *      summary: Register a new user
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                          lastName:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [agent, manager, admin]
 *                      example: 
 *                          firstName: "Mohamed Aziz"
 *                          lastName: "Hafhouf"
 *                          email: "azizhafhouf@gmail.com"
 *                          password: "TestingPass"
 *                          role: "agent"
 *      responses:
 *          201:
 *              description: User created successfully
 *          500:
 *              description: Server error
 */

const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
router.post('/register', authController.register);

module.exports = router;