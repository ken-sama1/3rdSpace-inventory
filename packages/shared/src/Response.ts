export type ResponseBody<T = any> = {
  message: string;
  data: T;
};

export type ResponseError<T = any> = {
  message: string;
  errors: T[];
};
