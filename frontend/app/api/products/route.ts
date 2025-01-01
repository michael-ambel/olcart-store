import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export async function GET() {
  try {
    const resp = await axios.get(BASE_URL);
    return NextResponse.json(resp.data, { status: resp.status });
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("Content-Type");
    if (contentType && contentType.includes("multipart/form-data")) {
      const formData = new FormData();

      const body = await req.formData();

      body.forEach((value, key) => {
        if (key === "images") {
          if (Array.isArray(value)) {
            value.forEach((file) => {
              formData.append("images", file);
            });
          } else {
            // Handle single file upload (in case of just one file being sent)
            formData.append("images", value);
          }
        } else {
          formData.append(key, value as string);
        }
      });

      const resp = await axios.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is set
        },
      });

      return NextResponse.json(resp.data, { status: resp.status });
    } else {
      return NextResponse.json(
        { message: "Content type must be multipart/form-data" },
        { status: 400 }
      );
    }
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
