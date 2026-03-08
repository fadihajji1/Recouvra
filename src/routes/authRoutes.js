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
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [agent, manager, admin]
 *      responses:
 *          201:
 *              description: User created successfully
 *          500:
 *              description: Server error
 */

const authController = require('../controllers/authController');
router.post('/register', authController.register);