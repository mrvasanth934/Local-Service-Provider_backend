const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  servicePrice: {
    type: Number,
    required: true
  },
  commisionFee: {
    type: Number,
    default: 0
  },
  providerEarning: {
    type: Number,
    default: 0
  },
  distanceChargeperKm:{
    type:Number,
    default:3
  },
  total:{
    type:Number,
    default:0
  },
  orderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"order"
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "UPI", "CARD"],
    default:"COD"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },
  transactionId: {
    type: String
  },

  paidAt: Date,

  refundedAt: Date,

  refundReason: String

}, { timestamps: true });

const paymentModel = mongoose.model("Payment", paymentSchema)

module.exports = {paymentSchema,paymentModel}