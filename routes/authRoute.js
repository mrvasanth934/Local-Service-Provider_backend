const express = require('express')

const { signUp, login, getProfile, getUserById, updateEmail, updateMobileNumber, changePassword, forgetPassword, resetPassword, getAllUsers, updateUsername } = require('../controllers/authController')

const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware')

const authRoute = express.Router()

authRoute.route('/signup').post(signUp)

authRoute.route('/login').post(login)

authRoute.route('/profile').get(isAuthenticated,getProfile)

authRoute.route('/all-users').get(isAuthenticated,isAdmin,getAllUsers)

authRoute.route('/user/:userId').get(isAuthenticated,getUserById)

authRoute.route('/update-username').put(isAuthenticated,updateUsername)

authRoute.route('/update-email').put(isAuthenticated,updateEmail)

authRoute.route('/update-mobile-number').put(isAuthenticated,updateMobileNumber)

authRoute.route('/change-password').put(isAuthenticated,changePassword)

authRoute.route('/forget-password').put(forgetPassword)

authRoute.route('/reset-password/:resetPasswordToken').put(resetPassword)

module.exports = {authRoute}