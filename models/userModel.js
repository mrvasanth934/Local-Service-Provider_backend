const mongoose = require('mongoose')

const addressScema = mongoose.Schema({
    label: {
        type: String, // Home, Work, etc.
        required: true,
        trim: true,
    },
    fullAddress: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    location: {
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        },
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
})
const userScema = mongoose.Schema({
    userName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    role: {
        type: String,
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    profileImage: {
        type: String,
    },
    address: addressScema,
    providerRequest: {
        type: Boolean,
        default: false
    },
    isProvider: {
        type: Boolean,
        default: false
    },
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service"
        }
    ]
}, {
    timestamps: true
})

const userModel = mongoose.model("User", userScema)

module.exports = userModel