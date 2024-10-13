import express from 'express';
import { createPost } from '../controllers/postController.js';
const postRouter = express.Router();
postRouter.route('/').post(createPost);
export default postRouter;
