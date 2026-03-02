const notificationModel = require("../models/notificationModel");

const { failiureResposne, successResposne } = require("../utils/response");

const createNotification = async(sender,receiver,message,res)=>{
    if(!sender){
        return failiureResposne(res,"sender id is reqquired")
    }
    if(!receiver){
        return failiureResposne(res,"receiver id is reqquired")
    }
    if(!message){
        return failiureResposne(res,"message is reqquired")
    }
    const createNotification = await notificationModel.create({sender,receiver,message})
    if(!createNotification){
        return failiureResposne(res,"notification sent failiure")
    }
    return true
}
const myNotifications= async(req,res)=>{
    const {userId} = req.params;
    if(userId.length != 24){
        return failiureResposne(res,"inValid userId")
    }
    const myNotifications = await notificationModel.findOne({receiver:userId})
    if(myNotifications){
        if(myNotifications.length == 0){
            return successResposne(res,"no more notifications")
        }
        return successResposne(res,"notifications get successfull",myNotifications)
    }
    return failiureResposne(res,"can`t get notifications")
}

module.exports = {createNotification,myNotifications}