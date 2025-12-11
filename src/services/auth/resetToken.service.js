import ResetPasswordToken from "../../models/passwordResetToken.js";
import crypto from "crypto";

class ResetTokenService {
    async generateResetToken(userId, expiryMinutes = 10) {

        await ResetPasswordToken.deleteMany({ userId });
        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        await ResetPasswordToken.create({
            userId,
            token: hashedToken,
            expiresAt
        });

        console.log("Generated Reset Token:", token, hashedToken);
        return token;
    }

    async verifyResetToken(realToken) {
        const hashedToken = crypto.createHash("sha256").update(realToken).digest("hex");

        return await ResetPasswordToken.findOne({
            token: hashedToken,
            expiresAt: { $gt: Date.now() },
        });
    }

    async consumeToken(realToken) {
        const hashedToken = crypto.createHash("sha256")
        .update(realToken)
        .digest("hex");

        await ResetPasswordToken.deleteOne({ token: hashedToken });
    }

}

export default new ResetTokenService();
