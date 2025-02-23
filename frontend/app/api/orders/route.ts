import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = `${process.env["SERVER_URL"]}/orders`;

// Utility Functions
function getAuthToken(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies["jwt"];

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

// Place an Order (POST)
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const orderData = await req.json();
    const response = await axios.post(BASE_URL, orderData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Get All Orders (Admin only)
export async function GET(req: NextRequest) {
  try {
    console.log("get order request");
    const token = getAuthToken(req);
    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
