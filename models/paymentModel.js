const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  providerEarning: {
    type: Number,
    default: 0
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