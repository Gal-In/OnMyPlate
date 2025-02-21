import express from "express";
import comments from "../controller/commentsController";
import authenticationController from "../controller/authenticationController";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - message
 *         - postId
 *         - senderId
 *       properties:
 *         _id:
 *           type: string
 *           description: Db generated comment id
 *         message:
 *           type: string
 *           description: Comments message
 *         postId:
 *           type: string
 *           description: The id for the connected post
 *         senderId:
 *           type: string
 *           description: The id of the user who published the comment
 *       example:
 *         _id: 6781367778d417785a64ca56
 *         message: Here is my message
 *         postId: 67790cf4f387c4e772cceb43
 *         senderId: 67812574406f9cc760a8963d
 */

/**
 * @swagger
 * /comments:
 *   post:
 *      summary: Create new comment
 *      description: Save new comment and retrives it back
 *      tags:
 *          - Comments
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: Comments message
 *                              example: A new Comment!
 *                          postId:
 *                              type: string
 *                              description: Comments postId
 *                              example: 67790cf4f387c4e772cceb43
 *                      required:
 *                        - message
 *                        - postId
 *      responses:
 *          201:
 *              description: New Comment
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Comment'
 *          400:
 *              description: Invalid input
 *          403:
 *              descriptiom: Unauthorized
 *          500:
 *              description: Server Error
 */
router.post("/", authenticationController.authenticate, comments.addNewComment);

/**
 * @swagger
 * /comments:
 *   get:
 *      summary: Get all existing comments
 *      description: Retrives an array of all saved comments
 *      tags:
 *          - Comments
 *      responses:
 *          200:
 *              description: Array of all saved comments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Comment'
 *          500:
 *              description: Server Error
 */
router.get("/", comments.getAllComments);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *      summary: Update comment
 *      description: Update comment and retrives it back
 *      tags:
 *          - Comments
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: comment id
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              description: comments message
 *                              example: Here you enter your updated message
 *      responses:
 *           200:
 *              description: Updated comment
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Comment'
 *           400:
 *              description: Invalid input
 *           403:
 *              description: Unauthorized
 *           500:
 *              description: Server Error
 */
router.put(
  "/:id",
  authenticationController.authenticate,
  comments.updateComment
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *      summary: Delete comment
 *      description: Delete comment by comment id
 *      tags:
 *          - Comments
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: comment id
 *      security:
 *          - bearerAuth: []
 *      responses:
 *           200:
 *              description: Comment deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Comment'
 *           400:
 *              description: Invalid input
 *           403:
 *              description: Unauthorized
 *           500:
 *              description: Server Error
 */
router.delete(
  "/:id",
  authenticationController.authenticate,
  comments.deleteComment
);

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *      summary: Get all comments by post id
 *      description: Retrives an array of all comments related to specific post
 *      tags:
 *          - Comments
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema:
 *              type: string
 *            required: true
 *            description: comments postId
 *      responses:
 *          200:
 *              description: Array of all saved comments
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Comment'
 *          400:
 *              description: Invalid Input
 *          500:
 *              description: Server Error
 */
router.get("/:postId", comments.getCommentsByPostId);

export default router;
