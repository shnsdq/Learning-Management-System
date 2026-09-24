import express from 'express'
import { login, logout, signup,sendOTP,verifyOTP,resetPassword } from '../controllers/authController.js'


const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.get("/logout", logout)
authRouter.post("/sendotp", sendOTP)
authRouter.post("/verifyotp", verifyOTP)
authRouter.post("/resetpassword", resetPassword)

export default authRouter
