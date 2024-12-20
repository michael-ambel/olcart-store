// Import Axios
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/users/register";

// register user
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resp = await axios.post(BASE_URL, req.body);
    res.status(resp.status).json(resp.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
