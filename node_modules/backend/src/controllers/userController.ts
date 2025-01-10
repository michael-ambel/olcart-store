import { Request, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User, { ICartItem } from "../models/userModel";
import dotenv, { config } from "dotenv";
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

    const cartItemIndex = user.cart.findIndex((item) => item._id === _id);

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
      user.cart.push({
        _id,
        quantity,
        price: product.price,
        shippingPrice: product.shippingPrice,
        checked: true,
      });
    }

    await user.save();

    // Return the updated cart to the client
    res.status(200).json(user.cart);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: (err as Error).message });
  }
};

//getCartItems
export const getCartItems: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Add a new shipping address
export const addShippingAddress: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { name, phone, address, city, postalCode, country, isDefault } =
      req.body;

    if (!name || !phone || !address || !city || !postalCode || !country) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findById(userId);
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

    await user.save();
    res.status(201).json({
      message: "Address added successfully",
      addresses: user.shippingAddresses,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a shipping address
export const updateShippingAddress: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { _id, name, phone, address, city, postalCode, country, isDefault } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const addressIndex = user.shippingAddresses.findIndex((addr) =>
      addr._id?.equals(_id)
    );
    if (addressIndex === -1) {
      res.status(404).json({ message: "Address not found" });
      return;
    }

    const updatedAddress = user.shippingAddresses[addressIndex];
    if (name) updatedAddress.name = name;
    if (phone) updatedAddress.phone = phone;
    if (address) updatedAddress.address = address;
    if (city) updatedAddress.city = city;
    if (postalCode) updatedAddress.postalCode = postalCode;
    if (country) updatedAddress.country = country;

    if (isDefault) {
      user.shippingAddresses.forEach((addr) => (addr.isDefault = false));
      updatedAddress.isDefault = true;
    }

    await user.save();
    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.shippingAddresses,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get all shipping addresses
export const getShippingAddresses: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("shippingAddresses");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Sort the addresses so that the default address comes first
    const sortedAddresses = user.shippingAddresses.sort(
      (a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
    );

    res.status(200).json(sortedAddresses);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a shipping address
export const deleteShippingAddress: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { _id } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    user.shippingAddresses = user.shippingAddresses.filter(
      (addr) => !addr._id?.equals(_id)
    );

    // Ensure at least one address remains default if there are addresses left
    if (
      user.shippingAddresses.length > 0 &&
      !user.shippingAddresses.some((addr) => addr.isDefault)
    ) {
      user.shippingAddresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.shippingAddresses,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
