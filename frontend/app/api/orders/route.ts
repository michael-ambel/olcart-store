import { NextResponse } from "next/server";
import axios from "axios";

//..place orders
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const resp = await axios.post("http://localhost:5000/api/orders", body);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

//..get all orders
export async function GET() {
  try {
    const resp = await axios.get("http://localhost:5000/api/orders");
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
