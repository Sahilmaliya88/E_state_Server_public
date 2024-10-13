import { Router } from "express";
import { acceptRequest, create_Request } from "../controllers/requestController.js";
import { verifyMiddle } from "../controllers/authController.js";
const requestRouter = Router();
requestRouter.route('/send').post(create_Request);
requestRouter.route('/accept/:id').get(verifyMiddle, acceptRequest);
export default requestRouter;
