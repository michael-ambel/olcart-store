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
exports.getAllCategory = exports.addNewCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
// Create a new category
const addNewCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield categoryModel_1.default.create(req.body);
        res.status(201).json(category);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.addNewCategory = addNewCategory;
// Get all categories
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryModel_1.default.find();
        res.status(200).json(categories);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllCategory = getAllCategory;
