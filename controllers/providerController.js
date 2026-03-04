
const userModel = require("../models/userModel")

const { failiureResposne, successResposne, errorResponse } = require("../utils/response")

const orderModel = require("../models/orderModdel")

const sentProviderRequst = async (req, res) => {
    try {
        const user = req.user;
        if(user.role == "admin"){
            return failiureResposne(res,"you are admin")
        }
        if(user.role == "provider"){
            return failiureResposne(res,"you are already provider")
        }
        if (user.providerRequest == true) {
            return failiureResposne(res, "provider request already sent")
        }
        const providerRequest = await userModel.updateOne({ email: user.email }, { providerRequest: true })
        if (!providerRequest) {
            return failiureResposne(res, "provider request fail")
        }
        return successResposne(res, "provider request sent")
    } catch (error) {
        return errorResponse(res, "error from sentProviderRequest", error.message)
    }
}

const getAllProviders = async (req, res) => {
    try {
        const providers = await userModel.find({ isProvider: true, role: "provider" }).populate("services")
        if (providers) {
            if (providers.length == 0) {
                return successResposne(res, "no more providers")
            }
            return successResposne(res, "all providers", providers)
        }
        return failiureResposne(res, "can`t get all providers")
    } catch (error) {
        return errorResponse(res, "error from get all providers", error.message)
    }
}

const getSingleProvider = async (req, res) => {
    try {
        const { providerId } = req.params
        const provider = await userModel.findOne({ _id: providerId, isProvider: true, role: "provider" }).populate("services")
        if (provider) {
            return successResposne(res, "provider", provider)
        }
        return failiureResposne(res, "can`t get provider")
    } catch (error) {
        return errorResponse(res, "error from get single provider", error.message)
    }
}

const getAllProviderRequests = async (req, res) => {
    try {
        const providerRequestsProfiles = await userModel.find({ providerRequest: true })
        if (providerRequestsProfiles) {
            if (providerRequestsProfiles.length == 0) {
                return successResposne(res, "no more provider Requests")
            }
            return successResposne(res, "providerRequests", providerRequestsProfiles)
        }

    } catch (error) {
        return errorResponse(res, "error from sentProviderRequest", error.message)
    }
}

const updateProviderRequest = async (req, res) => {
    try {
        const { userId, status } = req.params
        if (userId.length != 24) {
            return failiureResposne(res, "inValid UserId")
        }
        const user = await userModel.findOne({_id:userId})
        if(!user.providerRequest){
            return failiureResposne(res,"no request from this id")
        }
        if(user.isProvider){
            return failiureResposne(res,"is already provider")
        }
        if (!user) {
            return failiureResposne(res, "can`t find user")
        }

        else {
            if (status == "true") {
                const udpdateUser = await userModel.updateOne({ _id: userId }, { providerRequest: false, isProvider: true, role: "provider" })
                if (!udpdateUser) {
                    return failiureResposne(res, "can`t update provider Request")
                }
                return successResposne(res, "provider request updated")
            }
            const udpdateUser = await userModel.updateOne({ _id: userId }, { providerRequest: false, isProvider: false, role: "user" })
            if (!udpdateUser) {
                return failiureResposne(res, "can`t update provider Request")
            }
            return successResposne(res, "provider request updated")
        }
    } catch (error) {
        return errorResponse(res, "error from updateProviderRequest", error.message)
    }
}

const getProviderRequestStatus = async (req, res) => {
    try {
        const user = req.user
        if(user.role == "provider" && user.isProvider){
            return failiureResposne("you are already provider")
        }
        if (user.isProvider == false && user.providerRequest == false) {
            return successResposne(res, "provider request not sent")
        }
        if (user.isProvider = false && user.providerRequest == true) {
            return successResposne(res, "provider request sent")
        }
        if (user.isProvider = true && user.providerRequest == false) {
            return successResposne(res, "provider request accepted")
        }
    } catch (error) {
        return errorResponse(res, "error from check provider request status", error.message)
    }
}

module.exports = { sentProviderRequst, getAllProviders, getSingleProvider, getAllProviderRequests, updateProviderRequest, getProviderRequestStatus, }