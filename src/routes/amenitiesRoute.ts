import {Router} from 'express'
import { addAmenities, getAll } from '../controllers/amenitiesController.js'
const amenitiesRoute = Router()
amenitiesRoute.route('/add').post(addAmenities)
amenitiesRoute.route('/getAll').get(getAll)
export default amenitiesRoute