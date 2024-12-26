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
exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getProducts = exports.createProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
// Create a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.create(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_1.default.find();
        res.status(200).json(products);
        return;
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProducts = getProducts;
// Get a single product
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getProduct = getProduct;
// Update a product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json(product);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield productModel_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product deleted" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteProduct = deleteProduct;
