import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.SERVER_URL}/users`;

// get all users
export async function GET() {
  try {
    const resp = await axios.get(BASE_URL);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    console.error(error);
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
