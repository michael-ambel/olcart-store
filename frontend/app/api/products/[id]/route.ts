import { NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

// Base URL for products
const BASE_URL = `${process.env["SERVER_URL"]}/products`;

// Utility: Extract auth token from cookies
function getAuthToken(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies["jwt"];

  if (!token) {
    throw new Error("Authentication error: please log in again");
  }

  return token;
}

// Utility: Handle API errors
function handleApiError(error: unknown) {
  const message =
    axios.isAxiosError(error) && error.response
      ? error.response.data
      : (error as Error).message;

  return NextResponse.json({ message }, { status: 500 });
}

// Get a Specific Product by ID (GET /:id)
export async function GET(req: Request) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const token = getAuthToken(req);
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update Product (PUT /api/products/:id)
export async function PUT(req: Request) {
  try {
    // Extract product ID from URL path
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    // Authentication check
    const cookies = cookie.parse(req.headers.get("cookie") || "");
    const token = cookies["jwt"];

    if (!token) {
      return NextResponse.json(
        { message: "Authentication error: please log in again" },
        { status: 401 },
      );
    }

    // Ensure request is multipart/form-data
    const contentType = req.headers.get("Content-Type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Content type must be multipart/form-data" },
        { status: 400 },
      );
    }

    // Use the original form data directly
    const formData = await req.formData();

    // Send updated product data to backend
    const resp = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;

    console.error(message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

// Delete a Product (DELETE /:id)
export async function DELETE(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const token = getAuthToken(req);
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
