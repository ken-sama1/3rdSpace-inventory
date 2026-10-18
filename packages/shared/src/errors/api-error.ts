export const ApiErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNAUTHORIZED_ERROR: "UNAUTHORIZED_ERROR",
  FORBIDDEN_ERROR: "FORBIDDEN_ERROR",
  CONFLICT: "CONFLICT",
  // Inventory Item
  STOCK_INSUFFICIENT: "STOCK_INSUFFICIENT",
} as const;

export type ApiErrorCode = keyof typeof ApiErrorCode;

export const API_ERROR_CODE_TO_MESSAGE: Record<ApiErrorCode, string> = {
  [ApiErrorCode.STOCK_INSUFFICIENT]: "Insufficient stock",
  [ApiErrorCode.VALIDATION_ERROR]: "Invalid value",
  [ApiErrorCode.NOT_FOUND]: "Not found",
  [ApiErrorCode.UNKNOWN_ERROR]: "Something went wrong!",
  [ApiErrorCode.INTERNAL_ERROR]: "Try again later",
  [ApiErrorCode.UNAUTHORIZED_ERROR]: "Unauthorized",
  [ApiErrorCode.FORBIDDEN_ERROR]: "Forbidden",
  [ApiErrorCode.CONFLICT]: "Conflict",
} as const;

export const API_ERROR_CODE_TO_STATUS: Record<ApiErrorCode, number> = {
  [ApiErrorCode.INTERNAL_ERROR]: 500,
  [ApiErrorCode.STOCK_INSUFFICIENT]: 400,
  [ApiErrorCode.UNAUTHORIZED_ERROR]: 401,
  [ApiErrorCode.FORBIDDEN_ERROR]: 403,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.VALIDATION_ERROR]: 400,
  [ApiErrorCode.UNKNOWN_ERROR]: 400,
  [ApiErrorCode.CONFLICT]: 409,
};
