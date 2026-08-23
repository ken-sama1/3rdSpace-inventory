export const ApiErrorCode = {
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",

  // Inventory Item
  ITEM_IN_USE: "ITEM_IN_USE",
  STOCK_INSUFFICIENT: "STOCK_INSUFFICIENT",
} as const;

export type ApiErrorCode = keyof typeof ApiErrorCode;

export const API_ERROR_CODE_TO_MESSAGE: Record<ApiErrorCode, string> = {
  [ApiErrorCode.ITEM_IN_USE]: "This item is in use and cannot be deleted.",
  [ApiErrorCode.STOCK_INSUFFICIENT]: "Stock insufficient",
  [ApiErrorCode.VALIDATION_ERROR]: "Invalid Request",
  [ApiErrorCode.NOT_FOUND]: "Not found",
  [ApiErrorCode.UNKNOWN_ERROR]: "Something went wrong!",
  [ApiErrorCode.INTERNAL_ERROR]: "Unexpected error occured, try again later",
} as const;

export const API_ERROR_CODE_TO_STATUS: Record<ApiErrorCode, number> = {
  [ApiErrorCode.INTERNAL_ERROR]: 500,
  [ApiErrorCode.NOT_FOUND]: 404,
  [ApiErrorCode.ITEM_IN_USE]: 409,
  [ApiErrorCode.STOCK_INSUFFICIENT]: 400,
  [ApiErrorCode.VALIDATION_ERROR]: 400,
  [ApiErrorCode.UNKNOWN_ERROR]: 400,
};
