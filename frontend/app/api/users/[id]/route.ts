import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = `${process.env["SERVER_URL"]}/users`;

//..get user
export async function GET(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Valid Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const resp = await axios.get(`${BASE_URL}/${id}`);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;

    return NextResponse.json({ message }, { status: 500 });
  }
}

//... update user
export async function PUT(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Valid Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const resp = await axios.put(`${BASE_URL}/${id}`, req.body);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;

    return NextResponse.json({ message }, { status: 500 });
  }
}

//..delete user

export async function DELETE(req: Request) {
  const urlParts = req.url.split("/");
  const id = urlParts[urlParts.length - 1];

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { message: "Valid Product ID is required" },
      { status: 400 },
    );
  }

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
