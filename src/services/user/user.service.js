import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import AppError from "../../utils/AppError.js";

class UserService {
  async signup(userData) {
    const { fullName, email, phone, password, brokerNumber } = userData;

    // Check all credentials in one query
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phone },
        // { emiratesId },
        { brokerNumber }
      ]
    });

    if (existingUser) {
      // Generic error for email and phone
      if (existingUser.email === email || existingUser.phone === phone) {
        throw new AppError("Credentials already exists", 409);
      }

      // if (existingUser.emiratesId === emiratesId) {
      //   throw new Error("Emirates ID already exists");
      // }
      if (existingUser.brokerNumber === brokerNumber) {
        throw new AppError("Broker number already exists", 409);
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      // emiratesId,
      brokerNumber
    });

    const token = generateToken(user._id);

    return { user, token };
  }

  async login(credentials) {
    const { email, password } = credentials;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Incorrect password", 401);
    }

    const token = generateToken(user._id);

    return { user, token };
  }

  async googleAuth(idToken) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const { sub: googleId, email, name, picture } = payload;

      let user = await User.findOne({ email });

      if (!user) {
        // Auto signup
        user = await User.create({
          fullName: name,
          email,
          googleId,
          picture,
          isGoogleUser: true,
          password: null,
        });
      }

      const token = generateToken(user._id);

      return { user, token };
    } catch (error) {
      console.error("Error verifying Google ID token:", error);
      throw new AppError("Invalid Google ID token", 401);
    }
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
  }
}

export default new UserService();
