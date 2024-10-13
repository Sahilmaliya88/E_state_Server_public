import express, { Router } from 'express'
import { createPost } from '../controllers/postController.js'

const postRouter:Router = express.Router()
postRouter.route('/').post(createPost)
export default postRouter