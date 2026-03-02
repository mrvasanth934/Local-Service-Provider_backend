const { failiureResposne, successResposne, errorResponse } = require("../utils/response")

const orderModel = require("../models/orderModdel")

const createOrder = async(req,res)=>{
    const inputValidate = (provider,service,label,fullAddress,city,state,pincode,amount,paymentMethod)=>{
        if(!provider){
            return failiureResposne(res,"provider is required")
        }
        if(!service){
            return failiureResposne(res,"service is required")
        }
        if(!label){
            return failiureResposne(res,"label is required")
        }
        if(!fullAddress){
            return failiureResposne(res,"fullAddress is required")
        }
        if(!city){
            return failiureResposne(res,"city is required")
        }
        if(!state){
            return failiureResposne(res,"state is required")
        }
        if(!pincode){
            return failiureResposne(res,"pincode is required")
        }
        if(!amount){
            return failiureResposne(res,"amount is required")
        }
        if(!paymentMethod){
            return failiureResposne(res,"paymentMethod is required")
        }
        return true
    }
    const user = req.user

    const {provider,service,label,fullAddress,city,state,pincode,amount,paymentMethod} = req.body;

    if(inputValidate(provider,service,label,fullAddress,city,state,pincode,amount,paymentMethod) == true){
        const createService = await orderModel.create({user:user._id,provider,service,address:{label,fullAddress,city,state,pincode},paymenth:{}})
    }
}