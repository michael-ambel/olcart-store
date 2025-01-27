"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const ProtectMiddleware_1 = require("../utils/ProtectMiddleware");
const userController_2 = require("../controllers/userController");
const router = express_1.default.Router();
router.post("/register", userController_1.registerUser);
router.post("/login", userController_1.loginUser);
router.post("/logout", userController_1.logoutUser);
router.get("/cart", ProtectMiddleware_1.protectCustomer, userController_2.getCartItems);
router.get("/", userController_1.getUsers);
router.patch("/cart", ProtectMiddleware_1.protectCustomer, userController_1.updateCart);
router.get("/shipping-address", ProtectMiddleware_1.protectCustomer, userController_1.getShippingAddresses);
router.post("/shipping-address", ProtectMiddleware_1.protectCustomer, userController_1.addShippingAddress);
router.patch("/shipping-address", ProtectMiddleware_1.protectCustomer, userController_1.updateShippingAddress);
router.delete("/shipping-address", ProtectMiddleware_1.protectCustomer, userController_1.deleteShippingAddress);
router.get("/:id", userController_1.getUser);
exports.default = router;
