import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users/logout";

export async function POST(req: Request) {
  try {
    const resp = await axios.post(BASE_URL, null, { withCredentials: true });
    const token = resp.headers["set-cookie"];

    const response = NextResponse.json(resp.data, { status: resp.status });

    if (token) {
      response.headers.set("Set-Cookie", token.join(";"));
    }

    return response;
  } catch (error) {
    console.log(error);
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
