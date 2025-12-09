import UserService from "../services/UserService.js";
import OtpService from "../services/otpService.js";
import User from "../models/User.js";
import resetTokenServices from "../services/resetTokenServices.js";

class AuthController {
  async signup(req, res) {
    try {
      const { user, token } = await UserService.signup(req.body);
      res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { user, token } = await UserService.login(req.body);
      res.json({ message: "Login successful", token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async google(req, res) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ message: "idToken is required" });
      }

      const { user, token } = await UserService.googleAuth(idToken);

      res.json({ message: "Google login successful", token, user });

    } catch (error) {
      res.status(500).json({ message: "Google authentication failed", error: error.message });
    }
  }

  async forgotPasswordRequest(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { otpCode, newOtp } = await OtpService.createNewOtp(
        user._id,
        'PASSWORD_RESET'
      );

      await emailService.sendOtpEmail(email, otpCode);

      res.json({
        message: "OTP Sent Successfully.",
        otpCode,
        newOtp: newOtp.otpCode // For testing purpose only
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async verifyOtp(req, res) {
    try {
      const { userId, type, enteredOtp } = req.body;
      const result = await OtpService.verifyOtp(userId, type, enteredOtp);

      if (!result.status) {
        return res.status(400).json({ message: result.message });
      }
      const resetToken = await resetTokenServices.generateResetToken(userId);

      res.json({ message: result.message, resetToken });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } 
}

export default new AuthController();

