import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env.SERVER_URL}/categories`;

//..update category
export async function PUT(req: Request) {
  const urlPrts = req.url.split("/");
  const id = urlPrts[urlPrts.length - 1];

  const body = req.json();

  try {
    const resp = await axios.put(`${BASE_URL}/${id}`, body);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

//..delete category
export async function DELETE(req: Request) {
  const urlPrts = req.url.split("/");
  const id = urlPrts[urlPrts.length - 1];

  try {
    const resp = await axios.delete(`${BASE_URL}/${id}`);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
