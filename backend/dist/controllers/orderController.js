"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.allOrders = exports.getOrder = exports.userOrders = exports.placeOrder = void 0;
const orderModel_1 = __importDefault(require("../models/orderModel"));
// Place a new order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield orderModel_1.default.create(req.body);
        res.status(201).json(order);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.placeOrder = placeOrder;
// Get orders for a specific user
const userOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find({ user: req.params.userId });
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.userOrders = userOrders;
// Get order
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find({ _id: req.params.orderId });
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getOrder = getOrder;
// Get all orders
const allOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.find();
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.allOrders = allOrders;
// Delete order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderModel_1.default.findOneAndDelete({ _id: req.params.orderId });
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteOrder = deleteOrder;
