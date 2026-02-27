const userModel = require("../models/userModel")

const bcrypt = require('bcrypt')

const { failiureResposne, errorResponse, successResposne } = require("../utils/response")

const { validateEmail, validateMobileNumber, validatePassword } = require("../utils/validate")

const jwt = require('jsonwebtoken')

const signUp = async (req, res) => {
    const vaildate = (userName, email, password, mobileNumber) => {
        if (!userName) {
            return failiureResposne(res, "userName is required")
        }
        if (!email) {
            return failiureResposne(res, "email is required")
        }
        if (!mobileNumber) {
            return failiureResposne(res, "mobileNumber is required")
        }
        if (!password) {
            return failiureResposne(res, "password is required")
        }
        validateEmail(res, email)
        validateMobileNumber(res, mobileNumber)
        validatePassword(res, password)
    }
    try {
        const { userName, email, password, mobileNumber } = req.body
        vaildate(userName, email, password, mobileNumber);
        const isAlreadyExistByEmail = await userModel.findOne({ email })
        if (isAlreadyExistByEmail) {
            return failiureResposne(res, "user already exist by th email")
        }
        const isAlreadyExistByUserName = await userModel.findOne({ userName })
        if (isAlreadyExistByUserName) {
            return failiureResposne(res, "user already exist by th userName")
        }
        const isAlreadyExistByPhoneNumber = await userModel.findOne({ mobileNumber })
        if (isAlreadyExistByPhoneNumber) {
            return failiureResposne(res, "user already exist by the PhoneNumber")
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ userName, email, password: encryptedPassword, mobileNumber })
        if (!user) {
            return failiureResposne(res, "signup fail")
        }
        return successResposne(res, "signup successfull")
    } catch (error) {
        if (error.message == "Cannot destructure property 'fullName' of 'req.body' as it is undefined.") {
            return failiureResposne(res, "major fields are required")
        }
        return errorResponse(res, "error from signup", error.message)
    }
}

const login = async (req, res) => {
    try {
        const handleLogin = async (user) => {
            const token = jwt.sign({ email: user.email }, process.env.PASSKEY, { expiresIn: "1hr" })
            if (token) {
                res.cookie("token", token, { maxAge: 1000 * 60 * 60 })
                return successResposne(res, "login successfull", user)
            }
            return failiureResposne(res, "can`t genrate token")
        }
        const comparePassword = async (enteredPassword, user) => {
            return await bcrypt.compare(enteredPassword, user.password)
        }
        const { userCredintials, password } = req.body;
        if (!userCredintials) {
            return failiureResposne(res, "email, userName or mobileNumber is required")
        }
        if (!password) {
            return failiureResposne(res, "password is required")
        }
        if (userCredintials.includes("@")) {
            validateEmail(res, userCredintials)
            const isExistByEmail = await userModel.findOne({ email: userCredintials })
            if (isExistByEmail) {
                if (!await comparePassword(password, isExistByEmail)) {
                    return failiureResposne(res, "in correct password")
                }
                return handleLogin(isExistByEmail)
            }

        }
        else {
            const existByUserName = await userModel.findOne({ userName: userCredintials })
            if (existByUserName) {
                if (!await comparePassword(password, existByUserName)) {
                    return failiureResposne(res, "in correct password")
                }
                return handleLogin(existByUserName)
            }
            else {
                validateMobileNumber(res, userCredintials)
                const existByPhoneNumber = await userModel.findOne({ mobileNumber: userCredintials })
                if (existByPhoneNumber) {
                    if (!await comparePassword(password, existByPhoneNumber)) {
                        return failiureResposne(res, "in correct password")
                    }
                    else {
                        return handleLogin(existByPhoneNumber)
                    }
                }
                return failiureResposne(res, "user can`t find")
            }
        }

    } catch (error) {
        errorResponse(res, "error from login", error.message)
    }
}

const getProfile = async (req, res) => {
    try {
        if (req.user) {
            return successResposne(res, "", req.user)
        }
    } catch (error) {
        if (error.message == "jwt expired") {
            return failiureResposne(res, "continue with login")
        }
        if (error.message == "invalid signature") {
            return failiureResposne(res, "continue with login")
        }
        return errorResponse(res, "errot from get profile", error.message)
    }
}

const getUserById = async (req, res) => {
    const { userId } = req.params
    if (userId.length != 24) {
        return failiureResposne(res, "inValid user id")
    }
    const user = await userModel.findOne({ _id: userId })
    if (!user) {
        return failiureResposne(res, "can`t find user by the id")
    }
    return successResposne(res, "", user)
}

