import express from "express";
import post from "../controller/postController";
import authenticationController from "../controller/authenticationController";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - restaurantName
 *         - senderId
 *       properties:
 *         _id:
 *           type: string
 *           description: Db generated post id
 *         restaurantName:
 *           type: string
 *           description: Posts restaurant name
 *         description:
 *           type: string
 *           description: Posts content
 *         rating:
 *           type: number
 *           description: User rating
 *         googleApiRating:
 *           type: number
 *           description: Google api rating
 *         senderId:
 *           type: string
 *           description: The id of the user who published the post
 *       example:
 *         _id: 6741b6ec0a270ec3d5875110
 *         restaurantName: some restaurant
 *         description: This is the content of the post
 *         rating: 4
 *         googleApiRating: 4.3
 *         senderId: 6780eba5f7a9d4a880c56d6b
 */

/**
 * @swagger
 * /posts:
 *   post:
 *      summary: Create new post
 *      description: Save new post and retrives it back
 *      tags:
 *          - Posts
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          restaurantName:
 *                              type: string
 *                              description: Restaurant name
 *                              example: Jaja
 *                          description:
 *                              type: string
 *                              description: Posts content
 *                              example: Here you enter your post content
 *                          rating:
 *                              type: number
 *                              description: restaurant rating by user
 *                              example: 4
 *                          googleApiRating:
 *                              type: number
 *                              description: restaurant rating by google api
 *                              example: 4.2
 *                          photosUrl:
 *                              type: array
 *                              description: restaurant photos urls
 *                              example: []
 *                      required:
 *                        - restaurantName
 *                        - rating
 *                        - googleApiRating
 *      responses:
 *          201:
 *              description: New post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 *          400:
 *              description: Invalid input
 *          403:
 *              descriptiom: Unauthorized
 *          500:
 *              description: Server Error
 */
router.post("/", authenticationController.authenticate, post.addNewPost);

/**
 * @swagger
 * /posts:
 *   get:
 *      summary: Get all existing posts
 *      description: Retrives an array of all saved posts
 *      tags:
 *          - Posts
 *      responses:
 *          200:
 *              description: Array of all saved posts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 *          500:
 *              description: Server Error
 */
router.get("/:skip/:limit", post.getPosts);

router.get("/amount", post.getAmountOfPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *      summary: Get post by id
 *      description: Retrieves a specific post by its id
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Post id
 *      responses:
 *           200:
 *              description: Single Post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 *           400:
 *              description: Invalid input
 *           404:
 *              description: Post not found
 *           500:
 *              description: Server Error
 */
router.get("/:id", post.getPostById);

/**
 * @swagger
 * /posts/sender=/{senderId}:
 *   get:
 *      summary: Get post by sender id
 *      description: Retrieves posts created by specific user
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: senderId
 *            schema:
 *              type: string
 *            required: true
 *            description: Sender id
 *      responses:
 *           200:
 *              description: All posts created by specific user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Post'
 *           400:
 *              description: Invalid input
 *           500:
 *              description: Server Error
 */
router.get("/sender=/:senderId", post.getPostsBySenderId);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *      summary: Update post
 *      description: Update post and retrives it back
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: post id
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          restaurantName:
 *                              type: string
 *                              description: Posts restaurant name
 *                              example: Vivino
 *                          description:
 *                              type: string
 *                              description: Posts description
 *                              example: Here you enter your updated post content
 *      responses:
 *           200:
 *              description: Updated post
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Post'
 *           400:
 *              description: Invalid input
 *           403:
 *              description: Unauthorized
 *           500:
 *              description: Server Error
 */

router.put("/:id", authenticationController.authenticate, post.updatePost);

export default router;
