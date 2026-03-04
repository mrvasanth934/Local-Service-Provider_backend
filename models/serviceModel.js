const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    trim: true
  },
  serviceCategory: {
    type:String
  },
  serviceDescription: {
    type: String,
  },
  servicePrice: {
    type: Number
  },
  provider:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  providerExperince:{
    type:Number,
    default:1
  },
  ServiceImage: {
    type: String
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerifiedRequest:{
    type:Boolean,
    default:true
  }

}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);