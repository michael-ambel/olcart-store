import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import * as cookie from "cookie";

const BASE_URL = "http://localhost:5000/api/orders";

// Utility Functions
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

// Get a Specific Order by ID (GET /:orderId)
export async function GET_ORDER(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = getAuthToken(req);
    const { orderId } = params;
    const response = await axios.get(`${BASE_URL}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}

// Update Order Status (Admin only) (PUT /:orderId)
export async function PUT(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = getAuthToken(req);
    const { orderId } = params;
    const { status } = await req.json();
    const response = await axios.put(
      `${BASE_URL}/${orderId}`,
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

// Delete an Order (Admin only) (DELETE /:orderId)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const token = getAuthToken(req);
    const { orderId } = params;
    const response = await axios.delete(`${BASE_URL}/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    return handleApiError(error);
  }
}
