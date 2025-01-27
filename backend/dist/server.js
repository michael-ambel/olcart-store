"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const db_1 = __importDefault(require("./config/db"));
require("./types/express");
const body_parser_1 = __importDefault(require("body-parser"));
const orderController_1 = require("./controllers/orderController");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ["https://olcart.store"], // Allow your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
app.post("/api/orders/payment-webhook", body_parser_1.default.raw({ type: "application/json" }), orderController_1.handlePaymentWebhook);
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static("uploads"));
// MongoDB connection
(0, db_1.default)();
// Routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = app;
