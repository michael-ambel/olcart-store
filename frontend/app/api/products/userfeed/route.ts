// app/api/products/user/feed/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = `${process.env["SERVER_URL"]}/products/userfeed`;

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
  console.log(message);
  return NextResponse.json({ message }, { status: 500 });
}

// GET request handler for fetching user feed with pagination
export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req); // Extract token from cookies

    // Extract query parameters (page and limit)
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Send GET request to the backend
    const response = await axios.get(BASE_URL, {
      params: { page, limit },
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
