import { API_ERROR_CODE_TO_STATUS, type ApiErrorCode } from "@repo/shared";

export interface AppErrorOptions<T = any> {
  message: string;
  // statusCode?: number;
  errors?: T[];
  code: ApiErrorCode;
}

export class AppError<T = any> extends Error {
  statusCode: number;
  errors: T[];
  code: ApiErrorCode;

  constructor({
    message,
    // statusCode = 500,
    code,
    errors = [],
  }: AppErrorOptions<T>) {
    super(message);
    this.statusCode = API_ERROR_CODE_TO_STATUS[code];
    this.errors = errors || [];
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
