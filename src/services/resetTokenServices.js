import ResetPasswordToken from "../models/passwordResetToken.js";
import crypto from "crypto";

class ResetTokenService {
    async generateResetToken(userId, expiryMinutes = 10) {
       
        await ResetPasswordToken.deleteMany({ userId });

       
        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        await ResetPasswordToken.create({
            userId,
            token,
            expiresAt,
        });

        return token;
    }

    async verifyResetToken(token) {
        const record = await ResetPasswordToken.findOne({
            token,
            expiresAt: { $gt: Date.now() },
        });
        return record;
    }

    async consumeToken(token) {
        await ResetPasswordToken.deleteOne({ token });
    }
}

export default new ResetTokenService();