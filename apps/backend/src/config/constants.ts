import type { CookieOptions } from "express";

export const ENV_LOADED = process.env["ENV_LOADED"] === "yes";
export const ENV = process.env["ENV"] || "dev";

export const IS_IN_PROD = ENV.includes("PROD");

export const ALLOWED_ORIGINS = [
  ...(process.env["ALLOWED_ORIGINS"]?.split(",") ?? []),
];

export const ACCESS_TOKEN_SECRET = process.env["ACCESS_TOKEN_SECRET"];
export const REFRESH_TOKEN_SECRET = process.env["REFRESH_TOKEN_SECRET"];

export const SALT = 10;

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: ENV === "prod",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
