export const ENV = process.env["ENV"] || "dev";

export const IS_IN_PROD = ENV.includes("PROD");

export const ALLOWED_ORIGINS = [
  ...(process.env["ALLOWED_ORIGINS"]?.split(",") ?? []),
];
