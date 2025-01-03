import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { ICartItem } from "../models/userModel";
import dotenv from "dotenv";
import Product from "../models/productModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Register a new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
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
        user: { id: user._id, email: user.email, role: user.role },
      });
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Login user
export const loginUser: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
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
        user: { id: user._id, email: user.email, role: user.role },
      });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const logoutUser: RequestHandler = async (req, res) => {
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
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get users
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get user by ID
export const getUser: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Add Cart Item
export const addCartItem: RequestHandler = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.cart) {
      user.cart = [];
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const { price, shippingPrice } = product;
    user.cart.push({ product: productId, quantity, price, shippingPrice });
    await user.save();

    res.status(201).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update or Remove Cart Item
export const updateOrRemoveCartItem: RequestHandler = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.cart || user.cart.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    if (quantity > 0) {
      user.cart[cartItemIndex].quantity = quantity;
    } else {
      user.cart.splice(cartItemIndex, 1);
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