const updateEmail = async (req, res) => {
    try {
        const handleLogin = async (user) => {
            const token = jwt.sign({ email: user.email }, process.env.PASSKEY, { expiresIn: "1hr" })
            if (token) {
                res.cookie("token", token, { maxAge: 60 * 60 * 1000, expiresIn: 60 * 60 * 1000 })
                return successResposne(res, "email updated", user)
            }
            return failiureResposne(res, "can`t genrate token")
        }
        const { email } = req.body
        if (!email) {
            return failiureResposne(res, "email is required")
        }
        if (validateEmail(res, email) == true) {
            const isAlreadyExist = await userModel.findOne({ email })
            if (isAlreadyExist) {
                return failiureResposne(res, "user already exist by the email id")
            }
            const user = req.user
            const updatedUser = await userModel.updateOne({ email: user.email }, { email })
            if (!updatedUser) {
                return failiureResposne(res, "can`t update")
            }
            const updateUser = await userModel.findOne({ email })
            if (!updateUser) {
                return failiureResposne(res, "can`t find update user")
            }
            return handleLogin(updateUser)
        }

    } catch (error) {
        return errorResponse(res, "error from update email", error.message)
    }
}

const updateMobileNumber = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        if (!mobileNumber) {
            return failiureResposne(res, "mobile number is required")
        }
        validateMobileNumber(res, mobileNumber)
        const isAlreadyExist = await userModel.findOne({ mobileNumber })
        if (isAlreadyExist) {
            return failiureResposne(res, "user already exist by the mobile number")
        }
        const user = req.user
        const updateUser = await userModel.updateOne({ email: user.email }, { mobileNumber })
        if (!updateUser) {
            return failiureResposne(res, "can`t update")
        }
        return successResposne(res, "updated successfull")
    } catch (error) {
        return errorResponse(res, "error from update email", error.message)
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        if (!currentPassword) {
            return failiureResposne(res, "current password is required")
        }
        if (!newPassword) {
            return failiureResposne(res, "new password is required")
        }
        if (!confirmPassword) {
            return failiureResposne(res, "confirm password is required")
        }
        const user = req.user
        if (user.password != currentPassword) {
            return failiureResposne(res, "in correct password")
        }
        validatePassword(res, newPassword)
        if (newPassword != confirmPassword) {
            return failiureResposne(res, "password does not matched")
        }
        const encryptedPassword = await bcrypt.hash(confirmPassword, 10)
        const updateUser = await userModel.updateOne({ email: user.email }, { password: encryptedPassword })
        if (!updateUser) {
            return failiureResposne(res, "can`t update password")
        }
        return successResposne(res, "password updated")
    } catch (error) {
        return errorResponse(res, "error from change password", error.message)
    }
}

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return failiureResposne(res, "email is required")
        }
        validateEmail(res, email)
        const isExist = await userModel.findOne({ email })
        if (!isExist) {
            return failiureResposne(res, "can`t find user by the email")
        }
        const forgetPasswordToken = await jwt.sign({ email }, process.env.PASSKEY, { expiresIn: "10m" })
        if (!forgetPasswordToken) {
            return failiureResposne(res, "can`gentrate token")
        }
        const changePasswordlink = `http://localhost:3000/api/v1/auth/reset-password/${forgetPasswordToken}`
        return successResposne(res, `reset password link ${changePasswordlink}`)
    } catch (error) {
        return errorResponse(res, "error from forget password", error.message)
    }
}

const resetPassword = async (req, res) => {
    const handleLogin = async (user) => {
        const token = jwt.sign({ email: user.email }, process.env.PASSKEY, { expiresIn: "1hr" })
        if (token) {
            res.cookie("token", token, { maxAge: 60 * 60 * 1000, expiresIn: 60 * 60 * 1000 })
            return successResposne(res, "password chnaged", user)
        }
        return failiureResposne(res, "can`t genrate token")
    }
    const { newPassword, confirmPassword } = req.body;
    const user = req.user
    if (!newPassword) {
        return failiureResposne(res, "newPassword is required")
    }
    if (!confirmPassword) {
        return failiureResposne(res, "confirmPassword is required")
    }
    validatePassword(res, newPassword)
    if (user.password == newPassword) {
        return failiureResposne(res, "same password")
    }
    if (newPassword != confirmPassword) {
        return failiureResposne(res, "password not matched")
    }
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updateUser = await userModel.updateOne({ email: user.email }, { password: encryptedPassword })
    if (!updateUser) {
        return failiureResposne(res, "can`t update password")
    }
    return handleLogin(user)
}

module.exports = { signUp, login, getProfile, getUserById, updateEmail, updateMobileNumber, changePassword, forgetPassword, resetPassword }