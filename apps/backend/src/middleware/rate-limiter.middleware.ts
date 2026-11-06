import { API_ERROR_CODE_TO_MESSAGE } from "@repo/shared";
import rateLimit from "express-rate-limit";
import { AppError } from "../errors/AppError.js";

const baseConfig = {
  legacyHeaders: false,
  standardHeaders: true,
  ipv6Subnet: 48,
  message: "Too many requests. Please wait a few minutes before trying again",
};

export const authLimiter = rateLimit({
  ...baseConfig,
  windowMs: 3 * 60 * 1000,
  limit: 10,
  handler: () => {
    throw new AppError({
      code: "TOO_MANY_REQUESTS",
      message: API_ERROR_CODE_TO_MESSAGE["TOO_MANY_REQUESTS"],
    });
  },
});
