import { Router } from "express";
import { addProperty, delPropertis, editproperty, fileterProperty, getProperties, getProperty } from "../controllers/propertyController.js";
import { verifyMiddle } from "../controllers/authController.js";
const propertyRoute = Router()
propertyRoute.route('/add').post(addProperty)
propertyRoute.route('/get/:id').get(getProperty)
propertyRoute.route('/getAll').get(getProperties)
propertyRoute.route('/delete/:id').delete(verifyMiddle,delPropertis)
propertyRoute.route('/filter').get(fileterProperty)
propertyRoute.route('/edit/:id').patch(editproperty)
export default propertyRoute