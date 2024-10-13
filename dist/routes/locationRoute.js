import { Router } from 'express';
import { addLocation, deleteLocation, editlocation, makeDefaultLocation } from '../controllers/locationController.js';
const locationRouter = Router();
locationRouter.route('/addLocation').post(addLocation);
locationRouter.route('/makedefault').patch(makeDefaultLocation);
locationRouter.route('/editlocation/:id').patch(editlocation);
locationRouter.route('/deletelocation:/id').patch(deleteLocation);
export default locationRouter;
