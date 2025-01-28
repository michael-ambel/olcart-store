import { NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

// Base URL for orders
const BASE_URL = `${process.env.SERVER_URL}/products`;

// Utility: Extract auth token from cookies
function getAuthToken(req: Request) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.jwt;

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

  console.log(message);
  return NextResponse.json({ message }, { status: 500 });
}

// Get a Specific Order by ID (GET /:id)
export async function GET(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  console.log(id);

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
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

// Update Order Status (Admin only) (PUT /:id)
export async function PUT(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    const token = getAuthToken(req);
    const { status } = await req.json();
    const response = await axios.put(
      `${BASE_URL}/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete an Order (Admin only) (DELETE /:id)
export async function DELETE(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
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
