import { Router } from "express";
const articleRouter:Router = Router()
import {getArticle,getArticles,editArticle,deleteArticle,addArticle,likeArticle} from '../controllers/articleController.js'
import { verifyMiddle } from "../controllers/authController.js";
articleRouter.route('/add').post(verifyMiddle,addArticle)
articleRouter.route('/like/:id').get(verifyMiddle,likeArticle)
articleRouter.route('/edit/:id').patch(verifyMiddle,editArticle)
articleRouter.route('/get/:id').get(getArticle)
articleRouter.route('/getall').get(getArticles)
articleRouter.route('/delete/:id').delete(deleteArticle)
export default articleRouter
