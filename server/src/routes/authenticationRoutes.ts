import express from "express";
import authentication from "../controller/authenticationController";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication API
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  responses:
 *      tokensAndUserResponse:
 *          description: Retrives the refresh token and the access token of the user, also his basic details
 *          content:
 *              application/json:
 *                  example:
 *                      name: tom
 *                      username: tom123
 *                      email: tome@gmail.com
 *                      isGoogleUser: false
 *                      profilePictureExtension: jpg
 *                      refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODIzYTI1ZjYwNDE4YTI1YTk2YTY1MiIsImlhdCI6MTczNjU4ODY4NH0.ZmNBtFS425kxVfAp6wXJWUnhQMZT-oN1CdI-uxNhrRg
 *                      accessToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODIzYTI1ZjYwNDE4YTI1YTk2YTY1MiIsImlhdCI6MTczNjU4ODY4NCwiZXhwIjoxNzM2NjA2Njg0fQ.mD2M4R5fX0o0bHZXjUS35WtGalTmaMuiaWyMzXlMWNs
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *      summary: Login an existing user
 *      description: Validate user and retrives back refresh and access token
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                        - username
 *                        - password
 *                      properties:
 *                          username:
 *                              type: string
 *                              description: The user username
 *                              example: tom
 *                          password:
 *                              type: string
 *                              description: The user password
 *                              example: tom123
 *      responses:
 *          200:
 *               $ref: '#/components/responses/tokensAndUserResponse'
 *          400:
 *              description: Details are incorrect
 *          500:
 *              description: Server Error
 */
router.post("/login", authentication.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *      summary: Logout an existing user
 *      description: Logout the user, delete the refresh token used for the request
 *      tags:
 *          - Authentication
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: User logged out successfully
 *          401:
 *              description: Unauthorized - token not found
 *          403:
 *              description: Invalid request
 *          500:
 *              description: Server Error
 */
router.post("/logout", authentication.logout);

/**
 * @swagger
 * /auth/registration:
 *   post:
 *      summary: Register a new user
 *      description: Create and validate new user and retrives it back
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                        - user
 *                        - username
 *                        - email
 *                        - password
 *                      properties:
 *                          name:
 *                              type: string
 *                              description: The user name
 *                              example: tom
 *                          username:
 *                              type: string
 *                              description: The user username
 *                              example: tom123
 *                          email:
 *                              type: string
 *                              description: The user email
 *                              example: tom@gmail.com
 *                          password:
 *                              type: string
 *                              description: The user password
 *                              example: tom123
 *      responses:
 *          201:
 *              description: New User
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Invalid input
 *          500:
 *              description: Server Error
 */
router.post("/registration", authentication.registration);

/**
 * @swagger
 * /auth/googleRegistration:
 *   post:
 *      summary: Register a new user from google
 *      description: Create a new user from his google details, and retrives it back
 *      tags:
 *          - Authentication
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                        - userToken
 *                      properties:
 *                          userToken:
 *                              type: string
 *                              description: The user google token
 *                              example: ya29.a0AeXRPp41OtyWEMBrCtA45ntxD3KNBEUZ326I541_-SRJdTpBYZKPMyO6UJlR81zRzJaXKn3wp1sAi3V4PKVJRHWg9SwnMfo7WIF8nGCS_7fFHHfcEbvKWl5cgmShar8_7j8lbyEFGXRVoVnto1y3qk_Z61YdiUcJL0EOFHOIaCgYKAaUSARESFQHGX2MiT4TAZl9zUVBK_rN21d3CfQ0175
 *      responses:
 *          201:
 *              $ref: '#/components/responses/tokensAndUserResponse'
 *          400:
 *              description: Invalid input
 *          500:
 *              description: Server Error
 */
router.post("/googleRegistration", authentication.googleRegistration);

/**
 * @swagger
 * /auth/refreshtoken:
 *   post:
 *      summary: Refresh token
 *      description: Get a refresh token and replace it with a new one, retrives the new refresh token and an access token
 *      tags:
 *          - Authentication
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              $ref: '#/components/responses/tokensAndUserResponse'
 *          401:
 *              description: Unauthorized - token not found
 *          403:
 *              description: Invalid request
 *          500:
 *              description: Server Error
 */
router.post("/refreshToken", authentication.refreshToken);

export default router;
