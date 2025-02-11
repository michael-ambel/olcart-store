import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env["SERVER_URL"]}/users/logout`;

export async function POST() {
  try {
    const resp = await axios.post(BASE_URL, null, { withCredentials: true });
    const token = resp.headers["set-cookie"];

    const response = NextResponse.json(resp.data, { status: resp.status });

    if (token) {
      response.headers.set("Set-Cookie", token.join(";"));
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
