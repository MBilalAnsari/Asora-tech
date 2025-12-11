import express from "express";
import AuthController from "../controllers/authController.js";
import createRateLimiter from "../middleware/rateLimiter.js";
import validationMiddleware, { signupSchema, loginSchema, forgotPasswordSchema, verifyOtpSchema, resetPasswordSchema } from '../validations/joiValidation.js';

const router = express.Router();

// Rate Limiters
const loginLimiter = createRateLimiter(60 * 1000, 5, "Too many login attempts.");
const otpLimiter = createRateLimiter(60 * 1000, 3, "Too many OTP requests.");
const resetPasswordLimiter = createRateLimiter(15 * 60 * 1000, 5, "Too many password reset attempts.");

router.post("/google", AuthController.google);
router.post("/signup", validationMiddleware(signupSchema), AuthController.signup);
router.post("/login", loginLimiter, validationMiddleware(loginSchema), AuthController.login);
router.post("/verify-otp", otpLimiter, validationMiddleware(verifyOtpSchema), AuthController.verifyOtp);
router.post("/forgot-password", otpLimiter, validationMiddleware(forgotPasswordSchema), AuthController.forgotPasswordRequest);
router.post("/reset-password", resetPasswordLimiter, validationMiddleware(resetPasswordSchema), AuthController.resetPassword);

export default router;
