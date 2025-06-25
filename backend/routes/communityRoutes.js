import express from 'express';
import {
  getPosts,
  createPost,
  addComment,
  updatePost,
  deletePost,
  getPostComments
} from '../controllers/communityController.js';
import authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

// Community Forum Routes
router.route('/posts')
  .get(getPosts)
  .post(authMiddleware, createPost);

router.route('/posts/:id')
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

router.route('/posts/:postId/comments')
  .post(authMiddleware, addComment)
  .get(getPostComments);



export default router;