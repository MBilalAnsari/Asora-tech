import OtpVerification from "../models/otpVerification.js";
import crypto from "crypto";
import User from "../models/User.js";

class OtpService {

    generateOtpCode() {
        // 6 digit
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async createNewOtp(userId, type, expiryMinutes = 2) {

        await OtpVerification.deleteMany({ userId, type });

        const otpCode = this.generateOtpCode();

        const hashedOtp = crypto
            .createHash("sha256")
            .update(otpCode)
            .digest("hex");

        console.log("Generated OTP:", otpCode, hashedOtp);
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const newOtp = await OtpVerification.create({
            userId,
            otpCode: hashedOtp,
            type, //  'PASSWORD_RESET', 'EMAIL_VERIFY' 
            expiresAt,
        });

        return { otpCode, newOtp };
    }

    async verifyOtp(userId, type, enteredOtp) {

        const hashedEnteredOtp = crypto
            .createHash("sha256")
            .update(enteredOtp)
            .digest("hex");

        console.log("Hashed Entered OTP:", hashedEnteredOtp);

        const otpRecord = await OtpVerification.findOne({
            userId,
            type,
            otpCode: hashedEnteredOtp,
            expiresAt: { $gt: Date.now() }
        });

        if (!otpRecord) {
            return { status: false, message: "Invalid or expired OTP" };
        }

        // OTP verified → delete it
        await OtpVerification.deleteOne({ _id: otpRecord._id });

        return { status: true, message: "OTP verified successfully" };
    }
    


}

export default new OtpService();