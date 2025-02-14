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
import axios from "axios";

const PING_INTERVAL = 14 * 60 * 1000;

dotenv.config();

const app = express();

// Middleware

const url = process.env.CLIENT_URL;
app.use(
  cors({
    origin: url,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
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
app.get("/api/ping", (req, res) => {
  res.send("Server is alive!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

setInterval(async () => {
  try {
    await axios.get("https://olcart-store.onrender.com/api/ping");
    console.log("Self-pinged to stay awake!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Ping failed:", error.message);
    } else {
      console.error("Ping failed:", error);
    }
  }
}, PING_INTERVAL);

export default app;
