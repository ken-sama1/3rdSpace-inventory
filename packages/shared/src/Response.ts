import type { ApiErrorCode } from "./errors/ApiError.js";

export type ResponseBody<T = any> = {
  message: string;
  data: T;
};

export type ResponseError<T = any> = {
  message: string;
  errors: T[];
  code: ApiErrorCode;
};
