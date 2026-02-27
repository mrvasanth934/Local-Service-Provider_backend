const { failiureResposne } = require("./response")

const emailvalidate = /^[a-z]+/
const mobileValidate = /^[6-9]/
const validateEmail = (res, email) => {
    if (!/^[a-z]+[0-9]*[a-z]*@[a-z]/.test(email) || !email.endsWith(".com")) {
        return failiureResposne(res, "enter a valid email")
    }
    return true
}

const validateMobileNumber = (res, mobileNumber) => {
    if (mobileNumber.length != 10) {
        return failiureResposne(res, "mobile number must 10 character")
    }
    else if (!mobileValidate.test(mobileNumber)) {
        return failiureResposne(res, "enter a valid mobilenumber")
    }
    else{
        return true
    }
}

const validatePassword = (res, password) => {
    if (password.length < 8) {
        return failiureResposne(res, "Mobile number must 10 character")
    }
    if (!/[a-z]+/.test(password)) {
        return failiureResposne(res, "Enter atleast one small letter")
    }
    if (!/[A-Z]+/.test(password)) {
        return failiureResposne(res, "Enter atleast one capital letter")
    }
    if (!/\d+/.test(password)) {
        return failiureResposne(res, "Enter atleast one number")
    }
    if (!/[!@#$%^&*]+/.test(password)) {
        return failiureResposne(res, "Enter atleast one special character")
    }
}

module.exports = { validateEmail, validateMobileNumber,validatePassword }