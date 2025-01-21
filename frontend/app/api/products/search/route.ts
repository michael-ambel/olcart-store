// pages/api/search.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = "http://localhost:5000/api/products/search"; // Adjust this URL to your backend API endpoint

// Function to get JWT token from cookies
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
  console.log(message);
  return NextResponse.json({ message }, { status: 500 });
}

// Handle GET request to fetch search results
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("query") || "";
    const category = url.searchParams.get("category") || "";
    const priceMin = parseFloat(url.searchParams.get("priceMin") || "0");
    const priceMax = parseFloat(
      url.searchParams.get("priceMax") || "1000000000000"
    );
    const tags = url.searchParams.get("tags") || "";
    const sort = url.searchParams.get("sort") || "relevance";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const token = getAuthToken(req);
    console.log({
      query: searchQuery,
      category,
      priceMin,
      priceMax,
      tags,
      sort,
      page,
      limit,
    });

    console.log({
      query: searchQuery,
      category,
      priceMin,
      priceMax,
      tags,
      sort,
      page,
      limit,
    });

    const response = await axios.get(BASE_URL, {
      params: {
        query: searchQuery,
        category,
        priceMin,
        priceMax,
        tags,
        sort,
        page,
        limit,
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Handle POST request (for creating/updating products, if needed)
export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req);
    const body = await req.json();

    // Send POST request to the backend API
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
