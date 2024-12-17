import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import { errorHandler, notFound } from "./middleware/errorMiddleware";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

app.use(notFound);
app.use(errorHandler);

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
