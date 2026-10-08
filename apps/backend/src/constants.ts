import type { CookieOptions } from "express";

export const ENV_LOADED = process.env["ENV_LOADED"] === "yes";
export const ENV = process.env["ENV"] || "dev";

export const IS_IN_PROD = ENV.includes("prod");

export const ALLOWED_ORIGINS = [
  ...(process.env["ALLOWED_ORIGINS"]?.split(",") ?? []),
];

export const ACCESS_TOKEN_SECRET = process.env["ACCESS_TOKEN_SECRET"];
export const REFRESH_TOKEN_SECRET = process.env["REFRESH_TOKEN_SECRET"];

export const SALT = 10;

export const PORT = process.env["PORT"];

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: IS_IN_PROD,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const EXPIRES_AT_30D_FDATE = new Date();
EXPIRES_AT_30D_FDATE.setDate(EXPIRES_AT_30D_FDATE.getDate() + 30);
