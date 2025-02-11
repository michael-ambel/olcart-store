// Login API route
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env["SERVER_URL"]}/users/login`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const resp = await axios.post(BASE_URL, body, { withCredentials: true });

    const token = resp.headers["set-cookie"];

    const response = NextResponse.json(resp.data, { status: resp.status });

    if (token) {
      response.headers.set("Set-Cookie", token.join("; "));
    }

    return response;
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
