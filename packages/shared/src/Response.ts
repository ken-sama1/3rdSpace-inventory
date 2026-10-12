import type { ApiErrorCode } from "./errors/api-error.js";

export type ResponseBody<T = unknown> = {
  message: string;
  data: T;
};

export type ResponseError<T = unknown> = {
  message: string;
  errors: T[];
  code: ApiErrorCode;
};
