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
    // Check if the request is multipart/form-data
    const contentType = req.headers.get("Content-Type");
    if (contentType && contentType.includes("multipart/form-data")) {
      // If it is, create a FormData object to send the request as multipart
      const formData = new FormData();

      // Convert the incoming request body into FormData
      const body = await req.formData(); // formData() parses the multipart/form-data request
      console.log(body);

      // Append each form field to the FormData object
      body.forEach((value, key) => {
        if (key === "images") {
          // Handle file(s)
          // Check if the value is an array of File objects (not FileList)
          if (Array.isArray(value)) {
            value.forEach((file) => {
              formData.append("images", file); // Append each file
            });
          } else {
            // Handle single file upload (in case of just one file being sent)
            formData.append("images", value);
          }
        } else {
          // Handle other fields (e.g., name, description, price, etc.)
          formData.append(key, value as string);
        }
      });

      // Send the formData to the backend server (Express server)
      const resp = await axios.post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is set
        },
      });

      return NextResponse.json(resp.data, { status: resp.status });
    } else {
      // If content is not multipart/form-data, return an error
      return NextResponse.json(
        { message: "Content type must be multipart/form-data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log(error);
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
