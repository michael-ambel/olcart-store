import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/products";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const resp = await axios.get(`${BASE_URL}/${id}`);
        return res.status(resp.status).json(resp.data);
      }

      case "PUT": {
        const resp = await axios.put(`${BASE_URL}/${id}`, req.body, {
          headers: { "Content-Type": "application/json" },
        });
        return res.status(resp.status).json(resp.data);
      }
      case "DELETE": {
        const resp = await axios.delete(`${BASE_URL}/${id}`);
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
