"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post("/", orderController_1.placeOrder);
router.get("/user/:userId", orderController_1.userOrders);
router.get("/", orderController_1.allOrders);
router.get("/:orderId", orderController_1.getOrder);
router.delete("/:orderId", orderController_1.deleteOrder);
exports.default = router;
