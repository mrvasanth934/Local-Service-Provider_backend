const { use } = require("react")

const userModel = require("../models/userModel")

const { failiureResposne, successResposne, errorResponse } = require("../utils/response")

const sentProviderRequst = async (req, res) => {
    try {
        const user = req.user
        const providerRequest = await userModel.updateOne({ email: user.email }, { providerRequest: true })
        if (!providerRequest) {
            return failiureResposne(res, "provider request fail")
        }
        return successResposne(res, "provider request sent")
    } catch (error) {
        return errorResponse(res, "error from sentProviderRequest", error.message)
    }
}

const showProviderRequests = async (req, res) => {
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
        if (status == true) {
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
    } catch (error) {
        return errorResponse(res, "error from updateProviderRequest", error.message)
    }
}

const checkProviderRequestStatus = async (req, res) => {
    try {
        const { user } = req.body
        if (user.isProvider == false && user.providerRequest == false) {
            return successResposne(res, "provider request not accepted")
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
