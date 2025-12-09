import express from "express";
import AuthController from "../controllers/authController.js";
import createRateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

// Rate Limiters
const loginLimiter = createRateLimiter(60 * 1000, 5, "Too many login attempts.");
const otpLimiter   = createRateLimiter(60 * 1000, 3, "Too many OTP requests.");

router.post("/login", loginLimiter, AuthController.login);
router.post("/signup", AuthController.signup);
router.post("/google", AuthController.google);
router.post("/forgot-password", otpLimiter, AuthController.forgotPasswordRequest);
router.post("/verify-otp", otpLimiter, AuthController.verifyOtp);

export default router;
