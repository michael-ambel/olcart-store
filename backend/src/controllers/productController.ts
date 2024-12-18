import { RequestHandler } from "express";
import Product from "../models/productModel";

// Create a product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all products
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
    return;
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Get a single product
export const getProduct: RequestHandler = async (req, res): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Update a product
export const updateProduct: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

// Delete a product
export const deleteProduct: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
