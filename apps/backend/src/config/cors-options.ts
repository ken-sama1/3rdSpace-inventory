import { type CorsOptions } from "cors";
import { ALLOWED_ORIGINS } from "./const.js";

const origin: CorsOptions["origin"] = (
  reqFrom: string | undefined,
  callback
) => {
  if (!reqFrom) return callback(null, true);

  if (ALLOWED_ORIGINS.includes(reqFrom)) {
    return callback(null, true);
  }

  callback(new Error("Blocked by CORS policy: This origin is unauthorized"));
};

export const corsOptions: CorsOptions = {
  origin,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};
