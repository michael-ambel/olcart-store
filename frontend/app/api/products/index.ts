import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET": {
        const resp = await axios.get(BASE_URL);
        return res.status(resp.status).json(resp.data);
      }

      case "POST": {
        const resp = await axios.post(BASE_URL, req.body, {
          headers: { "Content-Type": "application/json" },
        });
        return res.status(resp.status).json(resp.data);
      }

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    const message =
      axios.isAxiosError(error) && error.response
        ? error.response.data
        : (error as Error).message;
    return res.status(500).json({ message });
  }
}
