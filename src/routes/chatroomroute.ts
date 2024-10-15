import { Router } from "express";
import { verifyMiddle } from "../controllers/authController.js";
import { getAllChatrooms, getChatroom} from "../controllers/chatboxController.js";
const chatboxroute = Router()
chatboxroute.route('/allchats').get(verifyMiddle,getAllChatrooms)
chatboxroute.route('/:id').get(verifyMiddle,getChatroom)
export default chatboxroute