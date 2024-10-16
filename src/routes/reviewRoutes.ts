import {Router} from 'express'
const reviewRoute = Router()
import {addReview,getAllReviews,deleteReview,getUserReviews,getRandomReviews} from '../controllers/reviewController.js'
import { verifyMiddle } from './../controllers/authController.js';
reviewRoute.route('/getAll').get(getAllReviews)
reviewRoute.route('/getRandom').get(getRandomReviews)
reviewRoute.use(verifyMiddle)
reviewRoute.route('/add').post(addReview)
reviewRoute.route('/getMyReview').get(getUserReviews)
reviewRoute.route('/delete/:id').delete(deleteReview)
export default reviewRoute