import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import indexRoutes from "./routes/indexRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

connectDB();

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
}));

app.get("/", (req, res) => {
  res.send("its..... Good to go!");
});

app.use("/", indexRoutes);

app.listen(PORT, () => {    
    console.log(`Server is running on http://localhost:${PORT}`);
});