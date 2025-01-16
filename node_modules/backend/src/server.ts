import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import connectDB from "./config/db";
import "./types/express";

import bodyParser from "body-parser";
import { handlePaymentWebhook } from "./controllers/orderController";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.post(
  "/api/orders/payment-webhook",
  bodyParser.raw({ type: "application/json" }),
  handlePaymentWebhook
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// MongoDB connection
connectDB();

// Routes

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
