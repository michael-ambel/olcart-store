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
exports.getUser = exports.getUsers = exports.loginUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const user = yield userModel_1.default.create({ name, email, password, role });
        res.status(201).json(user);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        }
        else {
            res.status(400).json({ error: "An unknown error occurred" });
        }
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.loginUser = loginUser;
// Get users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.find();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUsers = getUsers;
// Get user by ID
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUser = getUser;
