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
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorMiddleware_1 = __importDefault(require("./errorMiddleware"));
const userModel_1 = __importDefault(require("../models/userModel"));
// Protect Route Middleware
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Extract token from headers
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new errorMiddleware_1.default("Not authorized, no token", 401));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Fetch user from database, excluding password
        req.user = yield userModel_1.default.findById(decoded.id).select("-password");
        if (!req.user) {
            return next(new errorMiddleware_1.default("User not found", 404));
        }
        next();
    }
    catch (error) {
        return next(new errorMiddleware_1.default("Not authorized, token failed", 401));
    }
});
exports.protect = protect;
