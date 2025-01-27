"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const ProtectMiddleware_1 = require("../utils/ProtectMiddleware");
const router = express_1.default.Router();
router.post("/", ProtectMiddleware_1.protectCustomer, orderController_1.placeOrder);
router.post("/summary", orderController_1.getOrderSummary);
router.get("/user", ProtectMiddleware_1.protectCustomer, orderController_1.userOrders);
router.get("/", orderController_1.allOrders);
router.post("/payment-session", ProtectMiddleware_1.protectCustomer, orderController_1.createPaymentSession);
router.get("/user/processing", ProtectMiddleware_1.protectCustomer, orderController_1.getUserProcessingOrders);
router.get("/user/processed", ProtectMiddleware_1.protectCustomer, orderController_1.getUserProcessedOrders);
// router.post("/payment-webhook", handlePaymentWebhook);
router.get("/:orderId", orderController_1.getOrder);
router.delete("/:orderId", orderController_1.deleteOrder);
exports.default = router;
