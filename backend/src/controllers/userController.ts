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

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
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

    const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
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

//update cart
export const updateCart: RequestHandler = async (req, res) => {
  try {
    const { _id, quantity } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const product = await Product.findById(_id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (!user.cart) {
      user.cart = [];
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item._id.toString() === _id
    );

    if (cartItemIndex !== -1) {
      if (quantity === 0) {
        // Remove item if quantity is 0
        user.cart.splice(cartItemIndex, 1);
      } else {
        // Update item quantity
        user.cart[cartItemIndex].quantity = quantity;
      }
    } else if (quantity > 0) {
      // Add new item if quantity > 0
      const { price, shippingPrice } = product;
      user.cart.push({ _id, quantity, price, shippingPrice });
    }

    await user.save();

    // Return the updated cart to the client
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
