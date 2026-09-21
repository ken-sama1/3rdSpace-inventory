import { type CorsOptions } from "cors";
import { ALLOWED_ORIGINS } from "../constants.js";
import { AppError } from "../errors/AppError.js";

const origin: CorsOptions["origin"] = (
  reqFrom: string | undefined,
  callback
) => {
  if (!reqFrom) return callback(null, true);

  if (ALLOWED_ORIGINS.includes(reqFrom)) {
    return callback(null, true);
  }

  callback(
    new AppError({
      code: "UNAUTHORIZED_ERROR",
      message: "Blocked by CORS policy: This origin is unauthorized",
    })
  );
};

export const corsOptions: CorsOptions = {
  origin,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};
