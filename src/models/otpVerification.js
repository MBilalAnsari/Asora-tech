import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    otpCode: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['PASSWORD_RESET', 'EMAIL_VERIFY', 'PHONE_VERIFY'], 
        uppercase: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const OtpVerification = mongoose.model("OtpVerification", otpSchema);
export default OtpVerification;