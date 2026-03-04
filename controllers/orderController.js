const orderModel = require("../models/orderModdel")
const { paymentModel } = require("../models/paymentModel")

const { failiureResposne, successResposne, errorResponse } = require("../utils/response")

const createOrder = async (req, res) => {
    try {
        const inputValidate = (provider, service, label, fullAddress, city, state, pincode, servicePrice, paymentMethod, distance) => {
            if (!provider) {
                return failiureResposne(res, "provider is required")
            }
            if (!service) {
                return failiureResposne(res, "service is required")
            }
            if (!label) {
                return failiureResposne(res, "label is required")
            }
            if (!fullAddress) {
                return failiureResposne(res, "fullAddress is required")
            }
            if (!city) {
                return failiureResposne(res, "city is required")
            }
            if (!state) {
                return failiureResposne(res, "state is required")
            }
            if (!pincode) {
                return failiureResposne(res, "pincode is required")
            }
            if (!servicePrice) {
                return failiureResposne(res, "amount is required")
            }
            if (!paymentMethod) {
                return failiureResposne(res, "paymentMethod is required")
            }
            if (!distance) {
                return failiureResposne(res, "distance is required")
            }
            return true
        }
        const user = req.user
        const { provider, service, label, fullAddress, city, state, pincode, servicePrice, paymentMethod, distance, } = req.body;
        if (inputValidate(provider, service, label, fullAddress, city, state, pincode, servicePrice, paymentMethod, distance) == true) {
            const commisionFee = Number(servicePrice) / 10
            const distanceChargeperKm = Number(distance) * 3;
            const providerEarning = (Number(servicePrice) - commisionFee) + distanceChargeperKm
            const total = servicePrice + distanceChargeperKm
            const createpayment = await paymentModel.create({servicePrice,commisionFee,providerEarning,distanceChargeperKm,total,paymentMethod});
            if(!createpayment){
                return failiureResposne("order failed")
            }
            const createService = await orderModel.create({ user: user._id, provider, service, address: { label, fullAddress, city, state, pincode }, payment: createpayment._id,orderTotal:total })
            if (!createService) {
                return failiureResposne(res, "order failed")
            }
            await paymentModel.updateOne({_id : createpayment._id},{orderId:createService._id})
            return successResposne(res, "order successfull", createService)
        }
    } catch (error) {
        return errorResponse(res, "error from create order", error.message)
    }
}

const getUserOrders = async (req, res) => {
    try {
        const user = req.user;
        const orders = await orderModel.find({ user: user._id }).populate("user").populate("provider").populate("service").populate("payment")
        if (orders) {
            if (orders.length == 0) {
                return successResposne(res, "no more orders")
            }
            return successResposne(res, "my orders", orders)
        }
        return failiureResposne(res, "can`t get orders")
    } catch (error) {
        return errorResponse(res, "error from get user orders", error.message)
    }
}

const getSingleOrderByUser = async (req,res) => {
    try {
        const { orderId } = req.params
        if (orderId.length != 24) {
            return failiureResposne(res, "inValid orderId")
        }
        const user = req.user;
        const order = await orderModel.findOne({ _id: orderId, user: user._id }).populate("user").populate("provider").populate("service").populate("payment")
        if (order) {
            return successResposne(res, "order", order)
        }
        return failiureResposne(res, "can`t get order")
    } catch (error) {
        return failiureResposne(res, "error from getSingleOrderByUser", error.message)
    }
}

const getProviderOrders = async (req, res) => {
    try {
        const provider = req.user;
        const orders = await orderModel.find({ provider: provider._id }).populate("user").populate("provider").populate("service").populate("payment")
        if (orders) {
            if (orders.length == 0) {
                return successResposne(res, "no more orders")
            }
            return successResposne(res, "my orders", orders)
        }
        return failiureResposne(res, "can`t get orders")
    } catch (error) {
        return failiureResposne(res, "error from get provider orders", error.message)
    }
}

const getSingleOrderByProvider = async (req,res) => {
    try {
        const { orderId } = req.params
        if (orderId.length != 24) {
            return failiureResposne(res, "inValid orderId")
        }
        const provider = req.user;
        const order = await orderModel.findOne({ _id: orderId, provider: provider._id }).populate("user").populate("provider").populate("service").populate("payment")
        if (order) {
            return successResposne(res, "order", order)
        }
        return failiureResposne(res, "can`t get order")
    } catch (error) {
        return failiureResposne(res, "error from getSingleOrderByProvider", error.message)
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().populate("user").populate("provider").populate("service").populate("payment")
        if (orders) {
            if (orders.length == 0) {
                return successResposne(res, "no more orders")
            }
            return successResposne(res, "my orders", orders)
        }
        return failiureResposne(res, "can`t get orders")
    } catch (error) {
        return failiureResposne(res, "error from getAllOrders", error.message)
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        if (orderId.length != 24) {
            return failiureResposne(res, "inValid orderId")
        }
        const order = await orderModel.findOne({ _id: orderId }).populate("user").populate("provider").populate("service").populate("payment")
        if (order) {
            return successResposne(res, "order", order)
        }
        return failiureResposne(res, "can`t get order")
    } catch (error) {
        return failiureResposne(res, "error from getSingleOrder", error.message)
    }
}

const rejectOrderByProvider = async (req, res) => {
    try {
        const { orderId } = req.params
        if (orderId.length != 24) {
            return failiureResposne(res, "inValid orderId")
        }
        const provider = req.user;
        const order = await orderModel.findOne({ _id: orderId, provider: provider._id })
        if (order) {
            if (order.orderStatus == "rejected") {
                return successResposne(res, "order already rejected")
            }
            if (order.orderStatus == "completed") {
                return successResposne(res, "order already  completed")
            }
            if (order.orderStatus == "cancelled") {
                return successResposne(res, "order already canceled")
            }
            else {
                const rejectedOrder = await orderModel.updateOne({ _id: orderId }, { orderStatus: "rejected" })
                if (rejectedOrder) {
                    return successResposne(res, "order rejected")
                }
                return failiureResposne(res, "can`t reject the order")
            }
        }
        return failiureResposne(res, "can`t get order")
    } catch (error) {
        return failiureResposne(res, "error from updateOrderStatusByProvider", error.message)
    }
}

const cancelOrderByUser = async (req, res) => {
    try {
        const { orderId } = req.params
        if (orderId.length != 24) {
            return failiureResposne(res, "inValid orderId")
        }
        const user = req.user;
        const order = await orderModel.findOne({ _id: orderId, user: user._id })
        if (order) {
            if (order.orderStatus == "rejected") {
                return successResposne(res, "order already rejected")
            }
            if (order.orderStatus == "completed") {
                return successResposne(res, "order already  completed")
            }
            if (order.orderStatus == "cancelled") {
                return successResposne(res, "order already canceled")
            }
            else {
                const rejectedOrder = await orderModel.updateOne({ _id: orderId}, { orderStatus: "cancelled" })
                if (rejectedOrder) {
                    return successResposne(res, "order cancelled")
                }
                return failiureResposne(res, "can`t reject the order")
            }
        }
        return failiureResposne(res, "can`t get order")
    } catch (error) {
        return failiureResposne(res, "error from updateOrderStatusByUser", error.message)
    }
}

module.exports = {createOrder,getUserOrders,getProviderOrders,getSingleOrderByProvider,getSingleOrderByUser,getAllOrders,getSingleOrder,rejectOrderByProvider,cancelOrderByUser}