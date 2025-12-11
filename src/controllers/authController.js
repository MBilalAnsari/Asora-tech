import UserService from "../services/user/user.service.js";
import OtpService from "../services/auth/otp.service.js";
import User from "../models/User.js";
import resetTokenServices from "../services/auth/resetToken.service.js";
import emailService from "../services/shared/email.service.js";
import AppError from "../utils/AppError.js";
import { sanitizeUser } from "../utils/responseHelper.js";

class AuthController {
  async signup(req, res, next) {
    try {
      const { user, token } = await UserService.signup(req.body);
      const sanitizedUser = sanitizeUser(user);
      res.status(201).json({
        message: "User created successfully",
        token,
        user: sanitizedUser
      });
    } catch (error) {
      next(new AppError(error.message, 400));
    }
  }

  async login(req, res, next) {
    try {
      const { user, token } = await UserService.login(req.body);
      const sanitizedUser = sanitizeUser(user);
      res.json({
        message: "Login successful",
        token,
        user: sanitizedUser
      });
    } catch (error) {
      next(new AppError(error.message, 401));
    }
  }

  async google(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return next(new AppError("idToken is required", 400));
      }

      const { user, token } = await UserService.googleAuth(idToken);
      const sanitizedUser = sanitizeUser(user);

      res.json({
        message: "Google login successful",
        token,
        user: sanitizedUser
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async forgotPasswordRequest(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const { otpCode, newOtp } = await OtpService.createNewOtp(
        user._id,
        'PASSWORD_RESET'
      );

      await emailService.sendOtpEmail(email, otpCode);

      res.json({
        message: "OTP Sent Successfully.",
        email: user.email,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { email, type, enteredOtp } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const userId = user._id;

      const result = await OtpService.verifyOtp(userId, type, enteredOtp);

      if (!result.status) {
        return next(new AppError(result.message, 400));
      }

      const resetToken = await resetTokenServices.generateResetToken(userId);

      res.json({ message: result.message, resetToken });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { resetToken, newPassword } = req.body;

      const record = await resetTokenServices.verifyResetToken(resetToken);

      if (!record) {
        return next(new AppError("Invalid or expired reset token", 400));
      }

      await UserService.updatePassword(record.userId, newPassword);

      await resetTokenServices.consumeToken(resetToken);

      res.json({ message: "Password reset successful" });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }

}

export default new AuthController();

