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
exports.updatePreferences = exports.deleteShippingAddress = exports.getShippingAddresses = exports.updateShippingAddress = exports.addShippingAddress = exports.getCartItems = exports.updateCart = exports.getUser = exports.getUsers = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
const productModel_1 = __importDefault(require("../models/productModel"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        const user = yield userModel_1.default.create({ name, email, password, role });
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: maxAge,
        });
        res
            .cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: maxAge,
        })
            .status(201)
            .json({
            user: {
                name: user.name,
                _id: user._id,
                email: user.email,
                role: user.role,
            },
        });
        return;
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: maxAge,
        });
        res
            .cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //strict
            maxAge: maxAge,
        })
            .status(200)
            .json({
            user: {
                name: user.name,
                _id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res
            .cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .status(200)
            .json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.logoutUser = logoutUser;
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
//update cart
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { _id, quantity } = req.body;
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const product = yield productModel_1.default.findById(_id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (!user.cart) {
            user.cart = [];
        }
        const cartItemIndex = user.cart.findIndex((item) => item._id.equals(_id));
        let message = "";
        if (cartItemIndex !== -1) {
            if (quantity === 0) {
                user.cart.splice(cartItemIndex, 1);
                message = "Item removed";
            }
            else if (quantity > 0) {
                user.cart[cartItemIndex].quantity = quantity;
                message = "Item updated";
            }
        }
        else {
            user.cart.push({
                _id,
                quantity,
                price: product.price,
                shippingPrice: product.shippingPrice,
                checked: true,
            });
            message = "Item added";
        }
        yield user.save();
        // Return the updated cart to the client
        res.status(200).json({ cart: user.cart, message });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});
exports.updateCart = updateCart;
//getCartItems
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user.cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getCartItems = getCartItems;
// Add a new shipping address
const addShippingAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, phone, address, city, postalCode, country, isDefault } = req.body;
        if (!name || !phone || !address || !city || !postalCode || !country) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (isDefault) {
            user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
        }
        user.shippingAddresses.push({
            name,
            phone,
            address,
            city,
            postalCode,
            country,
            isDefault,
        });
        yield user.save();
        res.status(201).json({
            message: "Address added successfully",
            addresses: user.shippingAddresses,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.addShippingAddress = addShippingAddress;
// Update a shipping address
const updateShippingAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { _id, name, phone, address, city, postalCode, country, isDefault } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const addressIndex = user.shippingAddresses.findIndex((addr) => { var _a; return (_a = addr._id) === null || _a === void 0 ? void 0 : _a.equals(_id); });
        if (addressIndex === -1) {
            res.status(404).json({ message: "Address not found" });
            return;
        }
        const updatedAddress = user.shippingAddresses[addressIndex];
        if (name)
            updatedAddress.name = name;
        if (phone)
            updatedAddress.phone = phone;
        if (address)
            updatedAddress.address = address;
        if (city)
            updatedAddress.city = city;
        if (postalCode)
            updatedAddress.postalCode = postalCode;
        if (country)
            updatedAddress.country = country;
        if (isDefault) {
            user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
            updatedAddress.isDefault = true;
        }
        yield user.save();
        res.status(200).json({
            message: "Address updated successfully",
            addresses: user.shippingAddresses,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updateShippingAddress = updateShippingAddress;
// Get all shipping addresses
const getShippingAddresses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield userModel_1.default.findById(userId).select("shippingAddresses");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Sort the addresses so that the default address comes first
        const sortedAddresses = user.shippingAddresses.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        res.status(200).json(sortedAddresses);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getShippingAddresses = getShippingAddresses;
// Delete a shipping address
const deleteShippingAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { _id } = req.body;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.shippingAddresses = user.shippingAddresses.filter((addr) => { var _a; return !((_a = addr._id) === null || _a === void 0 ? void 0 : _a.equals(_id)); });
        // Ensure at least one address remains default if there are addresses left
        if (user.shippingAddresses.length > 0 &&
            !user.shippingAddresses.some((addr) => addr.isDefault)) {
            user.shippingAddresses[0].isDefault = true;
        }
        yield user.save();
        res.status(200).json({
            message: "Address deleted successfully",
            addresses: user.shippingAddresses,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deleteShippingAddress = deleteShippingAddress;
// Update preferences
const updatePreferences = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { preferences } = req.body; // preferences is expected to be an array of strings (tags, categories, etc.)
        const user = yield userModel_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Update preferences
        user.preferences = preferences;
        yield user.save();
        res.status(200).json({
            message: "Preferences updated successfully",
            preferences: user.preferences,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.updatePreferences = updatePreferences;
