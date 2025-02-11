import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const REVIEWS_URL = `${process.env["SERVER_URL"]}/products/reviews`;

// Function to get the auth token from cookies
function getAuthToken(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies["jwt"];
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

// POST request handler for Create/Update Review
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();
    console.log(body);
    const response = await axios.post(REVIEWS_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
