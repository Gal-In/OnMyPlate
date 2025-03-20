import express from "express";
import authenticationController from "../controller/authenticationController";
import like from "../controller/likeController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Likes API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       required:
 *         - postId
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Db generated like id
 *         postId:
 *           type: string
 *           description: The post that got the like
 *         userId:
 *           type: string
 *           description: The user who likes the post
 *       example:
 *         _id: 67d87727c10e42b2ce3f390b
 *         postId: 67cf2aa6d98400a9a2b93cc3
 *         userId: 67d1999c1e6845c8a02188cc
 */

/**
 * @swagger
 * /like:
 *   post:
 *      summary: Create like
 *      description: Save new like
 *      tags:
 *          - Likes
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          postId:
 *                              type: string
 *                              description: The id of the post that is liked
 *                              example: 67cf2aa6d98400a9a2b93cc3
 *                      required:
 *                        - postId
 *      responses:
 *          200:
 *              description: New like
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Like'
 *          400:
 *              description: Invalid input
 *          403:
 *              descriptiom: Unauthorized
 *          409:
 *              description: User cant like twice the same post
 *          500:
 *              description: Server Error
 */
router.post("/:userId", authenticationController.authenticate, like.addLike);

/**
 * @swagger
 * /like:
 *   delete:
 *      summary: Remove like
 *      description: Delete existing like
 *      tags:
 *          - Likes
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          postId:
 *                              type: string
 *                              description: The id of the post that his like is being removed
 *                              example: 67cf2aa6d98400a9a2b93cc3
 *                      required:
 *                        - postId
 *      responses:
 *          200:
 *              description: Like removed
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Like'
 *          400:
 *              description: Invalid input
 *          403:
 *              descriptiom: Unauthorized
 *          500:
 *              description: Server Error
 */
router.delete("/:userId", authenticationController.authenticate, like.removeLike);

/**
 * @swagger
 * /like/{postId}:
 *   get:
 *      summary: Get amount of like on post
 *      description: Retrieves a specific post by its id
 *      tags:
 *          - Likes
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the post whose likes we are counting
 *      responses:
 *           200:
 *              description: Single Post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Like'
 *           400:
 *              description: Invalid input
 *           500:
 *              description: Server Error
 */
router.get("/:postId", like.getAmountOfLikesOnPost);

/**
 * @swagger
 * /like/{postId}:
 *   get:
 *      summary: Get is post liked by user
 *      description: Retrieves a specific post if its liked by user
 *      tags:
 *          - Likes
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema:
 *              type: string
 *            required: true
 *            description: The id of the post whose likes we are counting
 *      responses:
 *           200:
 *              description: Single Post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Like'
 *           400:
 *              description: Invalid input
 *           500:
 *              description: Server Error
 */
router.get("/:userId/:postId", like.getIsLiked);

export default router;
