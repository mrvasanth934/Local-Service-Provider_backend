const express = require("express")

const {isAuthenticated, isProvider, isAdmin} = require("../middlewares/authMiddleware")

const { createService, getAllServices, getServiceBydId, getServicesRequests, updateServiceRequest, updateServicePrice, getServicesByCategory, serchServices, getProviderServices } = require("../controllers/serviceController")

const serviceRoute = express.Router()

serviceRoute.route("/create-service").post(isAuthenticated,isProvider,createService)

serviceRoute.route("/service-requests").get(isAuthenticated,isAdmin,getServicesRequests)

serviceRoute.route("/services").get(isAuthenticated,getAllServices)

serviceRoute.route("/service/:serviceId").get(isAuthenticated,getServiceBydId)

serviceRoute.route("/update-service-request/:serviceId/:status").put(isAuthenticated,isAdmin,updateServiceRequest)

serviceRoute.route("/update-service-price/:serviceId").put(isAuthenticated,isProvider,updateServicePrice)

serviceRoute.route("/services/:category").get(isAuthenticated,getServicesByCategory)

serviceRoute.route("/services/serch/:serchKeywords").get(isAuthenticated,serchServices)

serviceRoute.route("/provider-services").get(isAuthenticated,isProvider,getProviderServices)

module.exports = serviceRoute