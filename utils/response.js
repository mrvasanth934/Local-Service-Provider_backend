const successResposne = (res,message,data = null)=>{
    return res.json({
        success : true,
        message,
        data
    })
}

const failiureResposne = (res,message)=>{
    return res.json({
        success : false,
        message,
    })
}

const errorResponse = (res,message,error = null) =>{
    return res.json({
        success : false,
        message,
        error
    })
}


module.exports = {successResposne , failiureResposne , errorResponse}