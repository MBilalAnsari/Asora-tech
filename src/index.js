import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import indexRoutes from "./routes/indexRoutes.js";
import connectDB from "./config/db.js";
import errorHandler from "../src/middleware/errorHandler.js"
import mongoDbSanitize from "express-mongo-sanitize";
import xss from "xss";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

// app.use(mongoDbSanitize({
//   // allowDots: true,
//   // replaceWith: "_"
// }));

connectDB();

app.use(rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
}));

// app.use((req, res, next) => {
//   if (req.body) {
//     for (let key in req.body) {
//       if (typeof req.body[key] === "string") {
//         req.body[key] = xss(req.body[key]);
//       }
//     }
//   } else {
//     error.message = "No request body found";
//     return res.status(400).json({ message: error.message });
//   }
//   next();
// });

app.get("/", (req, res) => {
  res.send("its..... Good to go!");
});

app.use("/", indexRoutes);  
app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 