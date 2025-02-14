// pages/api/search.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env["SERVER_URL"]}/products/search`;

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
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
