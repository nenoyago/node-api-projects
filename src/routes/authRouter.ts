import express from 'express'
import AuthController from '../app/controllers/authController'
import UserValidation from '../app/middlewares/userValidation'

const authRouter = express.Router()

const authController = new AuthController()

authRouter.post('/register', UserValidation, authController.register)
authRouter.post('/authenticate', authController.authenticate)
authRouter.post('/forgot_password', authController.forgotPassword)
authRouter.post('/reset_password', authController.resetPassword)

export default authRouter