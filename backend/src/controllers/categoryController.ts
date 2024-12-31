import { RequestHandler } from "express";
import Category from "../models/categoryModel";

// Create a new category
export const addNewCategory: RequestHandler = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all categories
export const getAllCategory: RequestHandler = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};
