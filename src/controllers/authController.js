import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    console.log("Creating user:", { username, email, phone });

    
  
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });


    const hashed = await bcrypt.hash(password, 10);

     // Generate JWT token
    const token = generateToken(user._id);

    // Create user
    const user = await User.create({ username, email, phone, password: hashed });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
   
    const user = await User.findOne({ email });
    console.log("Logging in user:", email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
