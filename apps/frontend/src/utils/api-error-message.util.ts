import {
  API_ERROR_CODE_TO_MESSAGE,
  type ApiErrorCode,
  type ResponseError,
} from "@repo/shared";
import { isAxiosError } from "axios";

export const getApiErrorMessage = (
  error: unknown,
  fallbackCode: ApiErrorCode = "UNKNOWN_ERROR"
): string => {
  if (!isAxiosError<ResponseError>(error)) {
    return API_ERROR_CODE_TO_MESSAGE[fallbackCode];
  }

  const code = error.response?.data.code;

  return code !== undefined && Object.hasOwn(API_ERROR_CODE_TO_MESSAGE, code)
    ? API_ERROR_CODE_TO_MESSAGE[code]
    : API_ERROR_CODE_TO_MESSAGE[fallbackCode];
};
