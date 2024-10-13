import express, { Router } from 'express'
import { changePassword, createUser,deleteMe, ForgotPassword, Login, logout, verifyMiddle,verifyUser } from '../controllers/authController.js'
export const authRouter:Router = express.Router()
authRouter.route('/').post(createUser)
authRouter.route('/verify').get(verifyMiddle,verifyUser)
authRouter.route('/login').post(Login)
authRouter.route('/forgotpassword').patch(ForgotPassword)
authRouter.route('/deleteMe/:id').delete(deleteMe)
authRouter.route('/logout/:id').get(logout)
authRouter.route('/changepassword/:token').patch(changePassword)
