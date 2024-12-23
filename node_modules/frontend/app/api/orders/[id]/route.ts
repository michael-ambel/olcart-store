import { NextResponse } from "next/server";
import axios from "axios";

//..get order by id
export async function GET(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  try {
    const resp = await axios.get(`http://localhost:5000/api/orders/${id}`);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

//delete order
export async function DELETE(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  try {
    const resp = await axios.delete(`http://localhost:5000/api/orders/${id}`);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
