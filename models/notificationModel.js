const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message:{
        type:String,
    },
    viewd:{
        type:Boolean,
        default:false
    },
    time:{
        type:Date,
        default:Date.now()
    }
})

const notificationModel = mongoose.model("notification",notificationSchema)

module.exports = notificationModel