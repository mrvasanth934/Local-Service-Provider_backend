const express = require("express")

const { sentProviderRequst, getAllProviders, getSingleProvider, getAllProviderRequests, updateProviderRequest, getProviderRequestStatus } = require("../controllers/providerController")
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware")

const providerRoute = express.Router()

providerRoute.route("/provider-request").put(isAuthenticated,sentProviderRequst)

providerRoute.route("/all-providers").get(isAuthenticated,isAdmin,getAllProviders)

providerRoute.route("/provider/:providerId").get(isAuthenticated,getSingleProvider)

providerRoute.route("/provider-requests").get(isAuthenticated,isAdmin,getAllProviderRequests)

providerRoute.route("/update-provider-request/:userId/:status").put(isAuthenticated,isAdmin,updateProviderRequest)

providerRoute.route("/provider-request-status").get(isAuthenticated,getProviderRequestStatus)

module.exports = {providerRoute}