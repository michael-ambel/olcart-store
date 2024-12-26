import { RequestHandler } from "express";

import User from "../models/userModel";

// Register a new user
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

// Login user
export const loginUser: RequestHandler = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json(user);
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
