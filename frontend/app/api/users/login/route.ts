import { NextResponse } from "next/server";
import axios from "axios";
import { headers } from "next/headers";

const BASE_URL = "http://localhost:5000/api/users/login";

export async function POST(req: Request) {
  try {
    const body = req.json();
    const resp = await axios.post(BASE_URL, body, {
      headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
