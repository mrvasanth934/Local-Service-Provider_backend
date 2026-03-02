const successResposne = (res, message, data = null) => {
    return res.json({
        success: true,
        message,
        data
    })
}

const failiureResposne = (res, message) => {
    return res.json({
        success: false,
        message,
    })
}

const errorResponse = (res, message, error = null) => {
    if (error.startsWith("Cannot destructure property")) {
        return res.json({
            success: false,
            message,
            error:"major fields are required"
        })
    }
    return res.json({
        success: false,
        message,
        error
    })
}


module.exports = { successResposne, failiureResposne, errorResponse }