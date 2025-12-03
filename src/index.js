import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cors());

connectDB();

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
}));

app.get("/", (req, res) => {
  res.send("its..... Good to go!");
});

app.use("/api", authRoutes);

app.listen(PORT, "0.0.0.0" , () => {    
    console.log(`Server is running on http://localhost:${PORT}`);
});