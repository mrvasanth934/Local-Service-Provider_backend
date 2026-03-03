const express = require("express")

const {isAuthenticated, isProvider} = require("../middlewares/authMiddleware")

const { createService } = require("../controllers/serviceController")

const serviceRoute = express.Router()

serviceRoute.route("/create-service").post(isAuthenticated,isProvider,createService)

module.exports = serviceRoute