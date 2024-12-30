// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import connectDB from "./config/db";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// app.use(notFound);
// app.use(errorHandler);

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
