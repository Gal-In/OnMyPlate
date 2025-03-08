import express from "express";
import users from "../controller/userController";
import authenticationController from "../controller/authenticationController";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Db generated user id
 *         name:
 *           type: string
 *           description: The user name
 *         username:
 *           type: string
 *           description: The user username
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password, saved after encryption
 *         refreshTokens:
 *           type: array
 *           items:
 *              type: string
 *           description: The user refresh tokens, created using the authentication requests
 *       example:
 *         _id: 67813c84b8f996b54a5e04ca
 *         name: koren
 *         username: koren23
 *         email: koren@gmail.com
 *         password: $2b$10$OgtMmMCzD3s29LUk6HeyP.Wksi0eAGRYKDvNgBklU476hPDqf45m.
 *         refreshTokens: []
 */

/**
 * @swagger
 * /users:
 *   get:
 *      summary: Get all existing users
 *      description: Retrives an array of all saved users
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Array of all saved users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          500:
 *              description: Server Error
 */
router.get("/", users.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *      summary: Get user by id
 *      description: Retrieves a specific user by its id
 *      tags:
 *          - Users
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: User id
 *      responses:
 *           200:
 *              description: Single User
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Invalid input
 *           404:
 *              description: User not found
 *           500:
 *              description: Server Error
 */
router.get("/:id", users.getUserById);

/**
 * @swagger
 * /users:
 *   put:
 *      summary: Update user
 *      description: Update user and retrives it back
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              description: Posts email
 *                              example: bob123@gmail.com
 *                          password:
 *                              type: string
 *                              description: Users password
 *                              example: Aa123456
 *      responses:
 *           200:
 *              description: Updated User
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Invalid input
 *           403:
 *              description: Unauthorized
 *           500:
 *              description: Server Error
 */
router.put("/", authenticationController.authenticate, users.updateUserDetails);

/**
 * @swagger
 * /users:
 *   delete:
 *      summary: Delete user
 *      description: Delete user and retrevies him back
 *      tags:
 *          - Users
 *      security:
 *          - bearerAuth: []
 *      responses:
 *           200:
 *              description: User deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *           400:
 *              description: Invalid input
 *           403:
 *              description: Unauthorized
 *           500:
 *              description: Server Error
 */
router.delete("/", authenticationController.authenticate, users.deleteUser);

export default router;
