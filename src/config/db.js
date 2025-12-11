import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error(" MONGO_URI is not defined in environment variables");
    console.log(" Make sure to set MONGO_URI in your .env file for local development");
    console.log(" For Vercel, set it in your project's environment variables");
    process.exit(1);
}

const connectDB = async () => {
    try {
        console.log(" Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(" MongoDB connected successfully");
    } catch (error) {
        console.error(" MongoDB connection error:", error.message);
        console.log(" Make sure your MongoDB server is running and accessible");
        console.log(" Check if your connection string is correct and includes proper authentication");
        process.exit(1);
    }
};

export default connectDB;