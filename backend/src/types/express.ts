// src/types/express.d.ts
import { DecodeTocken } from "../utils/ProtectMiddleware"; // Correct path to your type

declare global {
  namespace Express {
    interface Request {
      user?: DecodeTocken;
      cloudinaryUrls?: Array<{ url: string; publicId: string }>;
    }
  }
}
