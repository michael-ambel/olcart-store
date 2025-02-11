// app/api/products/topselling-rated/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env["SERVER_URL"]}/products/topselling-rated`;

// Error handling function
function handleApiError(error: unknown) {
  const message =
    axios.isAxiosError(error) && error.response
      ? error.response.data
      : (error as Error).message;
  console.log(message);
  return NextResponse.json({ message }, { status: 500 });
}

// GET request handler for fetching top-selling and top-rated products
export async function GET() {
  try {
    const response = await axios.get(BASE_URL);

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error); // Handle any errors that occur
  }
}
