const userModel = require("../models/userModel")

const { failiureResposne, errorResponse } = require("../utils/response")

const jwt = require('jsonwebtoken')

const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            return failiureResposne(res, "continue with login")
        }
        const verifyToken = await jwt.verify(token, process.env.PASSKEY)
        if (!verifyToken) {
            return failiureResposne(res,"unAuthorized token")
        }
        const email = verifyToken.email
        const user = await userModel.findOne({ email })
        if (!user) {
            return failiureResposne(res, "can`t find user")
        }
        req.user = user
        return next()
    } catch (error) {
        if (error.message == "jwt expired") {
            return failiureResposne(res, "continue with login")
        }
        if (error.message == "invalid signature") {
            return failiureResposne(res, "continue with login")
        }
        errorResponse(res, "error from get profile", error.message)
    }
}
const isAdmin = async(req,res,next) =>{
    const admin = req.user;
    if(admin.role == "admin"){
        return next()
    }
    return failiureResposne(res,"this service only access by the admin")
}

const isProvider = async(req,res,next) =>{
    const admin = req.user;
    if(admin.role == "provider"){
        return next()
    }
    return failiureResposne(res,"this service only access by the provider")
}

module.exports = { isAuthenticated,isAdmin,isProvider }