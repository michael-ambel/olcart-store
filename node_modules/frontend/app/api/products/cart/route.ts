import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = `${process.env.SERVER_URL}/products/cart`;

// Function to get the auth token from cookies
function getAuthToken(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.jwt;
  if (!token) {
    throw new Error("Authentication error: please log in again");
  }
  return token;
}

// Error handling function
function handleApiError(error: unknown) {
  const message =
    axios.isAxiosError(error) && error.response
      ? error.response.data
      : (error as Error).message;
  return NextResponse.json({ message }, { status: 500 });
}

// POST request handler for fetching carted product details
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req); // Extract token from cookies
    const body = await req.json(); // Parse request body (should contain product IDs)

    // Send POST request to the backend
    const response = await axios.post(BASE_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Return the response data to the frontend
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error); // Handle any errors that occur
  }
}
