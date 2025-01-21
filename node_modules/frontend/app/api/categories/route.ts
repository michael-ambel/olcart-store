import { NextResponse } from "next/server";
import axios from "axios";
import { Category } from "@/store/types/categoryTypes";

const BASE_URL = "http://localhost:5000/api/categories";

// Utility function to create category tree
const createCategoryTree = (categories: Category[]) => {
  const categoryMap: Record<string, any> = {};
  const tree: Record<string, any>[] = [];

  // Map categories by ID and initialize subCategories
  categories.forEach((category) => {
    categoryMap[category._id] = { ...category, subCategories: [] };
  });

  // Build tree structure
  categories.forEach((category) => {
    if (category.parentCategory) {
      const parent = categoryMap[category.parentCategory];
      if (parent) {
        parent.subCategories.push(categoryMap[category._id]);
      }
    } else {
      tree.push(categoryMap[category._id]);
    }
  });

  return tree;
};

//..get all categories
export async function GET() {
  try {
    const response = await fetch(BASE_URL, {
      cache: "force-cache",
      next: { revalidate: 100 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();

    const categoryTree = createCategoryTree(categories);

    return NextResponse.json(categoryTree, { status: 200 });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

//..add new category
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resp = await axios.post(BASE_URL, body);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
