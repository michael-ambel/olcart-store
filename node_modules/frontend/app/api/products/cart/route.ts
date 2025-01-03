import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = "http://localhost:5000/api/products/cart";

function getAuthToken(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.jwt;
  if (!token) {
    throw new Error("Authentication error: please log in again");
  }
  return token;
}

function handleApiError(error: unknown) {
  const message =
    axios.isAxiosError(error) && error.response
      ? error.response.data
      : (error as Error).message;
  return NextResponse.json({ message }, { status: 500 });
}

// Add carted item
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const response = await axios.post(BASE_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update or remove carted item
export async function PATCH(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    const response = await axios.patch(BASE_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
