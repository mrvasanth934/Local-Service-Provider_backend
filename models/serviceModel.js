const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  servicName: {
    type: String,
    trim: true
  },
  serviceCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  serviceDescription: {
    type: String,
  },
  servicePrice: {
    type: Number
  },
  provider:{
    type:mongoose.Schema.Types.ObjectId
  },
  providerExperince:{
    type:Number,
    default:2
  },
  distanceChargeperKm:{
    type:Number,
    default:3
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