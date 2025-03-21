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
 * /posts/sender=/{senderId}/{skip}/{limit}:
 *   get:
 *      summary: Get post by sender id
 *      description: Retrieves posts created by specific user, with skip and limit
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: senderId
 *            schema:
 *              type: string
 *            required: true
 *            description: Sender id
 *          - in: path
 *            name: skip
 *            required: true
 *            schema:
 *              type: integer
 *            description: Amount of posts to skip
 *          - in: path
 *            name: limit
 *            required: true
 *            schema:
 *              type: integer
 *            description: Amount of posts to limit
 *      responses:
 *           200:
 *              description: All posts created by specific user with skip and limit
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
router.get("/sender=/:senderId/:skip/:limit", post.getPostsBySenderId);

/**
 * @swagger
 * /posts/{skip}/{limit}:
 *   get:
 *      summary: Get all existing posts by skip and limit
 *      description: Retrives an array of all saved posts using the role of the skip and limit
 *      tags:
 *          - Posts
 *      parameters:
 *          - in: path
 *            name: skip
 *            required: true
 *            schema:
 *              type: integer
 *            description: Amount of posts to skip
 *          - in: path
 *            name: limit
 *            required: true
 *            schema:
 *              type: integer
 *            description: Amount of posts to limit
 *      responses:
 *          200:
 *              description: Array of saved posts using the role of the skip and limit
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

/**
 * @swagger
 * /posts/amount:
 *   get:
 *      summary: Get posts amount
 *      description: Retrives amount of saved posts
 *      tags:
 *          - Posts
 *      responses:
 *          200:
 *              description: Amount of saved posts
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              amount:
 *                                  type: integer
 *                                  description: Amount of saved posts
 *                                  example: 12
 *          500:
 *              description: Server Error
 */
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

/**
 * @swagger
 * /posts:
 *   delete:
 *      summary: Remove post
 *      description: Delete existing post
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
 *                          postId:
 *                              type: string
 *                              description: The id of the post that is being removed
 *                              example: 67cf2aa6d98400a9a2b93cc3
 *                      required:
 *                        - postId
 *      responses:
 *          200:
 *              description: Post removed
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
router.delete("/:id", authenticationController.authenticate, post.removePost);

export default router;
