import express from 'express';
import multer from 'multer';
import {
  getPosts,
  createPost,
  addComment,
  updatePost,
  deletePost,
  getPostComments
} from '../controllers/communityController.js';
import authMiddleware  from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();


// Community Forum Routes
router.route('/posts')
  .get(getPosts)
  .post(
    authMiddleware,
    upload.fields([
      { name: 'images', maxCount: 5 },
      { name: 'videos', maxCount: 3 },
      { name: 'voiceNotes', maxCount: 1 }
    ]),
    createPost
  );


router.route('/posts/:id')
  .put(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

router.route('/posts/:postId/comments')
  .post(
    authMiddleware,
    upload.fields([
      { name: 'images', maxCount: 5 },
      { name: 'videos', maxCount: 3 },
      { name: 'voiceNotes', maxCount: 1 }
    ]),
    addComment)
  .get(getPostComments);



export default router;