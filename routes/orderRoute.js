const express = require("express")

const { isAuthenticated, isProvider, isAdmin } = require("../middlewares/authMiddleware")

const { createOrder, getUserOrders, getProviderOrders, getSingleOrderByUser, getSingleOrderByProvider, getAllOrders, getSingleOrder, rejectOrderByProvider, cancelOrderByUser } = require("../controllers/orderController")

const orderRoute = express.Router()

orderRoute.route('/create').post(isAuthenticated,createOrder)

orderRoute.route('/my-orders').get(isAuthenticated,getUserOrders)

orderRoute.route("/user/:orderId").get(isAuthenticated,getSingleOrderByUser)

orderRoute.route("/provider-orders").get(isAuthenticated,isProvider,getProviderOrders)

orderRoute.route("/provider/:orderId").get(isAuthenticated,isProvider,getSingleOrderByProvider)

orderRoute.route("/all-orders").get(isAuthenticated,isAdmin,getAllOrders)

orderRoute.route("/order/:orderId").get(isAuthenticated,isAdmin,getSingleOrder)

orderRoute.route("/provider/reject-order/:orderId").put(isAuthenticated,isProvider,rejectOrderByProvider)

orderRoute.route("/user/cancel-order/:orderId").put(isAuthenticated,cancelOrderByUser)

module.exports = orderRoute