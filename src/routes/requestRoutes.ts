import { Router } from "express";
import { acceptRequest, create_Request, getSentRequest, recieved_request, reject_request } from "../controllers/requestController.js";
import { verifyMiddle } from "../controllers/authController.js";

const requestRouter:Router = Router()
requestRouter.route('/send').post(create_Request)
requestRouter.route('/accept/:id').get(verifyMiddle,acceptRequest)
requestRouter.route('/getsentrequests').get(verifyMiddle,getSentRequest)
requestRouter.route('/getreceivedrequest/:propid').get(verifyMiddle,recieved_request)
requestRouter.route('/rejectrequest/:id').get(verifyMiddle,reject_request)

export default requestRouter