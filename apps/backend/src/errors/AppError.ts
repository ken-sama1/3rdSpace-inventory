export class AppError<T = any> extends Error {
  statusCode: number;
  errors: T[];

  constructor(message: string, statusCode = 500, errors?: T[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || [];

    Error.captureStackTrace(this, this.constructor);
  }
}
