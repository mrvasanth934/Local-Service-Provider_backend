const mongoose = require("mongoose");

const { paymentSchema } = require("./paymentModel");

const addressSchema = mongoose.Schema({
    label: {
        type: String,
        trim: true,
    },
    fullAddress: {
        type: String,
        trim: true,
    },
    district:{
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    pincode: {
        type: String,
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    },
    isDefault: {
        type: Boolean,
        default: true,
    },
})

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    address: addressSchema,
    orderedDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        enum: [
            "pending",       
            "accepted",
            "rejected",
            "in-progress",
            "completed",
            "cancelled"
        ],
        default: "pending"
    },
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Payment"
    },
    orderTotal:{
        type:Number
    },
    acceptedAt: Date,
    cancelledAt: Date,
    completedAt: Date

}, { timestamps: true });

const orderModel = mongoose.model("Orders",orderSchema)

module.exports = orderModel